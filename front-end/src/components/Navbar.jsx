import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";
import { getProfile } from "../api/profile";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to check auth status
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // Check auth status when component mounts
    checkAuthStatus();

    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        console.log("User Profile Response:", response.user.email);
        setProfilePic(response.user.profileImage);
        // You can set state here if needed
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Add event listener to close menu when clicking outside
   const handleClickOutside = (event) => {
  if (menuOpen && !event.target.closest(`.${styles.navbar}`)) {
    setMenuOpen(false);
  }
  if (showDropdown && !event.target.closest(`.${styles.profileContainer}`)) {
    setShowDropdown(false);
  }
};
    document.addEventListener("click", handleClickOutside);

    // Listen for custom auth change events
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("auth-change", handleAuthChange);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setMenuOpen(false);

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event("auth-change"));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Animation variants
  const menuVariants = {
    hidden: {
      y: -50,
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logoLink}>
          <motion.h1
            className={styles.logo}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            MERN<span>BLOG</span>
          </motion.h1>
        </Link>

        <motion.button
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          <span
            className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
          ></span>
        </motion.button>

        <AnimatePresence>
          {(menuOpen || window.innerWidth > 768) && (
            <motion.ul
              className={`${styles.navLinks} ${
                menuOpen ? styles.showMenu : ""
              }`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
            >
              <motion.li variants={itemVariants}>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={styles.navLink}
                >
                  Home
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link
                  to="/show-post"
                  onClick={() => setMenuOpen(false)}
                  className={styles.navLink}
                >
                  Posts
                </Link>
              </motion.li>

              {isLoggedIn ? (
                <>
                  <motion.li variants={itemVariants}>
                    <Link
                      to="/create-post"
                      onClick={() => setMenuOpen(false)}
                      className={styles.navLink}
                    >
                      Create
                    </Link>
                  </motion.li>

                  <motion.li variants={itemVariants}>
                    <Link
                      to="/users"
                      onClick={() => setMenuOpen(false)}
                      className={styles.navLink}
                    >
                      Users
                    </Link>
                  </motion.li>

                  {/* <motion.li variants={itemVariants}>
                    <motion.button
                      onClick={handleLogout}
                      className={styles.logoutBtn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Logout
                    </motion.button>
                  </motion.li> */}

                  <motion.li
                    variants={itemVariants}
                    className={styles.profileItem}
                  >
                    <div
                      className={styles.profileContainer}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <div className={styles.profilePic}>
                        <img src={profilePic} alt="Profile" />
                      </div>

                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            className={styles.dropdownMenu}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.button
                              onClick={handleLogout}
                              className={styles.dropdownItem}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              Logout
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                </>
              ) : (
                <>
                  <motion.li variants={itemVariants}>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className={styles.navLink}
                    >
                      Login
                    </Link>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className={`${styles.navLink} ${styles.signupLink}`}
                    >
                      Signup
                    </Link>
                  </motion.li>
                </>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
