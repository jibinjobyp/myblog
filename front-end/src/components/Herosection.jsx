import React from "react";
import "../styles/Herosection.css";
import hacker from "../assets/images/hacker.avif";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCreatePostClick = () => {
    navigate("/create-post");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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
    <section className="hero">
      {/* Gradient background elements */}
      <div className="gradient-circle-1"></div>
      <div className="gradient-circle-2"></div>
      
      {/* Content container */}
      <div className="hero-container">
        {/* Text content */}
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.h1 variants={item}>
            Share Your <span className="highlight">Ideas</span> With The World
          </motion.h1>
          
          <motion.p variants={item}>
            Join our community of thinkers and creators. Publish your stories, 
            share your knowledge, and connect with like-minded individuals.
          </motion.p>
          
          <motion.div variants={item} className="button-group">
            <button 
              className="primary-btn"
              onClick={handleCreatePostClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Writing
            </button>
            <button 
              className="secondary-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Posts
            </button>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="image-wrapper">
            <img src={hacker} alt="Creative person sharing ideas" />
            <div className="image-overlay"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;