import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios"; // Assuming you're using Axios to fetch NFT data

const ConnectWalletButton = ({ setUser, setProjects }) => {
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setUser({ ethereumAddress: address });

        // Fetch NFTs owned by the wallet
        const response = await axios.get(`/api/nfts/${address}`);
        setProjects(response.data); // Assume response.data is the array of projects/NFTs
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  return <button onClick={handleConnectWallet}>Connect Wallet</button>;
};

export default ConnectWalletButton;
