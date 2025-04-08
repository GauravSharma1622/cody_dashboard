import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

const EditModal = ({ open, editData, setEditData, onClose, onSave }) => {
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...editData.projects];
    updatedProjects[index][field] = value;
    setEditData({ ...editData, projects: updatedProjects });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Timesheet</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Date"
          type="date"
          value={editData.date}
          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        {editData.projects?.map((project, index) => (
          <div key={index} style={{ marginTop: 20, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}>
            <Typography variant="subtitle1" gutterBottom>
              Project {index + 1}
            </Typography>
            <TextField
              label="Project Name"
              value={project.projectName}
              onChange={(e) => handleProjectChange(index, "projectName", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Hours Worked"
              value={project.hoursWorked}
              onChange={(e) => handleProjectChange(index, "hoursWorked", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Task / Notes"
              value={project.notes}
              onChange={(e) => handleProjectChange(index, "notes", e.target.value)}
              fullWidth
              margin="normal"
            />
            {index < editData.projects.length - 1 && <Divider sx={{ mt: 2 }} />}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
