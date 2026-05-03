import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";





export default function VerifyEmail() {
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    code: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-email/", form);
      toast.success("Identity confirmed. Welcome back.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
  if (!form.email) {
    toast.error("Enter your email first");
    return;
  }

  try {
    await api.post("/auth/resend-otp/", {
      email: form.email,
    });

    toast.success("New verification code sent");
  } catch (error) {
    toast.error("Failed to resend code");
  }
};

  return (
    <StyledWrapper>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="verify-card"
      >
        <div className="icon-wrapper">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        <div className="header">
          <h2>Verify Identity</h2>
          <p>We've sent a secure code to your registered email address.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-stack">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="enter your email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Verification Code</label>
              <input
                type="text"
                name="code"
                placeholder="Enter the code"
                onChange={handleChange}
                className="code-input"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="verify-button"
          >
            {loading ? "Processing..." : "Confirm Verification"}
          </motion.button>
        </form>

        <p className="resend-text">
<p className="resend-text">
  Didn't receive the code?{" "}
  <span onClick={handleResend}>Resend Code</span>
</p>
        </p>
      </motion.div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background: #050505;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .verify-card {
    background: #121212;
    width: 100%;
    max-width: 400px;
    padding: 48px 32px;
    border-radius: 20px;
    border: 1px solid #1a1a1a;
    text-align: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    background: rgba(34, 197, 94, 0.1);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: #22c55e;
    
    svg { width: 32px; height: 32px; }
  }

  .header h2 {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .header p {
    color: #737373;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 32px;
  }

  .input-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 24px;
    text-align: left;
  }

  .input-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #a3a3a3;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid #262626;
    padding: 14px;
    border-radius: 12px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #22c55e;
      background: #1f1f1f;
    }
  }

  .code-input {
    letter-spacing: 2px;
    font-weight: 400;
    text-align: center;
    font-family: monospace;
  }

  .verify-button {
    width: 100%;
    background: #22c55e;
    color: #000;
    padding: 16px;
    border-radius: 12px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: 0.3s;

    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .resend-text {
    margin-top: 24px;
    font-size: 0.85rem;
    color: #525252;

    span {
      color: #22c55e;
      cursor: pointer;
      font-weight: 600;
      &:hover { text-decoration: underline; }
    }
  }
`;