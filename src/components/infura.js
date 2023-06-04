// infura.js
import { SDK , Auth , TEMPLATES , Metadata } from '@infura/sdk';


console.log(process.env.NEXT_PUBLIC_INFURA_API_KEY);
const auth = new Auth({
  projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
  secretId: process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET,
  privateKey: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY,
  chainId: 5,
});

const sdk = new SDK(auth);

async function getCollectionsByWallet(walletAddress) {
  const result = await sdk.api.getCollectionsByWallet({
    walletAddress: walletAddress,
  });
  console.log('collections:', result);
}

module.exports = {
  getCollectionsByWallet,
};
