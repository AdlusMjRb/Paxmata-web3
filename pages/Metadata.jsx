import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import styles from "./Styles/Metadata.module.css";

function Metadata({ tokenId }) {
  // Pass the token ID as a prop
  const [walletAddress, setWalletAddress] = useState("");
  const [nftMetadata, setNftMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      fetchNftMetadata(tokenId);
    }
  }, [walletAddress, tokenId]);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const address = await provider.getSigner().getAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const fetchNftMetadata = async (tokenId) => {
    setIsLoading(true);
    try {
      const apiURL = `http://localhost:3003/api/nft-metadata?tokenId=${tokenId}`;
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error("Failed to fetch NFT metadata");
      }
      const data = await response.json();
      setNftMetadata(data);
    } catch (error) {
      console.error("Failed to fetch NFT metadata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSensitiveInfo = () => {
    // Verify if the user is a developer or the creator of the NFT
    if (userIsAuthorized(walletAddress)) {
      setShowSensitive(true);
    }
  };

  return (
    <div className={styles.container}>
      {!walletAddress && (
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet to View NFT Details
        </button>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        nftMetadata && (
          <div>
            <h2>{nftMetadata.title}</h2>
            <p>{nftMetadata.description}</p>
            {/* Render additional public metadata */}

            {walletAddress && (
              <button onClick={handleSensitiveInfo} className={styles.button}>
                {showSensitive ? "Hide Sensitive Data" : "Show Sensitive Data"}
              </button>
            )}

            {showSensitive && (
              <div>
                {/* Render sensitive data */}
                <p>Location: {nftMetadata.location}</p>
                {/* ... other sensitive information */}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default Metadata;

function userIsAuthorized(walletAddress) {
  // Implement your logic to verify if the user is authorized
  // This could involve checking against a list of developer addresses or verifying the NFT creator
  return true; // This is just a placeholder
}
