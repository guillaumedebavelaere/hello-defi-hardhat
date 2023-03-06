import { ethers, getNamedAccounts, network } from "hardhat";
import { HelloDefiAAVE2, HelloDefiAAVE2Factory } from "../typechain-types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

const main = async () => {
    const { deployer } = await getNamedAccounts();
    console.log(`deployer: ${deployer}`);
    const helloDefiAAVE2Factory: HelloDefiAAVE2Factory =
        await ethers.getContract("HelloDefiAAVE2Factory", deployer);

    console.log("Getting user clone...");
    const cloneAddress = await helloDefiAAVE2Factory.userContracts(deployer);
    console.log(`Found clone: ${cloneAddress}`);

    const helloDefiAAVE2: HelloDefiAAVE2 = await ethers.getContractAt(
        "HelloDefiAAVE2",
        cloneAddress
    );

    let daiContractAddress;
    if (developmentChains.includes(network.name)) {
        const daiContract = await ethers.getContract("MockERC20", deployer);
        daiContractAddress = daiContract.address;
    } else {
        const chainId = network.config.chainId || 31337;
        daiContractAddress = networkConfig[chainId].daiContract;
    }

    console.log(`withdraw... from ${deployer}`);
    const result = await helloDefiAAVE2
        .withdraw(daiContractAddress, ethers.utils.parseEther("0.5"), {from: deployer});
    await result.wait(1);
    console.log("finished withdraw!");
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
