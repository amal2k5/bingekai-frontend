import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";





export default function VerifyMFA() {

  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const user_id = location.state?.user_id;

  useEffect(() => {
    if (!user_id) {
      toast.error("Unauthorized access");
      navigate("/login");
    }
  }, [user_id, navigate]);

  const handleVerify = async () => {
    try {

      const res = await api.post("/auth/mfa/verify-login/", {
        user_id,
        otp
      });

      const { access, refresh } = res.data;

      login(access, refresh);

      toast.success("Login successful");

      navigate("/");

    } catch {

      toast.error("Invalid OTP");

    }
  };


  

  return (
    <div style={{padding:"40px", color:"white"}}>
      <h2>Enter OTP</h2>

      <input
        value={otp}
        onChange={(e)=>setOtp(e.target.value)}
        placeholder="6 digit code"
      />

      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}