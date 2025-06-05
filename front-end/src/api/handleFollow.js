import { axiosInstance } from "./index";

export const sendFollowRequest = async (userId) => {
    // console.log(userId)
    // console.log('now in send follow request api');
    try{
        const response = await axiosInstance.post('/user/sendfollowrequest', { receiver:userId });
        // console.log('response from send follow request api', response.data);
        return response.data;

    }catch(err){
        console.error("Error in sendFollowRequest:", err);
    }
}

export const fetchFollowRequests = async () => {
    try {
        const response = await axiosInstance.get('/user/fetchfollowrequests');
        // console.log('response from fetch follow requests apiiii', response.data.requests);
        return response.data.requests;
    } catch (err) {
        console.error("Error in fetchFollowRequests:", err);
    }
}


export const acceptFollowRequest = async (requestId) => {
    try{
        // console.log(requestId)
        const response = await axiosInstance.post(`/user/acceptfollowrequest/${requestId}`);
        // console.log('response from accept follow request api', response.data);
        return response.data;
    }catch(err){
        console.error("Error in acceptFollowRequest:", err);
    }
}

export const rejectFollowRequest = async (requestId) => {
    try{
        // console.log('in reject api ',requestId)
        const response = await axiosInstance.post( `/user/rejectfollowrequest/${requestId}`)
        // console.log('the respones from rejection method ', response)
        return response.data

    }catch(error) {
        console.error(
            'Error in reject Follow request api....'
        )
    }
}