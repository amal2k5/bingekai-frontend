import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";






export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);

        const { data } = await api.post("/auth/google/", {
          access_token: tokenResponse.access_token,
        });

        const { access, refresh } = data;

        login(access, refresh);
        toast.success("Google login successful");

        navigate("/", { replace: true });;
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google authentication failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLoading) return;

  setIsLoading(true);

  try {
    const { data } = await api.post("/auth/login/", form);

   
    if (data.mfa_required) {
      navigate("/mfa", {
        state: {
          temp_token: data.temp_token,
          email: form.email,
        },
      });
      return;
    }


const { access, refresh, user } = data;

login(access, refresh, user);


toast.success("Login successful");

if (user.is_staff) {
  navigate("/admin", { replace: true });
} else {
  navigate("/", { replace: true });
}

  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.error ||
      "Login failed";

    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <StyledWrapper className="min-h-screen flex items-center justify-center bg-[#030303]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="login-container"
      >
        <motion.div variants={childVariants} className="header">
          <h1 className="logo">
            BINGE<span className="logo-accent">KAI</span>
          </h1>
          <div className="security-badge">
            <span className="badge-text">USER LOGIN</span>
          </div>
        </motion.div>

        <motion.form
          variants={childVariants}
          onSubmit={handleSubmit}
          className="login-form"
        >
          <div className="input-group">
            <label className="input-label">EMAIL</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="enter your email"
              className="input-field"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">PASSWORD</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="enter your password"
              className="input-field"
              required
              disabled={isLoading}
            />
          </div>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            className="signin-button"
            disabled={isLoading}
          >
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </motion.button>
        </motion.form>

        <motion.div variants={childVariants} className="divider">
          <span>OR CONTINUE WITH</span>
        </motion.div>

        <motion.div variants={childVariants} className="external-login">
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="button"
            onClick={() => googleLogin()}
            className="google-button"
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                3.28-4.74 3.28-8.09z"
              />
            </svg>
            <span>{isLoading ? "PROCESSING..." : "Google"}</span>
          </motion.button>

          <div className="signup-prompt">
            <span className="prompt-text">Don't have an account?</span>
            <motion.span
              whileHover={{ color: "#4ade80" }}
              onClick={() => !isLoading && navigate("/register")}
              className="signup-link"
            >
              Sign up
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #030303;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-container {
    background: #0a0a0a;
    width: 400px;
    padding: 40px 32px;
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 32px;
  }

  .logo {
    color: white;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin: 0 0 8px 0;
    line-height: 1.2;
  }

  .logo-accent {
    color: #22c55e;
  }

  .security-badge {
    display: flex;
    justify-content: center;
  }

  .badge-text {
    color: #444;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* Form */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  .input-label {
    color: #888;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .input-field {
    width: 100%;
    background: #111;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 12px 16px;
    color: white;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .input-field:focus {
    border-color: #22c55e;
    background: #151515;
  }

  .input-field::placeholder {
    color: #333;
  }

  .forgot-password {
    background: none;
    border: none;
    color: #444;
    font-size: 12px;
    text-align: right;
    cursor: pointer;
    margin-top: 4px;
    padding: 0;
    transition: color 0.2s;
    align-self: flex-end;
  }

  .forgot-password:hover {
    color: #22c55e;
  }

  /* Sign In Button */
  .signin-button {
    background: #22c55e;
    color: black;
    border: none;
    border-radius: 6px;
    padding: 14px 16px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    margin-top: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .signin-button:hover {
    background: #4ade80;
  }

  /* Divider */
  .divider {
    text-align: center;
    border-bottom: 1px solid #1a1a1a;
    line-height: 0.1em;
    margin: 32px 0 28px 0;
    width: 100%;
  }

  .divider span {
    background: #0a0a0a;
    padding: 0 16px;
    color: #444;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
  }

  /* External Login */
  .external-login {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
  }

  .google-button {
    width: 100%;
    background: transparent;
    border: 1px solid #222;
    border-radius: 6px;
    color: white;
    padding: 12px 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .google-button:hover {
    background: #111;
    border-color: #333;
  }

  .signup-prompt {
    display: flex;
    gap: 8px;
    font-size: 14px;
  }

  .prompt-text {
    color: #555;
  }

  .signup-link {
    color: #22c55e;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s;
  }

  .signup-link:hover {
    color: #4ade80;
  }

  /* Ensure everything is centered */
  * {
    box-sizing: border-box;
  }
`;