import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { MyToken__factory } from "../typechain-types";
dotenv.config();

async function main(){

    const args = process.argv;
    const argValues = args.slice(2);
    if(argValues.length<= 2) throw new Error("Missing address for mint the token!");
    console.log(argValues);
    const myTokenDeployedAddress = argValues[0];
    const mintTokenForAddress = argValues[1];
    const mintTokenValue = argValues[2];
    console.log("MyToken Deployed Address: " + myTokenDeployedAddress);
    console.log("Mint token for Address:" + mintTokenForAddress);
    console.log(`Mint ${mintTokenValue } tokens for Address: ${mintTokenForAddress}`);

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

    console.log("Call the function");
    const txMintTokens = await myTokenContract.mint(mintTokenForAddress,mintTokenValue);
    console.log(`Minting tokens for ${mintTokenForAddress} `);
    console.log(txMintTokens)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });