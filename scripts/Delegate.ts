import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const argValues = args.slice(2);
  if (argValues.length <= 1)
    throw new Error("Missing address to self delegate!");
  console.log(argValues);
  const myTokenDeployedAddress = argValues[0];
  const selfDelegateAddress = argValues[1];

  console.log("MyToken Deployed Address: " + myTokenDeployedAddress);
  console.log("Self delegate Address:" + selfDelegateAddress);

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("Missing environment private key");
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
  const delegateTx = await myTokenContract
    .connect(signer)
    .delegate(selfDelegateAddress);
  const delegateTxReceipt = await delegateTx.wait();
  console.log(
    `The tokens were delegated from account 1 to itself at the block ${delegateTxReceipt.blockNumber}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
