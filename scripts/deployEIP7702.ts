import { ethers } from "ethers";
import { EIP7702Implementation__factory } from "../typechain-types";    

async function main() {
  console.log("🚀 Deploying EIP-7702 Implementation Contract...");

  // Get the contract factory
  const EIP7702Implementation = await ethers.getContractFactory("EIP7702Implementation");
  
  // Deploy the contract
  const implementation = await EIP7702Implementation.deploy();
  await implementation.waitForDeployment();

  const address = await implementation.getAddress();
  console.log("✅ EIP-7702 Implementation Contract deployed to:", address);

  // Verify deployment
  const code = await ethers.provider.getCode(address);
  if (code === "0x") {
    throw new Error("Contract deployment failed - no code at address");
  }

  console.log("✅ Contract verification successful");
  console.log("📋 Contract Address:", address);
  console.log("🔗 Network:", (await ethers.provider.getNetwork()).name);
  console.log("👤 Deployer:", (await ethers.provider.getSigner()).address);

  // Test basic functionality
  console.log("🧪 Testing basic functionality...");
  
  // Test nonce
  const nonce = await implementation.nonce();
  console.log("📊 Initial nonce:", nonce.toString());

  // Test user nonce
  const userNonce = await implementation.getNonce(await ethers.provider.getSigner().getAddress());
  console.log("👤 User nonce:", userNonce.toString());

  console.log("✅ Basic functionality test passed");

  return {
    address,
    nonce: nonce.toString(),
    userNonce: userNonce.toString()
  };
}

main()
  .then((result) => {
    console.log("🎉 EIP-7702 Implementation deployment completed successfully!");
    console.log("📋 Deployment Summary:");
    console.log("   Contract Address:", result.address);
    console.log("   Initial Nonce:", result.nonce);
    console.log("   User Nonce:", result.userNonce);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
