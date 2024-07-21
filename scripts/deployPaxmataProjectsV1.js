// scripts/deploy_paxmataProjectsV1.js
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy, using the correct contract name from the file
  const PaxmataProjects = await hre.ethers.getContractFactory(
    "PaxmataProjectsV1"
  );
  const paxmataProjects = await PaxmataProjects.deploy();

  await paxmataProjects.deployed();

  console.log("PaxmataProjectsV1 deployed to:", paxmataProjects.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
