// scripts/deploy_stateChannel.js
const hre = require("hardhat");

async function main() {
  // Replace 'DEPLOYED_PAXMATAPROJECTSV1_ADDRESS' with the actual address of the deployed PaxmataProjectsV1 contract
  const deployedPaxmataProjectsV1Address =
    "0x2cADf70cd35793360ea4eB574b08E4Bea1272dE2";

  const StateChannel = await hre.ethers.getContractFactory("StateChannel");
  const stateChannel = await StateChannel.deploy(
    deployedPaxmataProjectsV1Address
  );

  await stateChannel.deployed();

  console.log("StateChannel deployed to:", stateChannel.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
