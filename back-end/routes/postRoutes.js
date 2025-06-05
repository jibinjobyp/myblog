const express = require("express");
const {
    createPost,
    getAllPost,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
    createComment,
    deleteComment,
    getProfile,
    getOnePostById,
    fetchComment,
    getCommentCount
} = require("../controllers/postController");

const { checkJwtToken } = require("../middleware/authMiddleware");
const  upload = require("../middleware/upload");
const mongoose = require('mongoose');

const router = express.Router();

// ✅ Validate ObjectId Middleware
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
};

// ✅ Routes
router.post("/createpost", checkJwtToken,upload.single('image'), createPost);
router.get("/getallpost", getAllPost);

router.get('/getpostbyid/:id', checkJwtToken, validateObjectId, getPostById);

router.put('/updatepost/:id', checkJwtToken, validateObjectId, updatePost);

router.delete('/deletepost/:id', checkJwtToken, validateObjectId, deletePost);

router.put('/togglelike/:id', checkJwtToken, validateObjectId, toggleLike);

router.post('/createcomment/:id', checkJwtToken, validateObjectId, createComment);

router.delete('/deletecomment/:id/:commentId', checkJwtToken, deleteComment);

router.get('/getprofile', checkJwtToken, getProfile);

router.get('/getonepostbyid/:id',checkJwtToken,getOnePostById)

router.get('/fetchcomment/:id',checkJwtToken,validateObjectId,fetchComment)

router.get('/getcommentcount',getCommentCount)


module.exports = router;
