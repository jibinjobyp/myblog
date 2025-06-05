import { axiosInstance } from "./index";

// formData should include: { userId, content, parentId (optional) }
export const createcomment = async (postId, formData) => {
  try {
    console.log("Sending comment:", formData);
    console.log('now in cr co api',postId)

    const response = await axiosInstance.post(`/posts/createcomment/${postId}`, formData);
    console.log(response.data)

    return response.data;
  } catch (error) {
    console.error("Error in createcomment:", error.response?.data || error.message);
    throw error; // throw to handle it in UI (e.g., show toast, etc.)
  }
};


export const fetchcomment = async (postId) => {
  try{
    console.log(postId)
    const response = await axiosInstance.get(`/posts/fetchcomment/${postId}`)
    console.log('this is commnt')
    console.log(response.data)
    return response.data

  }catch(error) {
    console.error('error in api block of fetch comment')
  }
}



export const  getcommentcount = async () => {

  try{
    const response = await axiosInstance.get('/posts/getcommentcount')
    console.log('this si the coutn')
    console.log(response.data)
    return response

  }catch(error){
    console.error('error in count the comment')
  }
}