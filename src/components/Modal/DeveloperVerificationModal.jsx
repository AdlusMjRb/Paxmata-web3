import React from "react";
import Modal from "react-modal";
const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    maxWidth: "500px",
    width: "80%",
    background: "#FFF",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1100,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1050,
  },
};

function DeveloperVerificationModal({ showModal, setShowDeveloperModal }) {
  const uploadQualification = async () => {};

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowDeveloperModal(false)}
      style={modalStyles}
      contentLabel="Developer Qualification"
    >
      <h2>Developer Qualification</h2>
      <p>Please upload your qualification for verification.</p>
      <input
        type="file"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button
          onClick={uploadQualification}
          style={{
            marginRight: "10px",
            padding: "10px 15px",
            backgroundColor: "#5c6bc0",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Upload
        </button>
        <button
          onClick={() => setShowDeveloperModal(false)}
          style={{
            padding: "10px 15px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default DeveloperVerificationModal;
