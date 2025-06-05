import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllUsers } from "../api/users";
import styles from "../styles/UserPage.module.css";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                console.log(response)
                setUsers(response);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={styles.spinner}
                />
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    return (
        <div className={styles.usersPage}>
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.pageTitle}
            >
                Our Community
            </motion.h1>
            
            <motion.div 
                className={styles.usersGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
            >
                {users.map((user) => (
                    <motion.div 
                        key={user._id}
                        className={styles.userCard}
                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.avatarContainer}>
                            <img 
                                src={user.profileImage || "https://via.placeholder.com/150"} 
                                alt={user.name} 
                                className={styles.avatar}
                            />
                        </div>
                        <div className={styles.userInfo}>
                            <h3 className={styles.userName}>{user.firstname}</h3>
                            <p className={styles.userEmail}>{user.email}</p>
                            {/* <p className={styles.userBio}>{user.bio || "No bio yet"}</p> */}
                        </div>
                        <Link to={`/user-profile-view/${user._id}`} className={styles.viewProfile}>
                            View Profile
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default UserPage;