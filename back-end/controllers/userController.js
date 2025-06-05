const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const user = require("../models/users");
const { post } = require("../routes/authRoutes");
const Post = require("../models/posts");
const FollowRequest = require("../models/followRequest");

dotenv.config();

const signUpUser = async (req, res) => {
  console.log("req.body:", req.body);

  try {
    const { firstname, lastname, email, password } = req.body;

    // ✅ Check for missing fields
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Create new user
    const newUser = new user({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profileImage: req.file ? req.file.path : undefined,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await user.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users");
    const allUsers = await user.find().select("-password");
    console.log('hi')
    res.status(200).json({ message: "all users", users: allUsers });  
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};













const getUserById = async (req, res) => {
  try {
    console.log("Fetching user by ID");
    const userId = req.params.id;
    const currentUserId = req.user._id;

    const userDoc = await user.findById(userId).select("-password");

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const followRequest = await FollowRequest.findOne({
      sender: currentUserId,
      receiver: userId,
    });

    let followStatus = 'none';
    if (followRequest) {
      followStatus = followRequest.status;
    }

    // 🔥 FIX: convert to plain JS object so we can modify it
    const userData = userDoc.toObject();
    userData.followStatus = followStatus;

    const postCount = await Post.countDocuments({ author: userId });

    console.log("✅ Sending user data with followStatus:", userData);

    res.status(200).json({
      message: "User data",
      userData,
      followersCount: userData.followers.length,
      followingCount: userData.following.length,
      postCount: postCount,
      
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






module.exports = { signUpUser, loginUser, getAllUsers, getUserById };
