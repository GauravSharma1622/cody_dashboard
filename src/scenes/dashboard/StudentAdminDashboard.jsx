import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";

const StudentAdminDashboard = () => {
  return (
    <Box m="20px">
      <Header title="STUDENT ADMIN DASHBOARD" subtitle="Manage Students" />
      <Typography variant="h6">This is the student admin dashboard.</Typography>
    </Box>
  );
};

export default StudentAdminDashboard;
