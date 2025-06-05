import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from '../styles/PostView.module.css';
import { getOnePostById } from "../api/posts";
import { getUserById } from "../api/users";

const PostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const postData = await getOnePostById(postId);
        setPost(postData);
        
        if (postData?.userId) {
          const userData = await getUserById(postData.userId);
          setUser(userData.userData);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className={styles.pv__loading}>
        <div className={styles.pv__spinner} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.pv__not_found}>
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.pv__container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button 
        className={styles.pv__back_btn} 
        onClick={() => navigate(-1)}
      >
        <span>&larr;</span> Back to feed
      </button>

      <div className={styles.pv__content}>
        <div className={styles.pv__image_container}>
          <img
            src={post.image || "https://source.unsplash.com/random/800x800?post"}
            alt="Post"
            className={styles.pv__image}
          />
        </div>

        <div className={styles.pv__details}>
          <div className={styles.pv__user_info}>
            {user && (
              <>
                <img
                  src={user.profileImage || "https://source.unsplash.com/random/100x100?profile"}
                  alt={user.username}
                  className={styles.pv__user_avatar}
                />
                <span className={styles.pv__username}>@{user.lastname}</span>
              </>
            )}
          </div>

          <div className={styles.pv__caption}>
            <p>{post.title || "No caption provided"}</p>
          </div>

          <div className={styles.pv__stats}>
            <div className={styles.pv__stat}>
              <span className={styles.pv__stat_icon}>❤️</span>
              <span>{post.likes?.length || 0} likes</span>
            </div>
            <div className={styles.pv__stat}>
              <span className={styles.pv__stat_icon}>💬</span>
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>

          <div className={styles.pv__comments_section}>
            <h3 className={styles.pv__comments_title}>Comments</h3>
            {post.comments?.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className={styles.pv__comment}>
                  <p>
                    <span className={styles.pv__comment_user}>
                      {comment.username}:
                    </span>
                    <span className={styles.pv__comment_text}>
                      {comment.text}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className={styles.pv__no_comments}>No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostView;