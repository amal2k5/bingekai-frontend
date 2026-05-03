import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";






export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirm_password) {
      return toast.error("Passwords do not match");
    }

    setIsLoading(true);
    
    try {
      await api.post("/auth/register/", {
        username: form.username,
        email: form.email,
        password: form.password
      });
      toast.success("Registration successful! Please verify your email.");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="register-container"
      >
        <div className="register-card">
          <div className="brand-section">
            <motion.h1 
              className="logo"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              BINGE<span className="logo-accent">KAI</span>
            </motion.h1>
            <p className="brand-subtitle">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>

            <motion.button
              type="submit"
              className="register-button"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <div className="footer">
            <p>
              Already have an account?{" "}
              <motion.span
                onClick={() => navigate("/login")}
                className="login-link"
                whileHover={{ color: "#22c55e" }}
              >
                Sign in
              </motion.span>
            </p>
          </div>
        </div>
      </motion.div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;

  .register-container {
    width: 100%;
    max-width: 420px;
  }

  .register-card {
    background: #111;
    border: 1px solid #1f1f1f;
    border-radius: 16px;
    padding: 40px;
    transition: border 0.25s ease, transform 0.2s ease;
  }

  .register-card:hover {
    border-color: #22c55e;
    transform: translateY(-2px);
  }

  .brand-section {
    text-align: center;
    margin-bottom: 32px;
  }

  .logo {
    font-size: 2.5rem;
    font-weight: 900;
    color: white;
    letter-spacing: -1px;
  }

  .logo-accent {
    color: #22c55e;
  }

  .brand-subtitle {
    color: #9ca3af;
    font-size: 0.9rem;
    margin-top: 6px;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #9ca3af;
  }

  .form-group input {
    background: #0f0f0f;
    border: 1px solid #262626;
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 0.95rem;
    color: white;
    transition: border 0.2s ease, background 0.2s ease;
  }

  .form-group input::placeholder {
    color: #6b7280;
  }

  .form-group input:hover {
    border-color: #404040;
  }

  .form-group input:focus {
    outline: none;
    border-color: #22c55e;
    background: #121212;
  }

  .register-button {
    margin-top: 10px;
    background: #22c55e;
    border: none;
    border-radius: 8px;
    padding: 13px;
    font-weight: 600;
    font-size: 0.95rem;
    color: black;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.15s ease;
  }

  .register-button:hover:not(:disabled) {
    background: #16a34a;
    transform: translateY(-1px);
  }

  .register-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .footer {
    margin-top: 26px;
    text-align: center;
  }

  .footer p {
    color: #9ca3af;
    font-size: 0.9rem;
  }

  .login-link {
    color: #22c55e;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .login-link:hover {
    opacity: 0.8;
  }
`;
