import { HardhatRuntimeEnvironment, RunTaskFunction } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {networkConfig, developmentChains} from '../helper-hardhat-config';


const deployHelloDefi: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network, run } = hre;
  const chainId = network.config.chainId || 31337;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const extraConfig = networkConfig[chainId];
  let daiUsdPriceFeed, linkUsdPriceFeed, aave2DataProvider, aave2LendingPool, verifyContract, blockConfirmations;

  if (developmentChains.includes(chainId)) {
    const priceFeedAggregator = await deployments.get("MockV3Aggregator");
    daiUsdPriceFeed = priceFeedAggregator.address;
    linkUsdPriceFeed = priceFeedAggregator.address;
    
    const mockLendingPoolAAVE2 = await deployments.get("MockLendingPoolAAVE2");
    aave2LendingPool = mockLendingPoolAAVE2.address;

    const mockProtocolDataProviderAAVE2 = await deployments.get("MockProtocolDataProviderAAVE2");
    aave2DataProvider = mockProtocolDataProviderAAVE2.address;

    verifyContract = false;
    blockConfirmations = 0;

  } else {
     ({daiUsdPriceFeed, linkUsdPriceFeed, aave2LendingPool, aave2DataProvider, verifyContract, blockConfirmations} = extraConfig);
  }

  const priceFeedConsumer = await deploy("PriceFeedConsumer", {
    from: deployer,
    args: [
      daiUsdPriceFeed,
      linkUsdPriceFeed
    ],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const feesCollector = await deploy("FeesCollector", {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const helloDefiAAVE2Factory = await deploy("HelloDefiAAVE2Factory", {
    from: deployer,
    args: [
      aave2LendingPool,
      aave2DataProvider,
      priceFeedConsumer.address,
      feesCollector.address
    ],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    waitConfirmations: blockConfirmations
  });
  
  if (verifyContract && process.env.ETHERSCAN_API_KEY) { // Goerli
    await verify(
      run,
      helloDefiAAVE2Factory.address,
      [aave2LendingPool, aave2DataProvider, priceFeedConsumer.address, feesCollector.address]);
  }
}

const verify = async (run: RunTaskFunction, contractAddress: string, args: string[]) => {
  console.log("Verifying contract");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }

}

export default deployHelloDefi;
deployHelloDefi.tags = ["all", "HelloDefiAAVE2Factory"];
