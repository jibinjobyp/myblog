import { axiosInstance } from "./index";


export const getAllUsers = async () => {
    try {
        // console.log('now in get all users api');
        const response = await axiosInstance.get('/user/getallusers');
        // console.log(response.data.users)
        return response.data.users;  // just the data, not the whole response

    }catch (error) {
        console.error("Error in getAllUsers:", error);
    }
}

export const getUserById = async (userId ) => {
    try {
        // console.log('now in get user by id api');
        const response = await axiosInstance.get(`/user/getuserbyid/${userId}`);
        // console.log("Follow Stakkktus:", response.data);

        // console.log('by id ',response)
        return response.data;  // just the data, not the whole response
    }catch (error) {
        console.error("Error in getUserById:", error);
    }
}