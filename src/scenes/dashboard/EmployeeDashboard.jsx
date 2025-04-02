import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const EmployeeDashboard = () => {
  const theme = useTheme();
  const colors = tokens
    ? tokens(theme.palette.mode)
    : { primary: { 500: "#ffffff" } }; // Fallback color
  const [timesheetHistory, setTimesheetHistory] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [projects, setProjects] = useState([
    { project: "", hoursWorked: "", notes: "" },
  ]);
  const username = useSelector((state) => state.user.user?.username);
  const token = localStorage.getItem("token");

  const fetchTimesheetHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/api/timesheets/${username}`,
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
    fetchTimesheetHistory();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      // 10MB size limit
      setFileError("");
      setUploadedFiles([...uploadedFiles, file]);
    } else {
      setFileError("File size exceeds 10MB or unsupported format");
    }
  };

  const handleDeleteFile = (fileToDelete) => {
    setUploadedFiles(uploadedFiles.filter((file) => file !== fileToDelete));
  };

  const handleAddProject = (values, setFieldValue) => {
    setFieldValue("projects", [...values.projects, { project: "", hoursWorked: "", notes: "" }]);
  };
  
  const handleRemoveProject = (index, values, setFieldValue) => {
    if (values.projects.length > 1) {
      const updatedProjects = values.projects.filter((_, i) => i !== index);
      setFieldValue("projects", updatedProjects);
    }
  };

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    
    const formattedDate = values.date.toISOString().split('T')[0]; 
  
    // Convert "project" to "projectName"
    const formattedProjects = values.projects.map((proj) => ({
      projectName: proj.project,  // Change key to match backend
      hoursWorked: Number(proj.hoursWorked), // Ensure numeric value
      notes: proj.notes,
    }));
  
    const payload = {
      date: formattedDate,
      projects: formattedProjects,
      username: username, 
    };
  
    try {
      const response = await axios.post(
        "http://localhost:9999/api/timesheets",
        payload, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Timesheet submitted:", response.data);
      alert("Timesheet submitted successfully!");
      fetchTimesheetHistory(); 
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      alert("Error submitting timesheet");
    }
  };
  

  const timesheetSchema = yup.object().shape({
    date: yup.date().required("Date is required"),
    projects: yup
      .array()
      .of(
        yup.object().shape({
          project: yup.string().required("Project/Client is required"),
          hoursWorked: yup
            .number()
            .min(0.1)
            .required("Hours worked is required"),
          notes: yup.string(),
        })
      )
      .min(1, "At least one project is required"),
  });

  const initialValues = {
    date: new Date(),
    projects,
  };

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
      <Typography variant="h5" mb={2}>
        Timesheet Entry
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={timesheetSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue 
        }) => (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box display="grid" gap="16px">
              <DatePicker
                selected={values.date}
                onChange={(date) =>
                  handleChange({ target: { name: "date", value: date } })
                }
                customInput={<TextField fullWidth variant="filled" />}
                label="Date"
                name="date"
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
              />

              {/* Map over projects array to render multiple project fields */}
              {values.projects.map((project, index) => (
                <Box key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Project/Client"
                        name={`projects[${index}].project`}
                        value={project.project}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.projects?.[index]?.project &&
                          Boolean(errors.projects?.[index]?.project)
                        }
                        helperText={
                          touched.projects?.[index]?.project &&
                          errors.projects?.[index]?.project
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Hours Worked"
                        name={`projects[${index}].hoursWorked`}
                        value={project.hoursWorked}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.projects?.[index]?.hoursWorked &&
                          Boolean(errors.projects?.[index]?.hoursWorked)
                        }
                        helperText={
                          touched.projects?.[index]?.hoursWorked &&
                          errors.projects?.[index]?.hoursWorked
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Notes"
                        name={`projects[${index}].notes`}
                        value={project.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.projects?.[index]?.notes &&
                          Boolean(errors.projects?.[index]?.notes)
                        }
                        helperText={
                          touched.projects?.[index]?.notes &&
                          errors.projects?.[index]?.notes
                        }
                      />
                    </Grid>
                  </Grid>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleRemoveProject(index, values, setFieldValue)}
                    disabled={values.projects.length === 1}
                    sx={{ mt: 2 }}
                  >
                    Remove Project
                  </Button>
                </Box>
              ))}

              <Button
                type="button"
                color="secondary"
                variant="contained"
                fullWidth
                onClick={() => handleAddProject(values, setFieldValue)}
              >
                Add More Projects
              </Button>

              <Button
                type="submit"
                color="secondary"
                variant="contained"
                fullWidth
                mt={2}
              >
                Submit Timesheet
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* File Upload Section */}
      <Box mt={4} width="100%">
        <Typography variant="h6" mb={2}>
          Upload Timesheet or Related Documents
        </Typography>

        <input
          type="file"
          accept=".pdf,.docx,.xlsx"
          onChange={handleFileUpload}
        />

        {fileError && <Typography color="error">{fileError}</Typography>}

        <Box mt={2}>
          {uploadedFiles.map((file, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              mb={1}
            >
              <Typography variant="body2">{file.name}</Typography>
              <Button color="error" onClick={() => handleDeleteFile(file)}>
                Delete
              </Button>
            </Box>
          ))}
        </Box>
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
                        color="primary"
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

export default EmployeeDashboard;
