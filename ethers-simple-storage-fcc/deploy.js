const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config();

// get access to a node on the eth network through test net Sepolia
// generate wallet from private key, with access to such network
// deploy new contract signed by the generated wallet
// play around with contract

async function main() {
  //http://127.0.0.1:7545

  // CONNETING TO Ethereum NODE by passing url given by Ganache (or Sepolia testnet on Alchemy) to provider
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Instance the wallet associated to our private key
  // UNSAFE METHOD:
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // SAFE METHOD:
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  // let wallet = await ethers.Wallet.fromEncryptedJson(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = wallet.connect(provider);

  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8');

  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf8'
  );
  // get contract factory instance so we can deploy
  // abi allows interaction with the defined events and methods.
  // binary is the compiled bytecode of the contract; it's what we actually deploy
  // wallet is the (optional) signer. Contracts without a signer can't send transactions

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  const contract = await contractFactory.deploy();

  await contract.deploymentTransaction().wait(1);

  console.log(contract.target); // I meant to run contract.address, but I'm not getting the address. This seems to be it?

  // playing with functions in deployed contract

  // returns current favorite number
  let currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
  console.log('Updating favorite number...');

  // updates number, which saves it to the blockchain
  let transactionResponse = await contract.store(7);
  await contract.increment();

  // waits for transaction to be confirmed
  let transactionReceipt = await transactionResponse.wait();

  //returns current number
  currentFavoriteNumber = await contract.retrieve();
  console.log(`New Favorite Number: ${currentFavoriteNumber}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
