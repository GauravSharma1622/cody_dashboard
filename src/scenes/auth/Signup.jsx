import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { useState } from "react"; // Import useState for managing messages

const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // State to hold the message
  const [messageType, setMessageType] = useState("success"); // State for message type

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:9999/auth/register", values); // API call for signup
      setMessage("Signup successful! Redirecting to login...");
      console.log(response.data,"kkkkkkkkkkk"); // Log the response data for debugging
      
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage("Signup failed: " + (error.response?.data || error.message));
      setMessageType("error");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.mode === "light" ? "#ffffff" : colors.primary[500]}
    >
      <Box
        width="400px"
        p="20px"
        borderRadius="8px"
        bgcolor={theme.palette.mode === "light" ? "#f5f5f5" : colors.primary[400]}
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <Header title="SIGNUP" subtitle="Create a New Account" />
        
        {/* Display the success or error message */}
        {message && (
          <Box
            bgcolor={messageType === "success" ? "green" : "red"}
            color="white"
            p="10px"
            mb="20px"
            borderRadius="5px"
            textAlign="center"
          >
            <Typography>{message}</Typography>
          </Box>
        )}
        
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={signupSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
              <Box display="grid" gap="20px">
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  autoComplete="off"
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  autoComplete="off"
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  autoComplete="new-password"
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Confirm Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  error={!!touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Signup
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const signupSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default Signup;
