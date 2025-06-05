import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/UserProfileView.css";
import { getUserById } from "../api/users";
import { sendFollowRequest } from "../api/handleFollow";
import { getPostById } from "../api/posts";
import { useNavigate } from 'react-router-dom';



const UserProfileView = () => {
    const navigate = useNavigate();

  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [followStatus, setFollowStatus] = useState("none");
  const [isFriend, setIsFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getUserById(userId);
        
        const userWithCounts = {
          ...response.userData,
          followers: response.followersCount,
          following: response.followingCount,
          postCount: response.postCount,
        };
        setUser(userWithCounts);
        setIsFriend(response.isFriend);
        setFollowStatus(response.userData.followStatus);


        // setPosts(response.posts || []);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();

    const fetchPostById = async () => {
      try{
        const response = await getPostById(userId)
        setPosts(response || [])
      }catch(error){
        console.log('error occured in getpostbyid')
      }
    }

    fetchPostById()




  }, [userId]);




const handleFollow = async () => {
  try {
    console.log("Follow Status:", followStatus);

    if (followStatus === "none") {
      console.log('in if clause')
      const response = await sendFollowRequest(userId);
      console.log("Follow Request Response:", response);

      if (response?.success) {
        setFollowStatus("pending");
      } else {
        console.warn("Follow request failed:", response?.message || "Unknown error");
      }
    } else {
      console.log("Already sent request or following");
    }
  } catch (error) {
    console.error("Error sending follow request:", error);
  }
};



  if (isLoading) {
    return (
      <div className="profile-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="profile-spinner"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="user-profile-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <motion.div
          className="profile-image-container"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <img
            src={
              user.profileImage ||
              "https://source.unsplash.com/random/300x300?profile"
            }
            alt="Profile"
            className="profile-image"
          />
        </motion.div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{user.postCount || 0}</span>
            <span className="stat-label">Posts</span>
          </div>

          <div className="stat-item">
            <span className="stat-number">{user.followers || 0}</span>
            <span className="stat-label">Followers</span>
          </div>

          <div className="stat-item">
            <span className="stat-number">{user.following || 0}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="profile-info">
        <h1 className="profile-name">
          {user.firstname} {user.lastname}
        </h1>
        <p className="profile-username">@{user.lastname}</p>
        <p className="profile-bio">{user.bio || "No bio yet"}</p>

        {/* <motion.button
          className={`follow-button ${isFriend ? 'following' : ''}`}
          onClick={handleFollow}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ backgroundColor: isFriend ? '#efefef' : '#0095f6' }}
          animate={{ backgroundColor: isFriend ? '#efefef' : '#0095f6' }}
          transition={{ duration: 0.2 }}
        >
          {isFriend ? 'Following' : 'Follow'}
        </motion.button> */}

        <motion.button
          className={`follow-button ${
            followStatus === "accepted" ? "following" : ""
          }`}
          onClick={handleFollow}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={followStatus === "pending"} // disable button while waiting
        >
          {followStatus === "accepted"
            ? "Following"
            : followStatus === "pending"
            ? "Requested"
            : "Follow"}
        </motion.button>
      </div>

      <div className="profile-posts">
        <h2 className="posts-title">Posts</h2>
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                className="post-item"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={()=>navigate(`/post-view/${post._id}`)}
              >
                <img
                  src={
                    post.image ||
                    "https://source.unsplash.com/random/300x300?post"
                  }
                  alt={`Post ${post._id}`}
                  className="post-image"
                />
                <div className="post-overlay">
                  <span className="post-likes">
                    ❤️ {post.likes?.length || 0}
                  </span>
                  <span className="post-comments">
                    💬 {post.comments?.length || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <p>No posts yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfileView;
