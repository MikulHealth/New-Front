import axios from "axios";
import { baseUrl } from "./config"; 


export const GetCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${baseUrl}/angel/getCurrentUser`,
      config
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 403) {
      window.location.href = "/login"; 
    }
    return error.response.data;
  }
};


export const GetCurrentMedic = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${baseUrl}/angel/getCurrentMedic`,
      config
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 403) {
      window.location.href = "/login"; 
    }
    return error.response.data;
  }
};

export const UpdateCustomer = async (
  editedUser,
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const response = await axios.put(
      `${baseUrl}/angel/updateCustomer`,
      editedUser,
      config
    );
    if (response && response.data) {
      return { success: true, data: response.data };
    } else {
      console.error("Invalid response:", response);
      return { success: false, error: "Invalid response from the server" };
    }
  } catch (error) {
    console.error("Failed to update user details:", error);
    return {
      success: false,
      error: error.response?.data || "Unknown error occurred",
    };
  }
};
