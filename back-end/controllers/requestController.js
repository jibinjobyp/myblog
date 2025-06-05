const Post = require("../models/posts");
const User = require("../models/users");
const FollowRequest = require("../models/followRequest");

const sendFollowRequest = async (req, res) => {
  try {
    const receiverId = req.body.receiver;
    const senderId = req.user._id;

    // Validations
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (receiverId === senderId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if receiver exists
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for existing request
    const existingRequest = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Follow request already sent" });
    }

    // Create new request
    await FollowRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending' // Add status field if your schema supports it
    });

    res.status(200).json({ 
      message: "Follow request sent successfully",
      success: true
    });


    
  } catch (err) {
    console.error("Error in sendFollowRequest:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};








// const acceptFollowRequest = async (req, res) => {
//     try {
//         const requestId = req.params.id;
//         const request = await FollowRequest.findById(requestId);
//         if (!request) {
//             return res.status(404).json({ message: "Follow request not found" });
//         }
//         const { sender, receiver } = request;

//     }catch (error) {
//         console.error("Error accepting follow request:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

   const fetchFollowRequests = async (req, res) => {
    try {
      console.log('in fetch follow requests api',req.user._id);
        const userId = req.user._id;
        const requests = await FollowRequest.find({receiver:userId}).populate('sender', 'firstname profileImage');
        console.log('requests:', requests);
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: "No follow requests found" });
        }
        const formattedRequests = requests.map(request => ({
            id: request._id,
            senderId: request.sender._id,
            senderName: request.sender.firstname,
            senderImage: request.sender.profileImage,
            status: request.status
        }));
        return  res.status(200).json({ requests: formattedRequests });
    }catch (error) {
        console.error("Error fetching follow requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
   }


   const acceptFollowRequest = async (req, res) => {
    try{
        const requestId = req.params.id;
        console.log('this is id of followrequest',requestId)
        const userId = req.user._id;
        console.log('this is id of the current user logged',userId)
        const request = await FollowRequest.findById(requestId)
        if (!request) {
            return res.status(404).json({ message: "Follow request not found" });
        }
        if (request.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }
        // Add sender to receiver's followers
        const senderId = request.sender;
        await User.findByIdAndUpdate(userId, {$addToSet : { followers: senderId ,friends:senderId}})
        // Add receiver to sender's following
        await User.findByIdAndUpdate(senderId, {$addToSet : { following: userId,friends:userId}})
        // Update request status
        await FollowRequest.findByIdAndUpdate(requestId, { status: 'accepted' });

        return res.status(200).json({ message: "Follow request accepted successfully" });




    }catch (error) {
        console.error("Error accepting follow request:", error);
        res.status(500).json({ message: "Internal server error" });
    }

   }


   const rejectFollowRequest = async (req,res) => {
    try{
      const requestId = req.params.id;
      const userId = req.user._id
      const request = await FollowRequest.findById(requestId)
      if(!request) {
        res.status(404).json({message: 'Follow request not found'})
      }
      if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to reject this request" });
    }

    request.status = 'rejected';
    await request.save()

    return res.status(200).json({message: 'Follow request rejected successfully...'})




    }catch(error){
      console.error('error while the recjection function')
      res.status(500).json({message: 'internal server error'})
    }
   }

module.exports = {sendFollowRequest,fetchFollowRequests , acceptFollowRequest, rejectFollowRequest};
