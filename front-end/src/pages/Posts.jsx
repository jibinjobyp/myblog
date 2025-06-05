import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getallpost } from "../api/posts";
import { togglelike } from "../api/likes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../utils/Icons";
import Comment from "../components/Comment";
import { fetchcomment, getcommentcount } from "../api/comment";
import CommentModal from "../components/commentModal";
import "../styles/Posts.css";
import { getProfile } from "../api/profile";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (activeCommentPost !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeCommentPost]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch posts and comment counts in parallel
        const [postsRes, countsRes] = await Promise.all([
          getallpost(),
          getcommentcount(),
        ]);

        if (postsRes && postsRes.data) {
          setPosts(postsRes.data.post);
        }

        // Transform counts response into a mapping of postId to count
        if (countsRes && countsRes.data) {
          const countsMap = {};
          countsRes.data.forEach((item) => {
            countsMap[item.postId] = item.count;
          });
          setCommentCounts(countsMap);
        }
      } catch (error) {
        setError("Failed to load posts");
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${index * 0.1}s`;
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".post-card");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
      observer.disconnect();
    };
  }, [posts]);

  const handleLike = async (postId) => {
    if (!postId) return;
    try {
      const tempLiked = new Set(likedPosts);
      const wasLiked = tempLiked.has(postId);

      if (wasLiked) {
        tempLiked.delete(postId);
      } else {
        tempLiked.add(postId);
      }
      setLikedPosts(tempLiked);

      const res = await togglelike(postId);
      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? { ...post, likes: res.likes, likedByUser: res.likedByUser }
          : post
      );
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error liking post:", err);
      const tempLiked = new Set(likedPosts);
      tempLiked.delete(postId);
      setLikedPosts(tempLiked);
    }
  };

  const toggleCommentSection = (postId) => {
    setActiveCommentPost(postId === activeCommentPost ? null : postId);
  };

  const closeCommentSection = () => {
    setActiveCommentPost(null);
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1 className="gradient-text">✨ Discover Stories</h1>
        <button
          className="create-post-button"
          onClick={() => navigate("/create-post")}
        >
          <FontAwesomeIcon icon={icons.solid.plus} className="button-icon" />
          <span>Create Post</span>
          <div className="button-hover-effect"></div>
        </button>
      </div>

      {error && (
        <div className="error-container shimmer">
          <FontAwesomeIcon
            icon={icons.solid.exclamationCircle}
            className="error-icon"
          />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ "--i": i }}></div>
            ))}
          </div>
          <p className="loading-text">Loading stories...</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                className={`post-card ${
                  post._id % 3 === 0
                    ? "type-image-focus"
                    : post._id % 3 === 1
                    ? "type-minimal"
                    : "type-neumorphic"
                }`}
                key={post._id}
                style={{
                  "--card-hue": post._id.charCodeAt(0) % 360,
                }}
              >
                {post.image && (
                  <div className="post-image-container">
                    <div className="image-overlay"></div>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="post-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="post-content-wrapper">
                  <div className="post-header">
                    <div
                      className="author-avatar"
                      style={{
                        background: post.author?.profileImage
                          ? "none"
                          : `linear-gradient(135deg, 
            hsl(${
              post.author ? post.author.firstname.charCodeAt(0) % 360 : 0
            }, 70%, 60%), 
            hsl(${
              post.author ? post.author.lastname.charCodeAt(0) % 360 : 180
            }, 70%, 60%))`,
                      }}
                      onClick={() =>
                        navigate(`/user-profile-view/${post.author._id}`)
                      }
                    >
                      {post.author?.profileImage ? (
                        <img
                          src={post.author.profileImage}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        `${post.author?.firstname[0] ?? "N"}${
                          post.author?.lastname[0] ?? "N"
                        }`
                      )}
                    </div>

                    <div className="post-meta">
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-date">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="post-content">{post.content}</div>
                </div>

                <div className="post-actions">
                  {/* Like Button */}
                  <div
                    className={`action-button like-button ${
                      post.likedByUser ? "liked" : ""
                    }`}
                    onClick={() => handleLike(post._id)}
                  >
                    <div className="like-effect">
                      <FontAwesomeIcon
                        icon={icons.solid.like}
                        className={`action-icon ${
                          likedPosts.has(post._id) ? "heartbeat" : ""
                        }`}
                      />
                      <div className="like-particles">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="particle"></div>
                        ))}
                      </div>
                    </div>
                    <span>{post.likes?.length || 0}</span>
                  </div>

                  {/* Comment Button */}
                  <div
                    className="action-button comment-button"
                    onClick={() => toggleCommentSection(post._id)}
                  >
                    <FontAwesomeIcon
                      icon={icons.solid.comment}
                      className="action-icon"
                    />
                    <span>{commentCounts[post._id] || 0}</span>
                  </div>

                  {/* ✅ Message Button */}
                  <div
                    className="action-button message-button"
                    onClick={() =>navigate(`/message-page/${post.author._id}`)} 
                  >
                    <FontAwesomeIcon
                      icon={icons.solid.message}
                      className="action-icon"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FontAwesomeIcon
                icon={icons.solid.bookOpen}
                className="empty-icon"
              />
              <p>No stories to discover yet</p>
              <button
                className="cta-button"
                onClick={() => navigate("/create-post")}
              >
                Be the first to share
              </button>
            </div>
          )}
        </div>
      )}

      {activeCommentPost && (
        <CommentModal onClose={closeCommentSection}>
          <Comment postId={activeCommentPost} onClose={closeCommentSection} />
        </CommentModal>
      )}
    </div>
  );
};

export default Posts;
