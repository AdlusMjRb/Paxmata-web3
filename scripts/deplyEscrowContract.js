const hre = require("hardhat");

async function main() {
  // Get the Contract Factory
  const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");

  // Deploy the contract
  const escrowContract = await EscrowContract.deploy();
  await escrowContract.deployed();

  console.log("EscrowContract deployed to:", escrowContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
