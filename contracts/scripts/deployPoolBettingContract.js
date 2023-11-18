const hre = require("hardhat");

async function main() {
  
const platformFeePercentage = 1
const feeCollectorAddress = "0x5aEd91DA23e5f4F0aA083A3055B0FEa62a16fC0b"

const PoolBetting = await ethers.getContractFactory("PoolBetting");
const poolBetting = await PoolBetting.deploy(feeCollectorAddress,platformFeePercentage, feeCollectorAddress);

await poolBetting.waitForDeployment();

  console.log(
    `Pool Betting Smart Contract has been deployed to ${poolBetting.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
