import { ethers } from "hardhat";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

// deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// address1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
// address2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
// address3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
// token contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// ballot contract: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

async function main() {
  // Get set arguments
  const args = process.argv;
  const parameters = args.slice(2);
  if (parameters.length <= 0)
    throw new Error("Missing arguments: Contract Addres, Wallet address");
  // if ((parameters.length = 1))
  //   throw new Error("Missing arguments: Wallet address");
  if (parameters.length > 3)
    throw new Error("Can only mint to one address at a time");

  const tokenAddress = parameters[0];
  const minterAddress = parameters[1];
  const recipient = parameters[2];

  console.log(`Contract: ${tokenAddress}`);
  console.log(`Wallet: ${minterAddress}`);
  const signer = await ethers.getSigner(minterAddress);
  const address1 = await ethers.getSigner(recipient);

  // connect to contract
  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = await tokenContractFactory.attach(tokenAddress);

  console.log("TokenContract: " + tokenContract.address);

  // // mint tokens
  const mintTX = await tokenContract.mint(address1.address, MINT_VALUE);
  const mintTxReceipt = await mintTX.wait();
  console.log(
    `The tokens were minted for the account of address ${address1.address} at the block ${mintTxReceipt.blockNumber}`
  );

  //let minterBalance = await tokenContract.balanceOf(address1.address);
  // console.log(
  //   `The balance of the account of address ${
  //     address1.address
  //   } is ${ethers.utils.formatEther(minterBalance)} Tokens`
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
