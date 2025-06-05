import { axiosInstance } from "./index";


export const togglelike = async (postId) => {
  try {
    const response = await axiosInstance.put(`/posts/togglelike/${postId}`);
    return response.data;
  } catch (error) {
    console.error("got an error when fetching the likes", error);

    // ✅ Return the error response to avoid undefined
    return error.response || { data: null, message: "Error occurred" };
  }
};
