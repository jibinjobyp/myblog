import { axiosInstance } from "./index";

export const getallpost = async () => {
    try {
        const response = await axiosInstance.get('/posts/getallpost');
        console.log('get',response.data)
        return response;  // just the data, not the whole response
    } catch (err) {
        console.error('Error in get all post:', err);
    }
};

export const createpost = async (formData) => {
    try {
        const response = await axiosInstance.post('/posts/createpost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error in create post:', err);
    }
};

export const getPostById = async (id) => {
    console.log('Fetching post with ID:', id);
    try {
        const response = await axiosInstance.get(`/posts/getpostbyid/${id}`);
        console.log('Post data:', response.data.post);
        return response.data.post;
    } catch (error) {
        console.error('Error in getPostById:', error);
        return null;
    }
}



export const getOnePostById = async (postId) => {
    console.log(postId)
    try{
        const response = await axiosInstance.get(`/posts/getonepostbyid/${postId}`)
        console.log('this is from one post',response.data.onePost)
        return response.data.onePost

    }catch(error) {
        console.log('error in fetch one post of the user')
    }
}