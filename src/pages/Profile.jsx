import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  ShieldCheck,
  Eye,
  List,
  Star,
  Lock,
  ChevronRight,
  Mail,
  Zap,
  Camera,
  Upload,
} from "lucide-react";
import { getMyRatings } from "../api/ratings";
import { uploadAvatar } from "../services/userService";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile/");
      const data = res.data;

      setUser({
        ...data,
        avatar_url: data.avatar_url || data.avatar || null,
      });

      try {
        const statsRes = await api.get(
          `/social/follow/stats/?user_id=${res.data.id}`
        );
        setFollowStats({
          followers: statsRes.data.followers_count,
          following: statsRes.data.following_count,
        });
      } catch (err) {
        console.error("Follow stats error:", err);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error("Failed to load profile");
      }
      // 401 handled by api.js interceptor
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleDisableMFA = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/mfa/disable/");
      toast.success("MFA disabled successfully");
      setUser((prev) => ({ ...prev, mfa_enabled: false }));
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error("Failed to disable MFA");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await getMyRatings();
      const ratingsData = res.data;

      const enriched = await Promise.all(
        ratingsData.map(async (r) => {
          const movieRes = await api.get(`/movies/${r.movie_id}/`);
          return { ...r, movie: movieRes.data };
        })
      );

      setRatings(enriched);
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
      toast.error("Failed to load ratings");
    }
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const updatedUser = await uploadAvatar(file);
      const avatarUrl = updatedUser.avatar_url || updatedUser.avatar;

      setUser({
        ...updatedUser,
        avatar_url: avatarUrl ? `${avatarUrl}?t=${Date.now()}` : null,
      });

      toast.success("✅ Profile photo updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchRatings();
  }, []);

if (loadingProfile) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            {/* Animated logo mark */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <ShieldCheck
                  size={64}
                  className="text-emerald-500"
                  strokeWidth={1.5}
                />
              </motion.div>
              
              {/* Pulsing rings */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
              />
              <motion.div
                animate={{
                  scale: [1, 1.8, 2.5],
                  opacity: [0.3, 0.1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border border-emerald-500/20"
              />
            </div>

            {/* Progressive loading text */}
            <div className="text-center space-y-2">
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-[11px] font-medium text-white tracking-[0.3em] uppercase">
                  Loading
                </span>
              </motion.div>
              
              {/* Progress bar */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
        ).toFixed(1)
      : "0.0";

  return (
    <PageWrapper>
      <Container initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* HEADER WITH PHOTO UPLOAD */}
        <HeroSection className="bg-black py-20 border-b border-zinc-900/80 relative overflow-hidden">
          {/* Subtle ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.01] blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12 px-6">
            {/* Avatar with Upload Feature */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/10 blur-xl transition-all duration-700 -z-10"></div>

              <div className="w-36 h-36 rounded-full border-2 border-zinc-800 p-1 group-hover:border-emerald-500/60 transition-all duration-700 bg-black">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center text-zinc-500 overflow-hidden relative">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-full h-full object-cover rounded-full"
                      key={user.avatar_url}
                    />
                  ) : (
                    <User
                      size={52}
                      strokeWidth={1}
                      className="group-hover:text-white transition-colors duration-700"
                    />
                  )}
                  {uploading ? (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <button
                      onClick={handleChoosePhoto}
                      className="absolute inset-0 bg-black/0 hover:bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-500 cursor-pointer backdrop-blur-sm"
                    >
                      <Camera size={26} className="text-white drop-shadow-lg" />
                    </button>
                  )}
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: "none" }}
              />

              {user.mfa_enabled && (
                <div
                  title="2FA Active"
                  className="absolute -bottom-1 -right-1 p-2 bg-black border-2 border-emerald-500/60 text-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <ShieldCheck size={14} strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                  {user.username}
                </h1>
                {user.mfa_enabled && (
                  <div className="p-1.5 rounded-full bg-emerald-500/10">
                    <Zap
                      size={14}
                      className="text-emerald-500 fill-emerald-500/30"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-sm font-light mb-3">
                <div className="p-1 rounded-full bg-white/5">
                  <Mail size={11} className="opacity-60" />
                </div>
                <span className="tracking-wide text-zinc-400">
                  {user.email}
                </span>
              </div>

              <button
                onClick={handleChoosePhoto}
                disabled={uploading}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-emerald-400 transition-all duration-300 mb-10 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="p-0.5 rounded-full bg-white/5 group-hover:bg-emerald-500/20 transition-colors">
                  <Upload size={11} />
                </div>
                <span className="tracking-wide">
                  {uploading ? "Uploading..." : "Change Photo"}
                </span>
              </button>

              {/* Stats Section */}
              <div className="flex items-center justify-start gap-12 border-t border-white/5 pt-10 w-full md:w-auto flex-wrap">
                {/* Followers */}
                <button
                  onClick={() =>
                    navigate(`/connections/${user.id}?tab=followers`)
                  }
                  className="group flex flex-col items-center min-w-[90px] transition-all duration-700 ease-out"
                >
                  <span className="text-3xl font-light text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                    {followStats.followers.toLocaleString()}
                  </span>
                  <div className="w-6 h-px bg-white/10 my-2 group-hover:w-10 group-hover:bg-emerald-500/60 transition-all duration-500" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Followers
                  </span>
                </button>

                <div className="w-px h-8 bg-white/5"></div>

                {/* Following */}
                <button
                  onClick={() =>
                    navigate(`/connections/${user.id}?tab=following`)
                  }
                  className="group flex flex-col items-center min-w-[90px] transition-all duration-700 ease-out"
                >
                  <span className="text-3xl font-light text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                    {followStats.following.toLocaleString()}
                  </span>
                  <div className="w-6 h-px bg-white/10 my-2 group-hover:w-10 group-hover:bg-emerald-500/60 transition-all duration-500" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Following
                  </span>
                </button>

                <div className="w-px h-8 bg-white/5"></div>

                {/* Total Likes Received ✅ NEW */}
                <div className="group flex flex-col items-center min-w-[90px] transition-all duration-700 ease-out">
                  <span className="text-3xl font-light text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                    {user.total_likes_received?.toLocaleString() || 0}
                  </span>
                  <div className="w-6 h-px bg-white/10 my-2 group-hover:w-10 group-hover:bg-emerald-500/60 transition-all duration-500" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Likes
                  </span>
                </div>

                {/* Most Liked Review ✅ NEW */}
                {user.most_liked_review && (
                  <>
                    <div className="w-px h-8 bg-white/5"></div>
                    <div
                      onClick={() =>
                        navigate(`/movie/${user.most_liked_review.movie_id}`)
                      }
                      className="group flex flex-col items-center min-w-[90px] transition-all duration-700 ease-out cursor-pointer"
                    ></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </HeroSection>

        {/* DASHBOARD */}
        <DashboardGrid>
          <ActionCard onClick={() => navigate("/watchlist")}>
            <div className="icon-box green">
              <Eye size={24} />
            </div>
            <div className="card-content">
              <h3>Watchlist</h3>
              <p>Continue your cinematic journey</p>
            </div>
            <div className="card-footer">
              <ChevronRight size={18} />
            </div>
          </ActionCard>

          <ActionCard onClick={() => navigate("/activity")}>
            <div className="icon-box white">
              <Star size={24} />
            </div>
            <div className="card-content">
              <h3>Ratings & Reviews</h3>
              <p>Manage your reviews & scores</p>
            </div>
            <div className="card-footer">
              <span className="badge">{ratings.length} Reviews</span>
              <ChevronRight size={18} />
            </div>
          </ActionCard>

          <ActionCard onClick={() => navigate("/lists")}>
            <div className="icon-box green">
              <List size={24} />
            </div>
            <div className="card-content">
              <h3>My Lists</h3>
              <p>Organized movie collections</p>
            </div>
            <div className="card-footer">
              <span className="badge">3 Collections</span>
              <ChevronRight size={18} />
            </div>
          </ActionCard>

          <SecurityCard $active={user.mfa_enabled}>
            <div className="header">
              <Lock size={20} />
              <h4>Account Security</h4>
            </div>
            <p>Two-factor authentication adds an extra layer of protection.</p>
            <MfaBtn
              $isEnabled={user.mfa_enabled}
              onClick={
                user.mfa_enabled
                  ? handleDisableMFA
                  : () => navigate("/enable-mfa")
              }
            >
              {user.mfa_enabled ? "Deactivate 2FA" : "Enable"}
            </MfaBtn>
          </SecurityCard>
        </DashboardGrid>
      </Container>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #000000;
  /* Navbar Offset: Adjust 80px based on your actual Navbar height */
  padding-top: 100px;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 4rem;
  color: #ffffff;
  font-family:
    "Inter",
    -apple-system,
    sans-serif;

  @media (max-width: 768px) {
    padding-top: 80px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const Container = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  margin-bottom: 2rem;
  position: relative;

  .profile-main {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    border-radius: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(0, 255, 136, 0.15);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(0, 255, 136, 0.35);
      background: rgba(0, 0, 0, 0.8);
    }

    @media (max-width: 640px) {
      flex-direction: column;
      text-align: center;
    }
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #0a0a0a, #050505);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ff88;
  border: 2px solid rgba(0, 255, 136, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    border-color: #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
  }
`;

const ShieldBadge = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #00ff88;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  border: 2px solid #000000;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(0, 255, 136, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0);
    }
  }
`;

const UserInfo = styled.div`
  flex: 1;

  .follow-stats {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.75rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .stat-item .count {
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
  }

  .stat-item .label {
    font-size: 0.65rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stat-item:hover .count {
    color: #00ff88;
  }

  .username {
    font-size: 1.6rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 640px) {
      justify-content: center;
    }
  }

  .verified-icon {
    color: #00ff88;
    background: rgba(0, 255, 136, 0.15);
    padding: 4px;
    border-radius: 50%;
  }

  .meta-list {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      justify-content: center;
    }
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: #888888;
    transition: color 0.2s ease;

    &:hover {
      color: #00ff88;
    }
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ff88;
    background: #0d0d0d;
  }

  .icon-box {
    width: 50px;
    height: 50px;
    border-radius: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;

    &.green {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
    &.white {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }
  p {
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .badge {
      font-size: 0.75rem;
      background: #111;
      padding: 4px 12px;
      border-radius: 8px;
      color: #888;
      border: 1px solid #222;
    }
  }
`;

const SecurityCard = styled.div`
  background: #0a0a0a;
  border: 1px solid ${(props) => (props.$active ? "#00ff8833" : "#ff444433")};
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: ${(props) => (props.$active ? "#00ff88" : "#ff4444")};
  }

  p {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  .mfa-status {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
`;

const MfaBtn = styled.button`
  margin-top: auto;
  padding: 0.8rem;
  border-radius: 35px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  background: ${(props) => (props.$isEnabled ? "#111" : "#00ff88")};
  color: ${(props) => (props.$isEnabled ? "#ff4444" : "#000")};
  border: 1px solid
    ${(props) => (props.$isEnabled ? "#ff444433" : "transparent")};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: 0.5;
  }
`;

const LoadingContainer = styled.div`
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`;

const spin = keyframes` to { transform: rotate(360deg); } `;
const GlowSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #111;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #555;
  font-size: 0.7rem;
  letter-spacing: 2px;
`;

const ButtonSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: inherit;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  margin: 0 auto;
`;
