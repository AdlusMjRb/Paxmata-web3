import React, { useState, useRef } from "react";
import Tooltip from "../Modal/Tooltip";
import BidModal from "../Modal/BidModal";
import FundModal from "../Modal/FundModal";
import DonateModal from "../Modal/DonateModal";
import styles from "./Styles/ProjectCard.module.css";

function ProjectsCard({ project, onClick }) {
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const tooltipTimer = useRef(null);

  const getProjectImage = (type) => {
    switch (type) {
      case "housing":
        return "/images/NFT_House.png";
      case "landscaping":
        return "/images/NFT_Landscaping.png";
      case "maintenance":
        return "/images/NFT_Maintenance.png";
      default:
        return "/images/default.png";
    }
  };

  const badgeDescriptions = {
    sustainability:
      "Projects utilizing green technologies or sustainable practices.",
    community_impact:
      "Developments delivering significant benefits to local communities.",
    medical_infrastructure:
      "Projects focused on building or renovating medical facilities.",
    heritage_preservation:
      "Efforts focused on restoring and preserving historical sites.",
    charitable_donation: "Projects funded through donations.",
  };

  const getBadgeImages = (badges = []) => {
    const badgeMap = {
      sustainability: "/images/sustainability.png",
      community_impact: "/images/community_impact.png",
      medical_infrastructure: "/images/medical_infrastructure.png",
      heritage_preservation: "/images/heritage_preservation.png",
      charitable_donation: "/images/charitable_donation.png",
    };
    return badges.map((badge) => ({
      src: badgeMap[badge],
      description: badgeDescriptions[badge],
    }));
  };

  const handleBadgeMouseOver = (e, description) => {
    clearTimeout(tooltipTimer.current);
    const { clientX, clientY } = e;
    tooltipTimer.current = setTimeout(() => {
      setTooltipText(description);
      setTooltipPosition({ x: clientX, y: clientY });
      setTooltipVisible(true);
    }, 500);
  };

  const handleBadgeMouseOut = () => {
    clearTimeout(tooltipTimer.current);
    setTooltipVisible(false);
  };

  const handleBidClick = () => {
    setIsBidModalOpen(true);
  };

  const handleFundClick = () => {
    setIsFundModalOpen(true);
  };

  const handleDonateClick = () => {
    setIsDonateModalOpen(true);
  };

  const submitBid = (bidAmount, message) => {
    // Add logic to handle bid submission
    console.log("Bid submitted:", { bidAmount, message });
  };

  const submitLoanOffer = (loanAmount, returnPercentage, timescale) => {
    // Add logic to handle loan offer submission
    console.log("Loan offer submitted:", {
      loanAmount,
      returnPercentage,
      timescale,
    });
  };

  const submitDonation = (donationAmount) => {
    // Add logic to handle donation submission
    console.log("Donation submitted:", { donationAmount });
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.graphicContainer}>
          <img
            src={getProjectImage(project.projectType)}
            alt={`Project type: ${project.projectType}`}
            className={styles.graphic}
          />
          <div className={styles.textOverlay}>
            <h3 className={styles.title}>
              {project.projectDescription || "Preview Project Description"}
            </h3>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.badgeContainer}>
            {getBadgeImages(project.badges).map((badge, index) => (
              <div
                key={index}
                className={styles.badgeWrapper}
                onMouseEnter={(e) => handleBadgeMouseOver(e, badge.description)}
                onMouseLeave={handleBadgeMouseOut}
              >
                <img src={badge.src} alt="Badge" className={styles.badgeIcon} />
              </div>
            ))}
          </div>
          {project.isInvestable && (
            <div className={styles.investableBadgeWrapper}>
              <span className={styles.investableBadge}>Investable</span>
            </div>
          )}
          <div className={styles.description}>
            <p>
              <strong>Cost:</strong> £{project.estimatedCost || "0"}
            </p>
            <p>
              <strong>Timescale:</strong>{" "}
              {project.estimatedTimescale || "Not specified"}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {project.projectLocation || "Not specified"}
            </p>
            {project.isInvestable && (
              <p>
                <strong>Goal:</strong> £
                {project.investmentGoal || "Not specified"}
              </p>
            )}
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.bidButton} onClick={handleBidClick}>
              BID
            </button>
            {project.isInvestable && (
              <button className={styles.fundButton} onClick={handleFundClick}>
                FUND
              </button>
            )}
            {project.badges.includes("charitable_donation") && (
              <button
                className={styles.donateButton}
                onClick={handleDonateClick}
              >
                DONATE
              </button>
            )}
          </div>
        </div>
      </div>
      <Tooltip
        text={tooltipText}
        visible={tooltipVisible}
        position={tooltipPosition}
      />
      <BidModal
        isOpen={isBidModalOpen}
        onRequestClose={() => setIsBidModalOpen(false)}
        project={project}
        submitBid={submitBid}
      />
      <FundModal
        isOpen={isFundModalOpen}
        onRequestClose={() => setIsFundModalOpen(false)}
        project={project}
        submitLoanOffer={submitLoanOffer}
      />
      <DonateModal
        isOpen={isDonateModalOpen}
        onRequestClose={() => setIsDonateModalOpen(false)}
        project={project}
        submitDonation={submitDonation}
      />
    </div>
  );
}

export default ProjectsCard;
