// scripts/deployMulticall.js

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Multicall = await ethers.getContractFactory("Multicall");
  const multicall = await Multicall.deploy(); // Assuming no constructor arguments

  console.log("Multicall deployed to:", multicall.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
