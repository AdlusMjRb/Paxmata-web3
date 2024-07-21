import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./Styles/DonateModal.module.css";

const DonateModal = ({ isOpen, onRequestClose, project, submitDonation }) => {
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    Modal.setAppElement("#__next");
  }, []);

  const handleSubmit = () => {
    if (donationAmount) {
      submitDonation(donationAmount);
      onRequestClose();
    } else {
      alert("Please enter a donation amount.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Donate Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Make a Donation</h2>
      <div className={styles.projectDetails}>
        <h3>{project.projectDescription}</h3>
        <p>
          <strong>Investment Goal:</strong> £{project.investmentGoal}
        </p>
      </div>
      <div className={styles.donateForm}>
        <label htmlFor="donationAmount">Donation Amount (£):</label>
        <input
          type="number"
          id="donationAmount"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          min="1"
        />
        <button onClick={handleSubmit}>Donate</button>
      </div>
    </Modal>
  );
};

export default DonateModal;
