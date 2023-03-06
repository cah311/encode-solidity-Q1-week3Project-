import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { MyToken__factory } from "../typechain-types";
dotenv.config();

async function main(){

    const args = process.argv;
    const argValues = args.slice(2);
    if(argValues.length<= 1) throw new Error("Missing address to check the token balance!");
    console.log(argValues);
    const myTokenDeployedAddress = argValues[0];
    const checkBalanceOfAddress = argValues[1];
    
    console.log("MyToken Deployed Address: " + myTokenDeployedAddress);
    console.log("check the balance of Address:" + checkBalanceOfAddress);
    
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey || privateKey.length <= 0) throw new Error("Missing environment private key");
    //const block = await provider.getBlock("latest");
    //console.log(block);
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`The account ${signer.address} has a balance of ${balance} wei`);
    

    console.log("Attach myToken contract");
    const myTokenFactory = new MyToken__factory(signer);
    const myTokenContract = await myTokenFactory.attach(myTokenDeployedAddress);

    console.log("Call the check balance function");
    let account1VotePower = await myTokenContract.getVotes(checkBalanceOfAddress);
  console.log(
    `The vote power of the account of address ${
        checkBalanceOfAddress
    } is ${ethers.utils.formatEther(account1VotePower)} units`
  );

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });