import React, { useState } from "react";
import styles from "./Styles/RFQForm.module.css";
import RFQFormInvestModal from "../src/components/Modal/RFQFormInvest.jsx";
import InvestmentModal from "../src/components/Modal/InvestmentModal.jsx";

function RFQForm() {
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [rfqData, setRfqData] = useState({
    projectDescription: "",
    estimatedCost: "",
    estimatedTimescale: "",
    projectLocation: "",
    isInvestable: false,
  });

  const toggleInvestModal = () => setShowInvestModal(!showInvestModal);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setRfqData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));

    if (name === "isInvestable" && checked) {
      setShowInvestmentModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rfqData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert("RFQ submitted successfully with ID: " + result.id);
      setRfqData({
        projectDescription: "",
        estimatedCost: "",
        estimatedTimescale: "",
        projectLocation: "",
        isInvestable: false,
      });
    } catch (error) {
      console.error("Error submitting RFQ:", error);
      alert("An error occurred during the submission process.");
    }
  };

  return (
    <div className={styles.pageLayout}>
      <main className={styles.mainContainer}>
        <section className={styles.formCard}>
          <h2 className={styles.formHeading}>Tell us about your project...</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="projectDescription"
              value={rfqData.projectDescription}
              onChange={handleInputChange}
              placeholder="Project Description"
              className={styles.formField}
            />
            <input
              type="text"
              name="estimatedCost"
              value={rfqData.estimatedCost}
              onChange={handleInputChange}
              placeholder="Estimated Cost"
              className={styles.formField}
            />
            <input
              type="text"
              name="estimatedTimescale"
              value={rfqData.estimatedTimescale}
              onChange={handleInputChange}
              placeholder="Estimated Timescale"
              className={styles.formField}
            />
            <input
              type="text"
              name="projectLocation"
              value={rfqData.projectLocation}
              onChange={handleInputChange}
              placeholder="Project Location"
              className={styles.formField}
            />
            <label>
              <input
                type="checkbox"
                name="isInvestable"
                checked={rfqData.isInvestable}
                onChange={handleInputChange}
              />
              Is Investable
            </label>
            <button className={styles.submitButton} type="submit">
              Submit
            </button>
          </form>
        </section>
      </main>

      <RFQFormInvestModal
        isOpen={showInvestModal}
        onConfirm={() => setRfqData({ ...rfqData, isInvestable: true })}
        onClose={toggleInvestModal}
      />

      {/* Render the InvestmentModal component */}
      <InvestmentModal
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
      />
    </div>
  );
}

export default RFQForm;
