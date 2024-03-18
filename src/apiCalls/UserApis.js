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
      //   "http://localhost:8080/v1/angel/getCurrentUser",
      "https://backend-c1pz.onrender.com/v1/angel/getCurrentUser",
      config
    );
    console.log(response.data + "this is response from getCurrentUser");
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
  toast,
  setLoading,
  toastMessage
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    setLoading(true);

    const response = await axios.put(
      "http://localhost:8080/v1/angel/updateCustomer",
      editedUser,
      config
    );

    setLoading(false);

    if (response && response.data) {
      toast({
        title: "Update Successful",
        description: toastMessage || response.data.message,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      return { success: true, data: response.data };
    } else {
      console.error("Invalid response:", response);
      toast({
        title: "Update Failed",
        description: "Invalid response from the server",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return { success: false, error: "Invalid response from the server" };
    }
  } catch (error) {
    console.error("Failed to update user details:", error);
    toast({
      title: "Update Failed",
      description: error.response?.data || "Unknown error occurred",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    setLoading(false);
    return {
      success: false,
      error: error.response?.data || "Unknown error occurred",
    };
  }
};
