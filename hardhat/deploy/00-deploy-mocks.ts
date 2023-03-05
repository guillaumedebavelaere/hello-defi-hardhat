import { HardhatRuntimeEnvironment, RunTaskFunction } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { developmentChains } from '../helper-hardhat-config';


const deployMocks: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  if (developmentChains.includes(network.name)) {
    const { deployer } = await getNamedAccounts();
    const decimals = 8;
    const initialAnswer = 200000000000;
    await deploy("MockV3Aggregator", {
      from: deployer,
      args: [decimals, initialAnswer],
      log: true
    });

    await deploy("MockLendingPoolAAVE2", {
      from: deployer,
      log: true
    });

    const balance = 200000000000;
    await deploy("MockProtocolDataProviderAAVE2", {
      from: deployer,
      args: [balance],
      log: true
    });

    log("--------------------------------");
  }
}

export default deployMocks;
deployMocks.tags = ["all", "mocks"];