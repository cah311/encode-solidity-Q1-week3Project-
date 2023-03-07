# Week 3 Project

- Form groups of 3 to 5 students
- Complete the contracts together
- Develop and run scripts for “TokenizedBallot.sol” within your group to give voting tokens, delegating voting power, casting votes, checking vote power and querying results
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
- Share your code in a github repo in the submission form

## Deployment contract command:

```
yarn run ts-node --files ./scripts/DeployBothContracts.ts <arg1> <arg2> ...

// verify token contract

yarn hardhat --network goerli verify --contract "contracts/MyToken.sol:MyToken" <contract address>
```

## Mint Contract command:

```
yarn run ts-node --files ./scripts/MintToken.ts <mint token contract address><mint to address><amount to mint>
```

## Check Balance command:

```
yarn run ts-node --files ./scripts/CheckBalance.ts <mint token contract address><address to check>
```

## Delegate voting power to self command:

```
yarn run ts-node --files ./scripts/Delegate.ts <mint token contract address> <your addres>
```

## Vote command:

```
yarn run ts-node --files ./scripts/Vote.ts <mint token contract address> <proposal index> <vote value>
```
