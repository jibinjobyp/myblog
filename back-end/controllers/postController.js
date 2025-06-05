const Post = require("../models/posts");
const User = require("../models/users");
const Comment = require('../models/comment')
const upload = require("../middleware/upload");


const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate title and content
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Handle image (if provided)
    const image = req.file ? req.file.filename : null; // Get the filename from multer if there's an image

    // Create new post
    const newPost = new Post({
      title,
      content,
      author: req.user._id,
      image:req.file ? req.file.path : undefined,
    });

    // Save the post to the database
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPost = async (req, res) => {
  try {
    const allPost = await Post.find().populate("author", "firstname lastname profileImage");
    res.status(200).json({ message: "all post", post: allPost });

  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    console.log('this is ',req.params.id)
    const post = await Post.find({author:req.params.id})
    console.log('this is post',post)
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json({ message: "post", post });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};





const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ messag: "post not found" });
    }
    post.title = title;
    post.content = content;
    await post.save();
    res.status(200).json({ message: "post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    await post.remove();
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};









const toggleLike = async (req, res) => {
  const { id } = req.params; // Post ID from URL
  const userId = req.user._id; // User ID from token

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already liked the post
    const likedIndex = post.likes.indexOf(userId);

    if (likedIndex === -1) {
      // Add like
      post.likes.push(userId);
    } else {
      // Remove like
      post.likes.splice(likedIndex, 1);
    }

    // ✅ Only update the `likes` field, bypassing `author` validation
    await Post.updateOne(
      { _id: id },
      { $set: { likes: post.likes } } // Only update the `likes` array
    );

    res.status(200).json({
      message: "Like toggled successfully",
      likes: post.likes, // Send the count
      likedByUser: post.likes.includes(userId), // Send if the user liked it
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};














// const createComment = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const post = await Post.findById(req.params.id);
//     console.log("Post ID received:", req.params.id);

//     // ✅ FIX: Return early if post is not found
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     post.comments.push({ text, commentBy: req.user.id });
//     await post.save();

//     res.status(201).json({
//       message: "Comment added successfully",
//       comment: { text, commentBy: req.user.id },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };












const createComment = async (req, res) => {
  console.log('now in back end create comment');
  console.log(res)
  
  console.log('its post id ', req.params);

  try {

    
    const postId = req.params.id;
    console.log(postId)
    const { content, parentId } = req.body;
    const userId = req.user._id; // From JWT middleware
    console.log('user id', userId);

    if (!postId || !content) {
      return res.status(400).json({ message: "postId and content are required" });
    }

    const newComment = new Comment({
      postId,
      userId,
      content,
      parentId: parentId || null
    });
    console.log('new comment', newComment);

    await newComment.save();

     const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "firstname profileImage");

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// GET /api/comments/:id
const fetchComment = async (req, res) => {
  try {
    const postId = req.params.id;

    console.log('its from comment api', postId);

    const response = await Comment.find({ postId: postId })
    .populate('userId', 'firstname profileImage')
    console.log( 'before popu',response)

    if (!response || response.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in fetchComment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getCommentCount = async (req, res) => {
  try {
    const counts = await Comment.aggregate([
      {
        $group: {
          _id: "$postId",         // group by postId
          count: { $sum: 1 }      // count how many comments
        }
      }
    ]);

    // Convert to a cleaner format: { postId, count }
    const formattedCounts = counts.map(item => ({
      postId: item._id,
      count: item.count
    }));

    res.status(200).json(formattedCounts);
  } catch (error) {
    console.error("Error getting comment count:", error);
    res.status(500).json({ message: "Server error" });
  }
};
















const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) return res.status(404).json({ message: "comment not found" });
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== req.params.commentId
    );
    await post.save();
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};


const getProfile = async (req,res) => {
  
  try{
    const user = await User.findById(req.user._id).populate()
    if(!user){
      return res.status(404).json({message: "user not found"})
    }
    const postCount = await Post.countDocuments({ author: req.user._id });
    // res.status(200).json({message: "user profile", user, postCount})
     res.status(200).json({
      message: "user profile",
      user,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      postCount: postCount,
    });

  }catch(error){
    res.status(500).json({message: "internal server error"})
  }
}

const getOnePostById = async (req, res) => {
     
  
  try{
    const postId = req.params.id
    const onePost = await Post.findById(postId)
    res.status(200).json({message:'one post by id ',onePost})

  }catch(error) {
    res.status(500).json({message: "internal server error"})

  }
}



module.exports = {
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
};
