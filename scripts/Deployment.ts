import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

// converts string argumetns to bytes
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  // connect to provider
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("Missing environment: PRIVATE_KEY");

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  const balance = await signer.getBalance();

  console.log(`The account ${signer.address} has a balance of ${balance} Wei`);

  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = await tokenContractFactory.deploy();
  const deployTxReciept = await tokenContract.deployTransaction.wait();
  console.log(
    `The contract was deplyed at ${tokenContract.address} at the block number ${deployTxReciept.blockNumber}`
  );

  // set arguments for proposal
  const args = process.argv;
  const proposals = args.slice(2);
  if (proposals.length <= 0) throw new Error("Missing argument: proposals");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  // set block number
  const currentBlock = await provider.getBlock("latest");
  console.log(`We are currently at block ${currentBlock.number}`);

  // create ballot contract
  const ballotContractFactory = new TokenizedBallot__factory(signer);
  console.log("Deploying ballot contract...");
  const ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenContract.address,
    currentBlock.number
  );
  const ballotContractTxReceipt = await ballotContract.deployTransaction.wait();
  console.log(
    `The ballot contract was deployed at ${ballotContract.address} in block number ${ballotContractTxReceipt.blockNumber}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
