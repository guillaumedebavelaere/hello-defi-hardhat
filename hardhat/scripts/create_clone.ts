import { ethers, getNamedAccounts } from "hardhat";
import { HelloDefiAAVE2Factory } from "../typechain-types";

const main = async () => {
    const { deployer } = await getNamedAccounts();
    console.log(`deployer: ${deployer}`);
    const helloDefiAAVE2Factory: HelloDefiAAVE2Factory =
        await ethers.getContract("HelloDefiAAVE2Factory", deployer);
    console.log("Creating clone...");
    const response = await helloDefiAAVE2Factory.createClone();
    await response.wait(1);
    console.log("Clone created");
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
