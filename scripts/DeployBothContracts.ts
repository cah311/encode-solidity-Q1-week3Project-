import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { TokenizedBallot__factory, MyToken__factory } from "../typechain-types";
dotenv.config();

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey || privateKey.length <= 0) throw new Error("Missing environment private key");
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`The account ${signer.address} has a balance of ${balance} wei`);
    
    const args = process.argv;
    const proposals = args.slice(2);
    if(proposals.length<= 0) throw new Error();
    console.log("proposals");
    proposals.forEach((element, index) =>{
        console.log(`Proposal at ${index+1}: ${element}`);
    });  

    console.log("Deploying MyToken contract");
    const myTokenFactory = new MyToken__factory(signer);
    const myTokenContract = await myTokenFactory.deploy();
    console.log("awaiting for confirmation...");
    const txTokenReceipt = await myTokenContract.deployTransaction.wait();
    console.log(`The MyToken contract was deployed at address ${myTokenContract.address} in the block ${txTokenReceipt.blockNumber}`);
    
    console.log("Deploying Tokenized Ballot contract");
    const tokenizedballotFactory = new TokenizedBallot__factory(signer);
    const tokenizedBallotContract = await tokenizedballotFactory.deploy(proposals.map(p=> ethers.utils.formatBytes32String(p)), myTokenContract.address,txTokenReceipt.blockNumber );
    console.log("awaiting for confirmation...");
    const txReceipt = await tokenizedBallotContract.deployTransaction.wait();
    console.log(`The tokenized ballot contract was deployed at address ${tokenizedBallotContract.address} in the block ${txReceipt.blockNumber}`);
    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
