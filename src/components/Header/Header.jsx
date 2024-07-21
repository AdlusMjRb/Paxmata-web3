import React, { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { UserContext } from "../../../context/UserContext";
import DropDownMenu from "../Menus/HeaderMenu";
import LoginModal from "../Modal/LoginModal";
import RegistrationModal from "../Modal/RegistrationModal";
import styles from "./Header.module.css";
import centerLogo from "../../../public/images/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const menuRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    router.push("/homepage");
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegistrationModal = () => setIsRegistrationModalOpen(true);
  const closeRegistrationModal = () => setIsRegistrationModalOpen(false);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  // Close menu if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.headerBar}>
      <div className={styles.navContainer}>
        <button
          className={styles.menuToggle}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div ref={menuRef}>
          {isMenuOpen && (
            <DropDownMenu isActive={isMenuOpen} setIsActive={setIsMenuOpen} />
          )}
        </div>
        <div className={styles.centerLogoContainer}>
          <Image
            src={centerLogo}
            alt="Center Logo"
            width={175}
            height={50}
            layout="intrinsic"
          />
        </div>
        <div className={styles.headerProfile}>
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className={styles.authButton}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={openLoginModal} className={styles.authButton}>
              Login
            </button>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onRegisterClick={openRegistrationModal}
      />
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeRegistrationModal}
      />
    </div>
  );
};

export default Header;
