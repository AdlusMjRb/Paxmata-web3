import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from "../config";

function ProjectDetailsPage() {
  const [userAddress, setUserAddress] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const { projectId } = router.query;
  useEffect(() => {
    async function checkOwnership() {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const address = await signer.getAddress();
      setUserAddress(address);

      const contract = new ethers.Contract(
        YOUR_CONTRACT_ADDRESS,
        YOUR_CONTRACT_ABI,
        signer
      );
      const ownerAddress = await contract.ownerOf(projectId);
      const creatorAddress = await contract.creatorOf(projectId);

      if (address === ownerAddress || address === creatorAddress) {
        setIsAuthorized(true);
      }
    }

    if (projectId) {
      checkOwnership();
    }
  }, [projectId]);

  if (!isAuthorized) {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div>
      {/* Render the RFQ data here */}
      <h1>Project Details</h1>
      {/* ... */}
    </div>
  );
}

export default ProjectDetailsPage;
