import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("/api/login", values); // Call the backend login API
      const userRole = response.data.role; // Assume the API returns a role in the response

      if (userRole === "admin") {
        navigate("/dashboard/admin"); // Navigate to admin dashboard
      } else if (userRole === "employee") {
        navigate("/dashboard/employee"); // Navigate to employee dashboard
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
                  label="Email" // Corrected label
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email" // Corrected name
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
                  name="password" // Corrected name
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
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

const initialValues = {
  email: "",
  password: "",
};

export default Login;
