import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const argValues = args.slice(2);
  if (argValues.length <= 2)
    throw new Error("Missing address for mint the token!");
  console.log(argValues);
  const myTokenDeployedAddress = argValues[0];
  const proposalIndex = argValues[1];
  const voteValue = argValues[2];
  console.log("Tokenized Ballot Deployed Address: " + myTokenDeployedAddress);
  console.log("Proposal Index:" + proposalIndex);
  console.log(`Vote ${voteValue} amount to Proposal: ${proposalIndex}`);

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

  console.log("Attach Tokenized Ballot contract");
  const tokenizedballotFactory = new TokenizedBallot__factory(signer);
  const tokenizedBallotContract = await tokenizedballotFactory.attach(
    myTokenDeployedAddress
  );

  console.log("Call the vote function");
  const txVoting = await tokenizedBallotContract.vote(
    proposalIndex,
    ethers.utils.parseUnits(voteValue)
  );
  console.log(`voting  ${proposalIndex} `);
  console.log(txVoting);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
