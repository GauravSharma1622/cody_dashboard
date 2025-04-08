import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import axios from "axios";

const VerifyPassword = () => {
  const theme = useTheme();
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false); // State to track OTP verification

  const handleVerifyOTP = async () => {
    try {
      await axios.post("http://localhost:9999/auth/verify-otp", {
        code: verificationCode,
      });
      setMessage("OTP verified successfully! Please set your new password.");
      setIsVerified(true); // Mark OTP as verified
    } catch (error) {
      setMessage("Failed to verify OTP: " + (error.response?.data || error.message));
    }
  };

  const handleSetNewPassword = async () => {
    try {
      await axios.post("http://localhost:9999/auth/set-new-password", {
        newPassword,
      });
      setMessage("Password reset successfully! You can now log in.");
    } catch (error) {
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
