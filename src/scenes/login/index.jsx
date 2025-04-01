import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:9999/auth/login", values); // Ensure this URL is correct
      const userRole = response.data.role;
      console.log(response.data, "lllllllllllll");
      dispatch(setUser(response.data));

      if (userRole === "guest") {
        navigate("/dashboard/admin");
      } else if (userRole === "employee") {
        navigate("/dashboard/employee");
      } else {
        console.error("Invalid role");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={colors.primary[500]}
    >
      <Box
        width="400px"
        p="20px"
        borderRadius="8px"
        bgcolor={colors.primary[400]}
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <Header title="LOGIN" subtitle="Access Your Account" />
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
            <form onSubmit={handleSubmit}>
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
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const loginSchema = yup.object().shape({
  username: yup.string().required("Required"), // Updated validation for username
  password: yup.string().required("Required"),
});

const initialValues = {
  username: "", // Updated initial value for username
  password: "",
};

export default Login;
