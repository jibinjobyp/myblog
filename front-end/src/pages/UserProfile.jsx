import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "../styles/UserProfile.css";
import { getProfile } from "../api/profile";
import {
  fetchFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../api/handleFollow";
import { showError, showSuccess } from "../utils/Toast";
import { toast } from "react-toastify";
import { getPostById } from "../api/posts";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [showRequests, setShowRequests] = useState(false);
  const [followRequests, setFollowRequests] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const userWithCounts = {
          ...response.user,
          followers: response.followersCount,
          following: response.followingCount,
          postCount: response.postCount,
        };
        setUser(userWithCounts);
        console.log(response);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();

    const fetchPostById = async () => {
      try{
        const response = await getPostById()

      }catch(error){
        console.log('error in fetch posts by id ')
      }
    }






  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchFollowRequests();
        console.log("response from fetch follow requests api", response);
        setFollowRequests(response);
      } catch (err) {
        console.error("Error in fetchFollowRequests:", err);
      }
    };
    fetchRequests();
  }, []);

  const [posts, setPosts] = useState([
    {
      id: 1,
      image: "https://source.unsplash.com/random/300x300?nature",
      likes: 124,
      comments: 23,
    },
    {
      id: 2,
      image: "https://source.unsplash.com/random/300x300?city",
      likes: 89,
      comments: 12,
    },
    {
      id: 3,
      image: "https://source.unsplash.com/random/300x300?people",
      likes: 215,
      comments: 34,
    },
    {
      id: 4,
      image: "https://source.unsplash.com/random/300x300?tech",
      likes: 76,
      comments: 8,
    },
    {
      id: 5,
      image: "https://source.unsplash.com/random/300x300?food",
      likes: 312,
      comments: 45,
    },
    {
      id: 6,
      image: "https://source.unsplash.com/random/300x300?travel",
      likes: 143,
      comments: 21,
    },
  ]);

  const toggleFollow = () => {
    setUser((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
  };
  const handleRequestAction = async (id, action) => {
    try {
      if (action === "accept") {
        const response = await acceptFollowRequest(id);
        console.log("Response from accept follow request API:", response);

        if (response && response.status === "success") {
          setUser((prev) => ({
            ...prev,
            followers: prev.followers + 1,
            following: prev.following + 1,
          }));
        }
      } else if (action === "reject") {
        console.log("In reject block");
        const response = await rejectFollowRequest(id);
        console.log("Response from reject follow request API:", response);
        // No need for success check unless you want to show a toast
      }

      // ✅ Always remove the request from UI after action
      setFollowRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err) {
      console.error("Error in handleRequestAction:", err);
    }
  };

  return (
    <motion.div
      className="user-profile"
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
          <motion.div className="stat-item" whileHover={{ scale: 1.05 }}>
            <span className="stat-number">{user.postCount}</span>
            <span className="stat-label">Posts</span>
          </motion.div>

          <motion.div className="stat-item" whileHover={{ scale: 1.05 }}>
            <span className="stat-number">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </motion.div>

          <motion.div className="stat-item" whileHover={{ scale: 1.05 }}>
            <span className="stat-number">{user.following}</span>
            <span className="stat-label">Following</span>
          </motion.div>
        </div>
      </div>

      <div className="profile-info">
        <h1 className="profile-name">{user.firstname}</h1>
        <p className="profile-username">{user.firstname + user.lastname}</p>
        <p className="profile-bio">{user.bio}</p>

        <div className="profile-actions">
          <motion.button
            className={`follow-button ${user.isFollowing ? "following" : ""}`}
            onClick={toggleFollow}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{
              backgroundColor: user.isFollowing ? "#efefef" : "#0095f6",
            }}
            animate={{
              backgroundColor: user.isFollowing ? "#efefef" : "#0095f6",
            }}
            transition={{ duration: 0.2 }}
          >
            {user.isFollowing ? "Following" : "Follow"}
          </motion.button>

          <motion.button
            className="requests-button"
            onClick={() => setShowRequests(!showRequests)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Requests ({followRequests?.length || 0})
          </motion.button>
        </div>
      </div>

      {showRequests && (
        <motion.div
          className="requests-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="requests-title">Follow Requests</h3>
          <div className="requests-list">
            {followRequests.map((request) => (
              <motion.div
                key={request.id}
                className="request-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="request-user">
                  <img
                    src={request.senderImage}
                    alt={request.username}
                    className="request-user-image"
                  />
                  <span className="request-username">{request.senderName}</span>
                </div>
                <div className="request-actions">
                  <button
                    className="request-accept"
                    onClick={() => handleRequestAction(request.id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="request-decline"
                    onClick={() => handleRequestAction(request.id, "reject")}
                  >
                    Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="profile-posts">
        <h2 className="posts-title">Posts</h2>
        <div className="posts-grid">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="post-item"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={post.image}
                alt={`Post ${post.id}`}
                className="post-image"
              />
              <div className="post-overlay">
                <span className="post-likes">❤️ {post.likes}</span>
                <span className="post-comments">💬 {post.comments}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
