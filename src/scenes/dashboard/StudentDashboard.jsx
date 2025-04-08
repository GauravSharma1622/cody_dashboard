import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";

const StudentDashboard = () => {
  return (
    <Box m="20px">
      <Header title="STUDENT DASHBOARD" subtitle="Welcome, Student!" />
      <Typography variant="h6">This is the student dashboard.</Typography>
    </Box>
  );
};

export default StudentDashboard;
