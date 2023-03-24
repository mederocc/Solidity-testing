const ethers = require('ethers');
const fs = require('fs-extra');
require('dotenv').config();

function callback(progress) {
  console.log('Encrypting: ' + parseInt(progress * 100) + '% complete');
}
// a new wallet is generated from PRIVATE_KEY
// an encrypted json is generated from the wallet by passing it a password
// the encrypted json is the stored in file .encryptedKey.json
// we remove PRIVATE_KEY and PRIVATE_KEY_PASSWORD from .env as they've now be encrypted to .encryptedey.son
// finally, we are able to generate new wallets using the encryptedJson instead of storing a PRIVATE_KEY in our .env file
// we do need to set the value of PRIVATE_KEY_PASSWORD in the console, as it won't be stored in .env anymore either
// in the terminal: PRIVATE_KEY_PASSWORD=*pasword here* node deploy.js

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    callback
  );
  console.log(encryptedJsonKey);
  fs.writeFileSync('./.encryptedKey.json', encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
