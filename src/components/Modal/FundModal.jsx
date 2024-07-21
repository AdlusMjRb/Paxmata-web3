import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./Styles/FundModal.module.css";

const FundModal = ({ isOpen, onRequestClose, project, submitLoanOffer }) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [returnPercentage, setReturnPercentage] = useState(5); // Default to 5%
  const [timescale, setTimescale] = useState(6); // Default to 6 months
  const [netReturn, setNetReturn] = useState(0);

  useEffect(() => {
    Modal.setAppElement("#__next");
  }, []);

  useEffect(() => {
    const loan = parseFloat(loanAmount);
    const percentage = parseFloat(returnPercentage);
    if (loan && percentage) {
      const returnAmount = loan + loan * (percentage / 100);
      setNetReturn(returnAmount.toFixed(2));
    } else {
      setNetReturn(0);
    }
  }, [loanAmount, returnPercentage]);

  const handleSubmit = () => {
    if (loanAmount) {
      submitLoanOffer(loanAmount, returnPercentage, timescale);
      onRequestClose();
    } else {
      alert("Please enter a loan amount.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Fund Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Provide Funding</h2>
      <div className={styles.projectDetails}>
        <h3>{project.projectDescription}</h3>
        <p>
          <strong>Investment Goal:</strong> £{project.investmentGoal}
        </p>
      </div>
      <div className={styles.fundForm}>
        <label htmlFor="loanAmount">Loan Amount (£):</label>
        <input
          type="number"
          id="loanAmount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          min="1"
        />
        <label htmlFor="returnPercentage">
          Return Percentage (%): {returnPercentage}%
        </label>
        <input
          type="range"
          id="returnPercentage"
          value={returnPercentage}
          onChange={(e) => setReturnPercentage(e.target.value)}
          min="3"
          max="36"
          step="1"
        />
        <label htmlFor="timescale">
          Timescale (months): {timescale} months
        </label>
        <input
          type="range"
          id="timescale"
          value={timescale}
          onChange={(e) => setTimescale(e.target.value)}
          min="1"
          max="60"
          step="1"
        />
        <div className={styles.netReturn}>
          <p>
            <strong>Net Return Amount:</strong> £{netReturn}
          </p>
        </div>
        <button onClick={handleSubmit}>Send Offer</button>
      </div>
    </Modal>
  );
};

export default FundModal;
