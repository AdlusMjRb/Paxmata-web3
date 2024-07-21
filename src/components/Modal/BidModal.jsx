import React, { useEffect } from "react";
import Modal from "react-modal";
import styles from "./Styles/BidModal.module.css";

const BidModal = ({ isOpen, onRequestClose, project, submitBid }) => {
  useEffect(() => {
    Modal.setAppElement("#__next");
  }, []);

  const handleSubmit = () => {
    // Logic for placing the bid can be added here
    submitBid();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Bid Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Place Your Bid</h2>
      <div className={styles.projectDetails}>
        <h3>{project.projectDescription}</h3>
        <p>
          <strong>Investment Goal:</strong> £{project.investmentGoal}
        </p>
        <p>
          <strong>Cost:</strong> £{project.estimatedCost}
        </p>
        <p>
          <strong>Timescale:</strong> {project.estimatedTimescale}
        </p>
        <p>
          <strong>Location:</strong> {project.projectLocation}
        </p>
      </div>
      <div className={styles.bidExplanation}>
        <p>
          To place a bid, you need to hold £5 in escrow. This ensures that all
          bids are serious. If your bid is not selected, the £5 will be returned
          to you. Click "Place Bid" to proceed.
        </p>
        <button onClick={handleSubmit}>Place Bid</button>
      </div>
    </Modal>
  );
};

export default BidModal;
