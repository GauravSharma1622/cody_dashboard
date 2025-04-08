import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';
import { useState } from 'react'; // Import useState for managing messages
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState(""); // State to hold the message
  const [messageType, setMessageType] = useState("success"); // State for message type

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:9999/auth/login", values); // Ensure this URL is correct
      const userRole = response.data.role;
      localStorage.setItem("token",response.data.jwt ); // Store user data in local storage
      dispatch(setUser(response.data));

      setMessage("Login successful!"); // Set success message
      setMessageType("success"); // Success message type

      if (userRole === "admin") {
        navigate("/dashboard/admin");
      } else if (userRole === "employee") {
        navigate("/dashboard/employee");
      } else {
        setMessage("Invalid role");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Login failed: " + (error.response?.data || error.message)); // Set error message
      setMessageType("error"); // Error message type
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.mode === 'light' ? '#ffffff' : colors.primary[500]} // Dynamically adapt to theme
    >
      <Box
        width="400px"
        p="20px"
        borderRadius="8px"
        bgcolor={theme.palette.mode === 'light' ? '#f5f5f5' : colors.primary[400]} // Dynamically adapt to theme
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <Header title="LOGIN" subtitle="Access Your Account" />
        
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
          validationSchema={loginSchema}
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
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="1fr"
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  autoComplete="off"
                  error={!!touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  autoComplete="new-password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Login
                </Button>
                <Typography mt="10px">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{
                      color: theme.palette.mode === "light" ? "indigo" : "cyan",
                      textDecoration: "none",
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
                <Typography mt="10px">
                  <Link
                    to="/forgot-password"
                    style={{
                      color: theme.palette.mode === "light" ? "indigo" : "cyan",
                      textDecoration: "none",
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const loginSchema = yup.object().shape({
  username: yup.string().required("Required"),
  password: yup.string().required("Required"),
});

const initialValues = {
  username: "",
  password: "",
};

export default Login;
