import { axiosInstance } from "./index";

export const getProfile = async () => {
    console.log('now in get profile api');
    try{

        const response = await axiosInstance.get('/posts/getprofile');
        // console.log('data',response.data)
        return response.data;  // just the data, not the whole response
    }catch(err){
        console.error('Error in get profile:', err);
    }
}