import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

async function main() {
  // connect to hardhat wallets

  const [deployer, account1, account2, account3] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployTxReciept = await contract.deployTransaction.wait();
  console.log(
    `The contract was deplyed at ${contract.address} at the block number ${deployTxReciept.blockNumber}`
  );

  // set arguments for proposal
  const args = process.argv;
  const proposals = args.slice(1);
  if (proposals.length <= 0) throw new Error("Missing argument: proposals");
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
