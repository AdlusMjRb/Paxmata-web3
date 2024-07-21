import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img
            src="/Users/alexander/rfqbidding/rfqbiddingplatform/frontend/src/largelogo.png"
            alt="Logo"
            className={styles.logo}
          />
          <p className={styles.logoText}>PAXMATA</p>
        </div>
        <div className={styles.contactInfo}>
          <h3>Contact Us</h3>
          <p>Email: paxmata@gmail.com</p>
        </div>
        <div className={styles.socialLinks}>
          <h3>Follow Us</h3>
          <div className={styles.icons}>
            <a href="#" className={styles.icon}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.icon}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className={styles.icon}>
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.bottomText}>
        <p>&copy; 2024 PAXMATA. All rights reserved.</p>
        <p>Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
};

export default Footer;
