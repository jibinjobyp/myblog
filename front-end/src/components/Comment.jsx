import React, { useEffect, useState } from "react";
import "./Comment.css";
import { createcomment, fetchcomment } from "../api/comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../utils/Icons";

const Comment = ({ postId, onClose }) => {
  const [mainComment, setMainComment] = useState("");
  const [onReply, setOnReply] = useState(null);
  const [replyComment, setReplyComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComments = async () => {
      try {
        setLoading(true);
        const comments = await fetchcomment(postId);
        setComments(comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, [postId]);

  const handleReplyToggle = (commentId) => {
    setOnReply(onReply === commentId ? null : commentId);
    setReplyComment("");
  };

  const sendMainComment = async () => {
    if (!mainComment.trim()) return;

    try {
      const formData = {
        content: mainComment,
        parentId: null,
      };

      const response = await createcomment(postId, formData);
      if (response) {
        setComments([response, ...comments]);
        setMainComment("");
      }
    } catch (error) {
      console.error("Error in sendMainComment:", error);
    }
  };

  const sendReply = async (parentId) => {
    if (!replyComment.trim()) return;

    try {
      const formData = {
        content: replyComment,
        parentId,
      };

      const response = await createcomment(postId, formData);
      if (response) {
        setComments([...comments, response]);
        setReplyComment("");
        setOnReply(null);
      }
    } catch (error) {
      console.error("Error in sendReply:", error);
    }
  };

  const getReplies = (commentId) => {
    return comments.filter((c) => c.parentId === commentId);
  };

  return (
    <div className="comment-container">
      
      <div className="comment-input-container">
    
        <div className="comment-input-wrapper">
          <input
            type="text"
            placeholder="Write a comment..."
            value={mainComment}
            onChange={(e) => setMainComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMainComment()}
          />
          <button 
            className="comment-send-button"
            onClick={sendMainComment}
            disabled={!mainComment.trim()}
          >
            <FontAwesomeIcon icon={icons.solid.paperPlane} />
          </button>
        </div>
      </div>

      <div className="comments-scroll-container">
        {loading ? (
          <div className="comment-loading">
            <div className="comment-spinner"></div>
          </div>
        ) : comments.filter((c) => c.parentId === null).length === 0 ? (
          <div className="no-comments">
            <FontAwesomeIcon icon={icons.solid.commentSlash} />
            <p>No comments yet</p>
          </div>
        ) : (
          comments
            .filter((c) => c.parentId === null)
            .map((comment) => (
              <div key={comment._id} className="comment-thread">
                <div className="comment-card">
                  <div className="comment-avatar">
                    {comment.userId?.profileImage ? (
                      <img 
                        src={comment.userId.profileImage} 
                        alt={comment.userId.username} 
                      />
                    ) : (
                      <FontAwesomeIcon icon={icons.solid.user} />
                    )}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.userId?.firstname || 'Anonymous'}
                      </span>
                      <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="comment-text">{comment.content}</div>
                    <button
                      className="comment-reply-button"
                      onClick={() => handleReplyToggle(comment._id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>

                {onReply === comment._id && (
                  <div className="reply-input-container">
                    <div className="comment-avatar small">
                      <FontAwesomeIcon icon={icons.solid.user} />
                    </div>
                    <div className="reply-input-wrapper">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyComment}
                        onChange={(e) => setReplyComment(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendReply(comment._id)}
                      />
                      <button 
                        className="comment-send-button"
                        onClick={() => sendReply(comment._id)}
                        disabled={!replyComment.trim()}
                      >
                        <FontAwesomeIcon icon={icons.solid.paperPlane} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="replies-container">
                  {getReplies(comment._id).map((reply) => (
                    <div key={reply._id} className="comment-card reply">
                      <div className="comment-avatar small">
                        {reply.userId?.profileImage ? (
                          <img 
                            src={reply.userId.profileImage} 
                            alt={reply.userId.username} 
                          />
                        ) : (
                          <FontAwesomeIcon icon={icons.solid.user} />
                        )}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">
                            {reply.userId?.firstname || 'Anonymous'}
                          </span>
                          <span className="comment-time">
                            {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="comment-text">{reply.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Comment;