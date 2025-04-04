import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
} from "@mui/material";
import { tokens } from "../../theme";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { deleteTimesheet } from "../../common api's/delete";

const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens ? tokens(theme.palette.mode) : { primary: { 500: "#ffffff" } };
  const [timesheetHistory, setTimesheetHistory] = useState([]);
  const username = useSelector((state) => state.user.user?.username);
  const token = localStorage.getItem("token");
console.log(timesheetHistory,"timesheetHistory");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event?.target?.value?.toLowerCase());
  };

  const filteredTimesheetHistory = timesheetHistory.filter((entry) => {
    const employeeNameMatches = username?.toLowerCase().includes(searchQuery);
    const projectNameMatches = entry.projects?.some((project) =>
      project?.projectName?.toLowerCase().includes(searchQuery)
    );
    return employeeNameMatches || projectNameMatches;
  });

  const fetchAllTimesheetHistory = async () => {
    try {
      const response = await axios.get("http://localhost:9999/api/timesheets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimesheetHistory(response.data);
    } catch (error) {
      console.error("Error fetching timesheet history:", error);
    }
  };

  useEffect(() => {
    fetchAllTimesheetHistory();
  }, []);

  const handleClick = async (id) => {
    console.log(id, "id being deleted");
  
    const token = localStorage.getItem("token"); // Ensure token is stored in localStorage
  
    if (!token) {
      console.error("Admin token not found!");
      return;
    }
  
    const result = await deleteTimesheet(id, token);
  
    if (result.success) {
      console.log("Timesheet deleted successfully!");
      fetchAllTimesheetHistory(); // Refresh the list after delete
    } else {
      console.error("Failed to delete timesheet.");
    }
  };
  
  
// const handleClick = (id) => {
//   console.log(id,"iddddddddddddddddddddd");
//   deleteTimesheet(id);  
// }


  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.palette.mode === "light" ? "#ffffff" : colors.primary[500]}
      p={4}
      borderRadius="8px"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
    >
      {/* Search Bar */}
      <Box mb={2} width="100%">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Employee Name or Project Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>

      {/* Timesheet History Section */}
      <Box mt={4} width="100%">
        <Typography variant="h6" mb={2}>
          Employee Timesheet History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTimesheetHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry, index) => {
                  const groupedProjects = entry.projects.reduce((acc, project) => {
                    const existingGroup = acc.find((item) => item.timesheetId === project.timesheetId);
                    if (existingGroup) {
                      existingGroup.projects.push(project);
                      existingGroup.totalHours += project.hoursWorked;
                    } else {
                      acc.push({
                        timesheetId: project.timesheetId,
                        projects: [project],
                        totalHours: project.hoursWorked,
                      });
                    }
                    return acc;
                  }, []);

                  return groupedProjects.map((group, groupIndex) => // Check if group object contains timesheetId
                 (
                    <TableRow key={`${index}-${groupIndex}`}>
                      <TableCell>{username}</TableCell>
                      <TableCell>
                        {group.projects.map((project, projectIndex) => (
                          <span key={projectIndex}>
                            {project.projectName}
                            {projectIndex < group.projects.length - 1 ? " / " : ""}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>{group.totalHours}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>
                        {group.projects.map((project, projectIndex) => (
                          <span key={projectIndex}>
                            {project.notes}
                            {projectIndex < group.projects.length - 1 ? " / " : ""}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="info" size="small" sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button variant="contained" onClick={() => handleClick(entry?.id)}  color="error" size="small">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ));
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={timesheetHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
