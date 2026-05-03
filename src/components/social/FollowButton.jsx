import { useState } from "react";
import { sendFollowRequest, unfollowUser } from "../../services/followService";



export default function FollowButton({ userId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || status === "requested") return;

    setLoading(true);

    try {
      if (status === "following") {
        await unfollowUser(userId);
        setStatus("not_following");
      } else if (status === "not_following") {
        await sendFollowRequest(userId);
        setStatus("requested");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = () => {
    if (loading) return "Loading...";
    if (status === "following") return "Unfollow";
    if (status === "requested") return "Requested";
    return "Follow";
  };

  const getStyle = () => {
    if (status === "following") {
      return "bg-red-500 hover:bg-red-600 text-white";
    }
    if (status === "requested") {
      return "bg-gray-400 text-white cursor-not-allowed";
    }
    return "bg-blue-500 hover:bg-blue-600 text-white";
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || status === "requested"}
      className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${getStyle()} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {getLabel()}
    </button>
  );
}