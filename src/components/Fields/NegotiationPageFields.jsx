import React from "react";
import styles from "./NegotiationPageFields.module.css";

export const MileStoneFields = () => {
  return (
    <div className={styles.mileStoneFields}>
      <div className={styles.paymentButtons}>
        <button className={styles.paymentActive}>Yes</button>
        <button className={styles.paymentDisactive}>No</button>
      </div>
      <input
        type="text"
        className={styles.inputProjectInfo}
        placeholder="Enter Milestone Name"
      />
      <input
        type="date"
        className={styles.completionDate}
        placeholder="Completion date"
      />
    </div>
  );
};

export default MileStoneFields;
