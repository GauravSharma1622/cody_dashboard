import React, { useState, useEffect } from "react";
import {Box,Button,Typography,useTheme} from "@mui/material";
import { tokens } from "../../theme";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import axios from "axios";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,} from "@mui/material";

const AdminDashboard = () => {
    const theme = useTheme();
    const colors = tokens ? tokens(theme.palette.mode) : { primary: { 500: "#ffffff" } }; // Fallback color
    const [timesheetHistory, setTimesheetHistory] = useState([]);
    const username = useSelector((state) => state.user.user?.username);
    const token = localStorage.getItem("token");
  
    const fetchAllTimesheetHistory = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/timesheets',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTimesheetHistory(response.data);
      } catch (error) {
        console.error("Error fetching timesheet history:", error);
      }
    };
  
    useEffect(() => {
      fetchAllTimesheetHistory();
    }, []);
  
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgcolor={theme.palette.mode === "light" ? "#ffffff" : colors.primary[500]} // Dynamically adapt to theme
        p={4}
        borderRadius="8px"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
  
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
                {timesheetHistory.map((entry, index) => {
                  // Step 1: Group the projects by timesheetId
                  const groupedProjects = entry.projects.reduce(
                    (acc, project) => {
                      const existingGroup = acc.find(
                        (item) => item.timesheetId === project.timesheetId
                      );
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
                    },
                    []
                  );
  
                  // Step 2: Render each grouped entry
                  return groupedProjects.map((group, groupIndex) => (
                    <TableRow key={`${index}-${groupIndex}`}>
                    <TableCell>{username}</TableCell>
                      <TableCell>
                        {/* Step 3: Combine project names with a '/' separator */}
                        {group.projects.map((project, projectIndex) => (
                          <span key={projectIndex}>
                            {project.projectName}
                            {projectIndex < group.projects.length - 1
                              ? " / "
                              : ""}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        {/* Step 4: Sum the hours worked for each group */}
                        {group.totalHours}
                      </TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>
                        {/* Step 5: Combine notes with a '/' separator */}
                        {group.projects.map((project, projectIndex) => (
                          <span key={projectIndex}>
                            {project.notes}
                            {projectIndex < group.projects.length - 1
                              ? " / "
                              : ""}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => {
                            /* edit functionality */
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {
                            /* delete functionality */
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ));
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  };

export default AdminDashboard;
