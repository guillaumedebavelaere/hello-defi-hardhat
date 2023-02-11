import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";


describe("HelloDefiAAVE2Factory test", async () => {

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    const deployHelloDefiAAVE2FactoryFixture = async () => {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount1, otherAccount2] = await ethers.getSigners();

        await deployments.fixture(["all"]);
        const {deployer} = await getNamedAccounts()
        
        const helloDefiAAVE2Factory = await ethers.getContract("HelloDefiAAVE2Factory", deployer);

        return { helloDefiAAVE2Factory, owner, otherAccount1, otherAccount2 };
    }



    it("should deploy with no errors", async function () {
        const {helloDefiAAVE2Factory} = await loadFixture(deployHelloDefiAAVE2FactoryFixture);
        expect(helloDefiAAVE2Factory.address).is.not.null;
    });

    describe("create HelloDefiAAVE2 clones", async () => {

        it("should create new HelloDefiAAVE2 smart contracts", async () => {
            const {helloDefiAAVE2Factory, owner, otherAccount1, otherAccount2} = await loadFixture(deployHelloDefiAAVE2FactoryFixture);
            await helloDefiAAVE2Factory.connect(owner).createClone();
            await helloDefiAAVE2Factory.connect(otherAccount1).createClone();
            await helloDefiAAVE2Factory.connect(otherAccount2).createClone();

            const ownerCloneAddress = await helloDefiAAVE2Factory.userContracts(owner.address);
            const accountCloneAddress = await helloDefiAAVE2Factory.userContracts(otherAccount1.address);
            const account2CloneAddress = await helloDefiAAVE2Factory.userContracts(otherAccount2.address);

            const ownerSc = await ethers.getContractAt("HelloDefiAAVE2", ownerCloneAddress);
            const account1Sc = await ethers.getContractAt("HelloDefiAAVE2", accountCloneAddress);
            const account2Sc = await ethers.getContractAt("HelloDefiAAVE2", account2CloneAddress);

            expect(ownerSc).not.to.be.null;
            expect(account1Sc).not.to.be.null;
            expect(account2Sc).not.to.be.null;
        });

        it("should emit a CloneCreated event", async () => {
            const {helloDefiAAVE2Factory, owner, otherAccount1, otherAccount2} = await loadFixture(deployHelloDefiAAVE2FactoryFixture);
            let receiptOwner = await helloDefiAAVE2Factory.connect(owner).createClone();
            let receiptAccount1 = await helloDefiAAVE2Factory.connect(otherAccount1).createClone();
            let receiptAccount2 = await helloDefiAAVE2Factory.connect(otherAccount2).createClone();

            const ownerCloneAddress = await helloDefiAAVE2Factory.userContracts(owner.address);
            const accountCloneAddress = await helloDefiAAVE2Factory.userContracts(otherAccount1.address);
            const account2CloneAddress = await helloDefiAAVE2Factory.userContracts(otherAccount2.address);

            expect(receiptOwner).to.emit(receiptOwner, "CloneCreated").withArgs({ _owner: owner.address, _clone: ownerCloneAddress });
            expect(receiptAccount1).to.emit(receiptAccount1, "CloneCreated").withArgs({ _owner: otherAccount1.address, _clone: accountCloneAddress });
            expect(receiptAccount2).to.emit(receiptAccount2, "CloneCreated").withArgs({ _owner: otherAccount2.address, _clone: account2CloneAddress });
        });

    });
});

