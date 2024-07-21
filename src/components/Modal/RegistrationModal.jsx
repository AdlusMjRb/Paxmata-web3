import React, { useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext.js";
import Modal from "react-modal";
import { useRouter } from "next/router";
import DeveloperVerificationModal from "../Modal/DeveloperVerificationModal.jsx";
import styles from "./Styles/Registration.module.css";
import Link from "next/link";

Modal.setAppElement("#__next");

const RegistrationModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const handleRoleChange = (event) => {
    const value = event.target.value;
    setRole(value);
    setShowDeveloperModal(value === "developer");
  };

  const registerUser = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          email,
          role,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to register");

      localStorage.setItem("token", result.token);
      setUser(result.user);

      console.log("User registered successfully:", result.user);
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modal}>
      <div className={styles.modalContainer}>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
        <h2>Create Account</h2>
        <Link href="/login" className={styles.loginLink}>
          Already have an account? Log In
        </Link>
        <div>
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
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
          />
          <select
            value={role}
            onChange={handleRoleChange}
            className={styles.formInput}
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="developer">Developer</option>
            <option value="investor">Investor</option>
          </select>
        </div>
        <button
          onClick={registerUser}
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? "Registering..." : "Submit Registration"}
        </button>
        <button
          onClick={onClose}
          className={`${styles.button} ${styles.cancelButton}`}
        >
          Cancel
        </button>
        {showDeveloperModal && (
          <DeveloperVerificationModal
            isOpen={showDeveloperModal}
            onClose={() => setShowDeveloperModal(false)}
          />
        )}
      </div>
    </Modal>
  );
};

export default RegistrationModal;
