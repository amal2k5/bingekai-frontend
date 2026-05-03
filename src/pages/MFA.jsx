import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";




export default function MFA() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { temp_token, email } = location.state || {};

  useEffect(() => {
    if (!temp_token) {
      toast.error("Unauthorized access");
      navigate("/login");
    }
  }, [temp_token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Enter valid 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/mfa/verify-login/", {
        otp: code,
        temp_token: temp_token,
      });

      const { access, refresh } = response.data;

  
      login(access, refresh);

      toast.success("MFA verified successfully");
      navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303]">
      <div className="bg-[#0a0a0a] p-8 rounded-lg border border-[#1a1a1a] w-96">
        <h2 className="text-white text-2xl font-bold mb-2">
          Two-Factor Authentication
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Enter the 6-digit code from your authenticator app
          {email && (
            <span className="block mt-1 text-[#22c55e]">{email}</span>
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
            }
            placeholder=""
            className="w-full bg-[#111] border border-[#222] rounded px-4 py-3 text-white text-center text-2xl tracking-widest"
            maxLength={6}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-[#22c55e] text-black font-semibold py-3 rounded"
          >
            {isLoading ? "VERIFYING..." : "VERIFY"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-500 text-sm w-full text-center"
          >
            ← Back to login
          </button>
        </form>
      </div>
    </div>
  );
}