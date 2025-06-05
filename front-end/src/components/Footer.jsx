import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.footer 
            className={styles.footer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            <div className={styles.waveDivider}></div>
            
            <div className={styles.content}>
                <motion.p 
                    className={styles.copyright}
                    variants={itemVariants}
                >
                    © {currentYear} MERN Blog. All rights reserved.
                </motion.p>
                
                <motion.div 
                    className={styles.links}
                    variants={containerVariants}
                >
                    <motion.a 
                        href="/about" 
                        className={styles.link}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, color: "#4cc9f0" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        About
                    </motion.a>
                    <span className={styles.divider}>|</span>
                    <motion.a 
                        href="/contact" 
                        className={styles.link}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, color: "#4cc9f0" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Contact
                    </motion.a>
                    <span className={styles.divider}>|</span>
                    <motion.a 
                        href="/privacy" 
                        className={styles.link}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, color: "#4cc9f0" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Privacy Policy
                    </motion.a>
                </motion.div>
                
                <motion.div 
                    className={styles.socialLinks}
                    variants={containerVariants}
                >
                    <motion.a 
                        href="https://twitter.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.socialIcon}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fab fa-twitter"></i>
                    </motion.a>
                    <motion.a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.socialIcon}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fab fa-facebook-f"></i>
                    </motion.a>
                    <motion.a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.socialIcon}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fab fa-instagram"></i>
                    </motion.a>
                    <motion.a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.socialIcon}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fab fa-github"></i>
                    </motion.a>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;