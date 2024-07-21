import React, { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../../context/UserContext";
import styles from "./HeaderMenu.module.css";

const DropDownMenu = ({ isActive, setIsActive }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const menuRef = useRef(null);

  const handleMenuClose = () => setIsActive(false);

  const handleHomeClick = () => {
    router.push("/homepage");
    handleMenuClose();
  };

  const handleBuildClick = () => {
    if (user) {
      router.push("/RFQForm");
    } else {
      setIsActive(false);
    }
  };

  const handleNegotiationClick = () => {
    if (user) {
      router.push("/Negotiation/NegotiationPage");
    } else {
      setIsActive(false);
    }
  };

  const handleTrackClick = () => {
    router.push("/Tracking/MilestoneManager");
    handleMenuClose();
  };

  const handleBidClick = () => {
    router.push("/BiddingPage/BiddingPage");
    handleMenuClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsActive]);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.relatedTarget)) {
        setIsActive(false);
      }
    };

    if (isActive) {
      menuRef.current.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (menuRef.current) {
        menuRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isActive, setIsActive]);

  return (
    <div
      ref={menuRef}
      className={`${styles.dropDownMenu} ${isActive ? styles.active : ""}`}
    >
      <div className={styles.menuList}>
        <button className={styles.menuItem} onClick={handleHomeClick}>
          Home
        </button>
        <button className={styles.menuItem} onClick={handleBuildClick}>
          Build
        </button>
        <button className={styles.menuItem} onClick={handleNegotiationClick}>
          Negotiate
        </button>
        <button className={styles.menuItem} onClick={handleTrackClick}>
          Tracking
        </button>
        <button className={styles.menuItem} onClick={handleBidClick}>
          Bidding Page
        </button>
      </div>
    </div>
  );
};

export default DropDownMenu;
