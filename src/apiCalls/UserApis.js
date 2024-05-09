import axios from "axios";
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
        // "http://localhost:8080/v1/angel/getCurrentUser",
      "https://backend-c1pz.onrender.com/v1/angel/getCurrentUser",
      config
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      // Token expired, redirect to login page
      window.location.href = "/login"; // Modify the path as per your application
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
      // "http://localhost:8080/v1/angel/updateCustomer",
      "https://backend-c1pz.onrender.com/v1/angel/updateCustomer",
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
