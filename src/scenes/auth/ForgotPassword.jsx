import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // const handleSendEmail = async () => {
  //   try {
  //     await axios.post("http://localhost:9999/api/auth/forgot-password", { email }
  //     );
  //     setMessage("Email sent successfully! Please check your inbox.");
  //     setTimeout(() => navigate("/verify-password"), 2000); // Redirect after 2 seconds
  //   } catch (error) {
  //     setMessage("Failed to send email: " + (error.response?.data || error.message));
  //   }
  // };
  const handleSendEmail = async () => {
    const formData = new URLSearchParams();
    formData.append("email", email);
  
    try {
      await axios.post("http://localhost:9999/api/auth/forgot-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      setMessage("Email sent successfully! Please check your inbox.");
      localStorage.setItem("resetEmail", email);
      setTimeout(() => navigate("/verify-password"), 2000);
    } catch (error) {
      setMessage("Failed to send email: " + (error.response?.data || error.message));
    }
  };
  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.mode === "light" ? "#ffffff" : "#141b2d"} // Updated dark mode background
    >
      <Box
        width="400px"
        p="20px"
        borderRadius="8px"
        bgcolor={theme.palette.mode === "light" ? "#f5f5f5" : "#1F2A40"} // Updated inner box background for dark mode
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <Typography variant="h4" mb={2} textAlign="center" >
          Forgot Password
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleSendEmail}
          sx={{ mt: 2 }}
        >
          Send Email
        </Button>
        {message && (
          <Typography mt={2} color="green" textAlign="center">
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
