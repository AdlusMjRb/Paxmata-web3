const hre = require("hardhat");

async function main() {
  // Get the contract factory for PaxmataProjects
  const PaxmataProjects = await hre.ethers.getContractFactory(
    "PaxmataProjects"
  );
  console.log("Deploying PaxmataProjects...");

  // Deploy the contract
  const paxmataProjects = await PaxmataProjects.deploy();
  await paxmataProjects.deployed();

  console.log("PaxmataProjects deployed to:", paxmataProjects.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
