import { axiosInstance } from "./index";

export const signup = async (formData) => {
    // console.log(formData)
    try {
        // console.log('now in sign up api');
        const response = await axiosInstance.post('/user/signup',formData);
        return response;
    }catch(err){
        throw err;
    }
}