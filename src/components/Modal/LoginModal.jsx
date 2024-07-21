import React, { useState, useContext } from "react";
import Modal from "react-modal";
import styles from "./Styles/LoginModal.module.css";
import { UserContext } from "../../../context/UserContext";

Modal.setAppElement("#__next");

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error logging in");

      localStorage.setItem("token", result.token);
      setUser(result.user);

      onClose();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modal}>
      <div className={styles.loginContainer}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.formInput}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.formInput}
        />
        <button onClick={loginUser} className={styles.button}>
          Login
        </button>
        {/* Ensure onRegisterClick is called to show the registration modal */}
        <button onClick={onRegisterClick} className={styles.button}>
          Register
        </button>
        <button onClick={onClose} className={styles.button}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;
