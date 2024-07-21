import React, { useState, useEffect } from "react";
import styles from "./Styles/RFQForm.module.css";
import RFQFormInvestModal from "../src/components/Modal/RFQFormInvest";
import PreviewCard from "../src/components/Cards/PreviewCard";

const ukLocations = [
  "London",
  "Manchester",
  "Birmingham",
  "Edinburgh",
  "Glasgow",
  "Liverpool",
  "Bristol",
];

const badgeOptions = [
  {
    label: "Sustainability",
    value: "sustainability",
    image: "/images/sustainability.png",
  },
  {
    label: "Community Impact",
    value: "community_impact",
    image: "/images/community_impact.png",
  },
  {
    label: "Medical Infrastructure",
    value: "medical_infrastructure",
    image: "/images/medical_infrastructure.png",
  },
  {
    label: "Heritage Preservation",
    value: "heritage_preservation",
    image: "/images/heritage_preservation.png",
  },
  {
    label: "Charitable Donation",
    value: "charitable_donation",
    image: "/images/charitable_donation.png",
  },
];

function RFQForm() {
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [rfqData, setRfqData] = useState({
    projectType: "housing",
    projectDescription: "",
    estimatedCost: "",
    estimatedTimescale: "",
    projectLocation: "",
    isInvestable: false,
    investmentGoal: "",
    ethereumAddress: "",
    badges: [], // Add badges to RFQ data
  });

  useEffect(() => {
    const checkMetaMask = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setUserAddress(accounts[0]);
          setRfqData((prevData) => ({
            ...prevData,
            ethereumAddress: accounts[0],
          }));
        } catch (error) {
          console.error("Could not access MetaMask accounts:", error);
        }
      }
    };

    checkMetaMask();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setRfqData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleBadgeChange = (e) => {
    const { value, checked } = e.target;
    setRfqData((prevData) => {
      const updatedBadges = checked
        ? [...prevData.badges, value]
        : prevData.badges.filter((badge) => badge !== value);
      return { ...prevData, badges: updatedBadges };
    });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setRfqData((prevData) => ({
      ...prevData,
      isInvestable: checked,
      investmentGoal: checked ? prevData.investmentGoal : "", // Clear investment goal if unchecked
    }));
    if (checked) {
      setShowInvestModal(true);
    } else {
      setShowInvestModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to submit an RFQ.");
      return;
    }

    try {
      // Log RFQ data before sending
      console.log("Submitting RFQ data:", rfqData);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rfqData),
      };

      // Submit to blockchain backend
      let response = await fetch(
        "http://localhost:3003/api/rfq",
        requestOptions
      );
      if (!response.ok) {
        const error = await response.text();
        console.error("Blockchain API error response:", error);
        throw new Error(`Blockchain API error! ${error}`);
      }

      // Submit to MongoDB backend
      response = await fetch("http://localhost:3001/api/rfq", requestOptions);
      if (!response.ok) {
        const error = await response.text();
        console.error("MongoDB API error response:", error);
        throw new Error(`MongoDB API error! ${error}`);
      }

      alert("RFQ submitted successfully.");
      resetForm();
    } catch (error) {
      console.error("Error submitting RFQ:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const resetForm = () => {
    setRfqData({
      projectType: "housing",
      projectDescription: "",
      estimatedCost: "",
      estimatedTimescale: "",
      projectLocation: "",
      isInvestable: false,
      investmentGoal: "",
      ethereumAddress: userAddress,
      badges: [], // Reset badges
    });
  };

  const handleInvestModalConfirm = () => {
    setRfqData((prevData) => ({
      ...prevData,
      isInvestable: true,
    }));
    setShowInvestModal(false);
  };

  const handleInvestModalClose = () => {
    if (!rfqData.investmentGoal) {
      setRfqData((prevData) => ({
        ...prevData,
        isInvestable: false,
      }));
    }
    setShowInvestModal(false);
  };

  return (
    <div className={styles.pageLayout}>
      <main className={styles.mainContainer}>
        <section className={styles.formCard}>
          <h2 className={styles.formHeading}>Tell us about your project...</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <select
              name="projectType"
              value={rfqData.projectType}
              onChange={handleInputChange}
              className={styles.formField}
            >
              <option value="housing">Housing</option>
              <option value="landscaping">Landscaping</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <input
              type="text"
              name="projectDescription"
              value={rfqData.projectDescription}
              onChange={handleInputChange}
              placeholder="Project Description"
              className={styles.formField}
            />
            <input
              type="number"
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
            <select
              name="projectLocation"
              value={rfqData.projectLocation}
              onChange={handleInputChange}
              className={styles.formField}
            >
              {ukLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="isInvestable"
                checked={rfqData.isInvestable}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
              />
              <label className={styles.checkboxLabel}>Is Investable</label>
            </div>

            {rfqData.isInvestable && (
              <input
                type="number"
                name="investmentGoal"
                value={rfqData.investmentGoal}
                onChange={handleInputChange}
                placeholder="Investment Goal"
                className={styles.formField}
              />
            )}

            <div className={styles.badgeSelector}>
              <label className={styles.badgeLabel}>Select Badges:</label>
              {badgeOptions.map((badge) => (
                <label key={badge.value} className={styles.badgeOption}>
                  <input
                    type="checkbox"
                    value={badge.value}
                    checked={rfqData.badges.includes(badge.value)}
                    onChange={handleBadgeChange}
                  />
                  <img
                    src={badge.image}
                    alt={badge.label}
                    className={styles.badgeIcon}
                  />
                  {badge.label}
                </label>
              ))}
            </div>

            <button className={styles.submitButton} type="submit">
              Submit
            </button>
          </form>
        </section>

        <section className={styles.previewCard}>
          <h2 className={styles.previewHeading}>Preview</h2>
          <PreviewCard project={rfqData} />
        </section>
      </main>

      <RFQFormInvestModal
        isOpen={showInvestModal}
        onConfirm={handleInvestModalConfirm}
        onClose={handleInvestModalClose}
      />
    </div>
  );
}

export default RFQForm;
