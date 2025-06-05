const express = require("express");
const {signUpUser, loginUser,getAllUsers , getUserById} = require("../controllers/userController")
const upload = require('../middleware/upload')
const { checkJwtToken } = require("../middleware/authMiddleware");
const {sendFollowRequest,fetchFollowRequests,acceptFollowRequest, rejectFollowRequest} = require("../controllers/requestController")




const router = express.Router()

router.post('/signup',upload.single('profileImage'),signUpUser)
router.post('/login',loginUser)
router.get('/getallusers',getAllUsers)
router.get('/getuserbyid/:id',checkJwtToken,getUserById)
router.post('/sendfollowrequest',checkJwtToken,sendFollowRequest)
router.get('/fetchfollowrequests',checkJwtToken,fetchFollowRequests)
router.post('/acceptfollowrequest/:id',checkJwtToken,acceptFollowRequest)
router.post('/rejectfollowrequest/:id',checkJwtToken,rejectFollowRequest)

module.exports=router