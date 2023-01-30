import { ethers, run, network } from "hardhat";

const DAI_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS = process.env.DAI_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS || "set DAI_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS in dotenv";
const LINK_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS = process.env.LINK_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS || "set LINK_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS in dotenv";
const LENDING_POOL_AAVE2_CONTRACT_ADDRESS = process.env.LENDING_POOL_AAVE2_CONTRACT_ADDRESS || "set LENDING_POOL_AAVE2_CONTRACT_ADDRESS in dotenv";
const PROTOCOL_DATA_PROVIDER_AAVE2_CONTRACT_ADDRESS = process.env.PROTOCOL_DATA_PROVIDER_AAVE2_CONTRACT_ADDRESS || "set PROTOCOL_DATA_PROVIDER_AAVE2_CONTRACT_ADDRESS in dotenv"; 


async function main() {

  const PriceFeedConsumer = await ethers.getContractFactory("PriceFeedConsumer");
  const FeesCollector = await ethers.getContractFactory("FeesCollector");
  const HelloDefiAAVE2Factory = await ethers.getContractFactory("HelloDefiAAVE2Factory");

  const priceFeedConsumer = await PriceFeedConsumer.deploy(
    DAI_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS, 
    LINK_AGGREGATOR_V3_CHAIN_LINK_CONTRACT_ADDRESS
  );
  await priceFeedConsumer.deployed();

  const feesCollector = await FeesCollector.deploy();
  await feesCollector.deployed();

  const helloDefiAAVE2Factory = await HelloDefiAAVE2Factory.deploy(
    LENDING_POOL_AAVE2_CONTRACT_ADDRESS, 
    PROTOCOL_DATA_PROVIDER_AAVE2_CONTRACT_ADDRESS,
    priceFeedConsumer.address,
    feesCollector.address
  );
  await helloDefiAAVE2Factory.deployed();

  console.log(`helloDefiAAVE2Factory deployed to ${helloDefiAAVE2Factory.address}`);

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) { // Goerli
    await helloDefiAAVE2Factory.deployTransaction.wait(6);
    await verify(
      helloDefiAAVE2Factory.address, 
      [LENDING_POOL_AAVE2_CONTRACT_ADDRESS, PROTOCOL_DATA_PROVIDER_AAVE2_CONTRACT_ADDRESS, priceFeedConsumer.address, feesCollector.address]);
  }
}

const verify = async (contractAddress: string, args: string[]) => {
  console.log("Verifying contract");
  try {
    await run("verify:verify", {
      address: contractAddress, 
      constructorArguments: args
    });
  } catch(e: unknown) {
    if (e instanceof Error && e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
  
}

main().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
