import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract, ContractFactory, utils } from "ethers";
import { ethers } from "hardhat";

import ERC20 from "./helpers/TestERC20.json";
import { FeesCollector } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("FeesCollector test", async () => {
    const deployFeesCollectorFixture = async () => {
        const [owner, otherAccount1] = await ethers.getSigners();

        const FeesCollector = await ethers.getContractFactory("FeesCollector");
        const feesCollector = await FeesCollector.deploy();

        const contractFactory = new ContractFactory(ERC20.abi, ERC20.bytecode, owner);
        const erc20 = await contractFactory.deploy(utils.parseEther("100000"));

        return { feesCollector, erc20, owner, otherAccount1 };
    }

    it("should deploy with no errors", async function () {
        const { feesCollector } = await loadFixture(deployFeesCollectorFixture);
        expect(feesCollector.address).is.not.null;
    });

    describe("withdraw test", async () => {
        let erc20: Contract;
        let feesCollector: FeesCollector;
        let owner: SignerWithAddress;
        let otherAccount1: SignerWithAddress;
        beforeEach(async () => {
            const result = await loadFixture(deployFeesCollectorFixture);
            feesCollector = result.feesCollector;
            owner = result.owner;
            erc20 = result.erc20;
            
            otherAccount1 = result.otherAccount1;
            //First we have to transfer asset to the contract to be able to withdraw
            await erc20.transfer(feesCollector.address, utils.parseEther("100000"));
        })

        it("should revert if the user is not the owner", async () => {
            await expect(feesCollector.connect(otherAccount1).withdraw(erc20.address, utils.parseEther("1")))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("should revert if the amount is == 0", async () => {
            await expect(feesCollector.withdraw(erc20.address, utils.parseEther("0")))
                .to.be.revertedWith("_amount must be > 0!");
        });

        it("should transfer the asset to the owner wallet", async () => {
            const ownerBalanceBeforeWithdraw = await erc20.balanceOf(owner.address);
            expect(ownerBalanceBeforeWithdraw).to.be.equal(utils.parseEther("0"));
            const feesCollectorBalanceBeforeWithDraw = await erc20.balanceOf(feesCollector.address);
            expect(feesCollectorBalanceBeforeWithDraw).to.be.equal(utils.parseEther("100000"));
            
            await feesCollector.withdraw(
                erc20.address,
                utils.parseEther("100000")
            );
        
            const ownerBalanceAfterWithdraw = await erc20.balanceOf(owner.address)
            expect(ownerBalanceAfterWithdraw).to.equal(utils.parseEther("100000"));
            const feesCollectorBalanceAfterWithdraw = await erc20.balanceOf(feesCollector.address);
            expect(feesCollectorBalanceAfterWithdraw).to.equal(utils.parseEther("0"));

        });
    });
});