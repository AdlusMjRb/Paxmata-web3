import React from "react";
import styles from "./Styles/RFQFormInvest.module.css";

const RFQFormInvestModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {" "}
        <h2>Investment Structure Information</h2>
        <p>
          When you make your project investable, it means that you are seeking
          financial contributions from investors. Here's what you need to know:
        </p>
        <ul>
          <li>
            Your project will be visible to all potential investors on our
            platform.
          </li>
          <li>
            Investors will propose their terms, including the investment amount
            and expected returns.
          </li>
          <li>You retain the right to accept or reject investment offers.</li>
          <li>
            Investments are handled through secure escrow services to protect
            both parties.
          </li>
          <li>
            Ensure you understand all legal implications before agreeing to any
            investment terms.
          </li>
        </ul>
        <div className={styles.modalActions}>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>{" "}
      </div>
    </div>
  );
};

export default RFQFormInvestModal;
