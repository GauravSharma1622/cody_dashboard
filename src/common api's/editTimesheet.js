import axios from "axios";

export const editTimesheet = async (id, data, token) => {
    
    console.log(data.projects,token, "data being sent to edit timesheet");
    
    try {
      const response = await axios.put(
        `http://localhost:9999/api/timesheets/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating timesheet:", error.response?.data || error.message);
      return { success: false };
    }
  };
  