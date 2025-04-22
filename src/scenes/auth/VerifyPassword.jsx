import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Get email from localStorage
  const email = localStorage.getItem("resetEmail");

  // Handle OTP Verification
  const handleVerifyOTP = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", verificationCode); // use "code" if backend expects that

    try {
      await axios.post("http://localhost:9999/api/auth/verify-otp", formData);
      setMessage("OTP verified successfully! Please set your new password.");
      setIsVerified(true);
    } catch (error) {
      setMessage("Failed to verify OTP: " + (error.response?.data || error.message));
    }
  };

  // Handle Setting New Password
  const handleSetNewPassword = async () => {
    console.log("Email:", email);
    console.log("New Password:", newPassword);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("newPassword", newPassword);

    try {
      const response = await axios.post("http://localhost:9999/api/auth/reset-password", formData);
      console.log("Response:", response.data);
      setMessage("Password reset successfully! You can now log in.");
      localStorage.removeItem("resetEmail");
      navigate("/login") // optional: clear email after success
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to reset password: " + (error.response?.data || error.message));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.mode === "light" ? "#ffffff" : "#141b2d"}
    >
      <Box
        width="400px"
        p="20px"
        borderRadius="8px"
        bgcolor={theme.palette.mode === "light" ? "#f5f5f5" : "#1F2A40"}
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <Typography variant="h4" mb={2} textAlign="center">
          {isVerified ? "Set New Password" : "Verify OTP"}
        </Typography>

        {!isVerified ? (
          <>
            <TextField
              fullWidth
              variant="filled"
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleVerifyOTP}
              sx={{ mt: 2 }}
            >
              Verify OTP
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              variant="filled"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleSetNewPassword}
              sx={{ mt: 2 }}
            >
              Set New Password
            </Button>
          </>
        )}

        {message && (
          <Typography mt={2} color="green" textAlign="center">
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VerifyPassword;
