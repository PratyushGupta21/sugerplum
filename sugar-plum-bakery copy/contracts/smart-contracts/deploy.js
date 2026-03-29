// deploy.js - Deployment script for BakeryPayment smart contract

const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying BakeryPayment contract...");

  // Get the ContractFactory and Signers here
  const BakeryPayment = await ethers.getContractFactory("BakeryPayment");
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Replace with your bakery's wallet address
  const bakeryWallet = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Example address

  // Deploy the contract
  const bakeryPayment = await BakeryPayment.deploy(bakeryWallet);

  await bakeryPayment.deployed();

  console.log("BakeryPayment deployed to:", bakeryPayment.address);

  // Verify contract on Etherscan (for mainnet/testnet)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract on Etherscan...");
    try {
      await run("verify:verify", {
        address: bakeryPayment.address,
        constructorArguments: [bakeryWallet],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  // Log deployment details
  console.log("\n--- Deployment Summary ---");
  console.log("Contract Address:", bakeryPayment.address);
  console.log("Bakery Wallet:", bakeryWallet);
  console.log("Network:", network.name);
  console.log("Block Number:", await ethers.provider.getBlockNumber());

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress: bakeryPayment.address,
    bakeryWallet: bakeryWallet,
    network: network.name,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });