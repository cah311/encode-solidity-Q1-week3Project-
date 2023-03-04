import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  // Deploy the contract
  const [deployer, account1, account2] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployTxReceipt = await contract.deployTransaction.wait();
  console.log(
    `The ERCVotes contract was deployed at the address ${contract.address} at the block number ${deployTxReceipt.blockNumber}`
  );

  // Mint some tokens
  const mintTx = await contract.mint(account1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();
  console.log(
    `The tokens were minted for the account of address ${account1.address} at the block ${mintTxReceipt.blockNumber}`
  );

  // Check the voting power
  let account1Balance = await contract.balanceOf(account1.address);
  console.log(
    `The balance of the account of address ${
      account1.address
    } is ${ethers.utils.formatEther(account1Balance)} Tokens`
  );

  let account1VotePower = await contract.getVotes(account1.address);
  console.log(
    `The vote power of the account of address ${
      account1.address
    } is ${ethers.utils.formatEther(account1VotePower)} units`
  );

  // Self delegate
  const delegateTx = await contract
    .connect(account1)
    .delegate(account1.address);
  const delegateTxReceipt = await delegateTx.wait();
  console.log(
    `The tokens were delegated from account 1 to itself at the block ${delegateTxReceipt.blockNumber}`
  );

  account1VotePower = await contract.getVotes(account1.address);
  console.log(
    `The vote power of the account of address ${
      account1.address
    } is now ${ethers.utils.formatEther(account1VotePower)} units`
  );

  // Transfer
  const transferTx = await contract
    .connect(account1)
    .transfer(account2.address, MINT_VALUE.div(2));
  const transferTxReceipt = await transferTx.wait();
  console.log(
    `The tokens were transfered from the account 1 to account 2 at the block ${transferTxReceipt.blockNumber}`
  );

  account1VotePower = await contract.getVotes(account1.address);
  console.log(
    `The vote power of the account 1 is ${ethers.utils.formatEther(
      account1VotePower
    )} units`
  );
  const account2VotePower = await contract.getVotes(account2.address);
  console.log(
    `The vote power of the account 2 is ${ethers.utils.formatEther(
      account2VotePower
    )} units`
  );

  const account2Balance = await contract.balanceOf(account2.address);
  console.log(
    `The balance of the account 2 is ${ethers.utils.formatEther(
      account2Balance
    )} Tokens`
  );

  // Historic vote power
  const currentBlock = await ethers.provider.getBlock("latest");
  console.log(`We are currently at block ${currentBlock.number}`);

  account1VotePower = await contract.getPastVotes(
    account1.address,
    currentBlock.number - 1
  );
  console.log(
    `The vote power of the account 1 is ${ethers.utils.formatEther(
      account1VotePower
    )} units at block ${currentBlock.number - 1}`
  );

  account1VotePower = await contract.getPastVotes(
    account1.address,
    currentBlock.number - 2
  );
  console.log(
    `The vote power of the account 1 is ${ethers.utils.formatEther(
      account1VotePower
    )} units at block ${currentBlock.number - 2}`
  );

  account1VotePower = await contract.getPastVotes(
    account1.address,
    currentBlock.number - 3
  );
  console.log(
    `The vote power of the account 1 is ${ethers.utils.formatEther(
      account1VotePower
    )} units at block ${currentBlock.number - 3}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
