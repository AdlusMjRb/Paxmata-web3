// scripts/deployMilestoneTrackerFactory.js

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MilestoneTrackerFactory = await ethers.getContractFactory(
    "MilestoneTrackerFactory"
  );
  const milestoneTracker = await MilestoneTrackerFactory.deploy(); // No arguments

  console.log("MilestoneTrackerFactory deployed to:", milestoneTracker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
