import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../utils/Icons";
import postPic from "../assets/images/createpost.jpg";
import { createpost } from '../api/posts';
import { showError, showSuccess } from "../utils/Toast";
import "../styles/CreatePost.css";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    image: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const MAX_CONTENT_LENGTH = 2000;

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'content') {
      setCharCount(value.length);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        showError('Please select an image file (JPEG, PNG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          image: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      image: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return showError('Please enter a title');
    if (!formData.content.trim()) return showError('Please enter some content');
    if (!formData.author.trim()) return showError('Please enter author name');
    
    setIsSubmitting(true);
    
    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('content', formData.content);
      postData.append('author', formData.author);
      if (formData.image) postData.append('image', formData.image);

      await createpost(postData);
      showSuccess('Post published successfully!');
      
      // Reset form
      setFormData({ title: '', content: '', author: '', image: null });
      setCharCount(0);
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (err) {
      console.error('Error creating post:', err);
      showError('Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <div className="create-post-container">
      <motion.div 
        className="create-post-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div className="create-post-header" variants={item}>
          <h1>Create New Story</h1>
          <p className="subtitle">Share your ideas with the community</p>
        </motion.div>

        <div className="create-post-content">
          {/* Form Section */}
          <motion.form 
            className="create-post-form"
            onSubmit={submitHandler}
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* Title Field */}
            <motion.div className="form-group" variants={item}>
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                id="title"
                name="title" 
                value={formData.title}
                onChange={onHandleChange} 
                placeholder="Your amazing title..."
                maxLength={100}
                className="title-input"
              />
            </motion.div>
            
            {/* Content Field */}
            <motion.div className="form-group" variants={item}>
              <label htmlFor="content">Your Story</label>
              <div className="textarea-container">
                <textarea 
                  name="content" 
                  id="content" 
                  value={formData.content}
                  onChange={onHandleChange}
                  placeholder="Write your thoughts here..."
                  maxLength={MAX_CONTENT_LENGTH}
                  className="content-textarea"
                ></textarea>
                <div className="char-counter">
                  {charCount}/{MAX_CONTENT_LENGTH}
                </div>
              </div>
            </motion.div>
            
            {/* Author Field */}
            <motion.div className="form-group" variants={item}>
              <label htmlFor="author">Author Name</label>
              <input 
                type="text" 
                id="author"
                name="author" 
                value={formData.author}
                onChange={onHandleChange}
                placeholder="Your name"
                className="author-input"
              />
            </motion.div>

            {/* Image Upload */}
            <motion.div className="form-group" variants={item}>
              <label>Featured Image</label>
              <div className="image-upload-container">
                <AnimatePresence>
                  {previewImage ? (
                    <motion.div 
                      className="image-preview-container"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="image-preview"
                      />
                      <button 
                        type="button" 
                        className="remove-image-button"
                        onClick={removeImage}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <FontAwesomeIcon icon={icons.solid.times} />
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="image-upload-placeholder"
                      onClick={() => fileInputRef.current.click()}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FontAwesomeIcon 
                        icon={icons.solid.image} 
                        className="upload-icon"
                      />
                      <p>Drag & drop or click to upload</p>
                      <span>Recommended: 1200x630px (5MB max)</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                        name="image"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Form Actions */}
            <motion.div className="form-actions" variants={item}>
              <motion.button 
                type="button" 
                className="cancel-button"
                onClick={() => window.history.back()}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={icons.solid.paperPlane} />
                    Publish Story
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Inspiration Sidebar */}
          <motion.div 
            className="inspiration-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inspiration-content">
              <h3>Writing Tips</h3>
              <ul className="tips-list">
                <li>Start with a compelling headline</li>
                <li>Keep paragraphs short</li>
                <li>Use images to break up text</li>
                <li>Tell a personal story</li>
                <li>End with a question to engage readers</li>
              </ul>
              
              <div className="quote-container">
                <FontAwesomeIcon icon={icons.solid.quoteLeft} className="quote-icon" />
                <p className="quote">
                  There is no greater agony than bearing an untold story inside you.
                </p>
                <p className="quote-author">— Maya Angelou</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePost;