import axios from "axios";

const API_BASE_URL = "http://localhost:9999/api";

export const deleteTimesheet = async (id, token) => {
  try {
    console.log(`Attempting to delete timesheet with ID: ${id}`);

    const response = await axios.delete(`${API_BASE_URL}/timesheets/deletesheets/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Timesheet deleted successfully!");
      return { success: true };
    } else {
      console.error("Unexpected response status:", response.status);
      return { success: false };
    }
  } catch (error) {
    if (error.response) {
      console.error("Error deleting timesheet:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return { success: false };
  }
};
