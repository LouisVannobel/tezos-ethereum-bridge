//require('dotenv').config();
require('dotenv').config({ path: '../.env' });
const { ethers } = require('ethers');
const { TezosToolkit } = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');

// Ethereum
const ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const ethWallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, ethProvider);
const vaultAbi = [
  "event Deposit(address indexed user, uint256 amount)",
  "function withdraw(uint256 amount, bytes memory proof)"
];
const vaultContract = new ethers.Contract(
  process.env.RELAYER_ADDRESS, // Adresse du contrat ERC20Vault
  vaultAbi,
  ethWallet
);

// Tezos
const tezos = new TezosToolkit(process.env.TEZOS_RPC_URL);
tezos.setProvider({
  signer: new InMemorySigner(process.env.TEZOS_PRIVATE_KEY)
});

const FA2_TOKEN_ID = 0;

async function setupTezosContract() {
  return tezos.contract.at(process.env.TEZOS_FA2_ADDRESS);
}

// Écoute des événements Ethereum
async function listenEthereumDeposits() {
  console.log('Listening for Ethereum deposits...');
  
  vaultContract.on('Deposit', async (user, amount) => {
    try {
      console.log(`New deposit detected - User: ${user}, Amount: ${amount}`);
      
      // Appel du mint sur Tezos
      const tezosContract = await setupTezosContract();
      const op = await tezosContract.methods.mint(
        user, 
        amount.toString(), 
        FA2_TOKEN_ID
      ).send();
      
      console.log(`Tezos mint transaction hash: ${op.hash}`);
      await op.confirmation(1);
      console.log(`Mint confirmed for ${user}`);
    } catch (error) {
      console.error('Error processing deposit:', error);
    }
  });
}

// Écoute des burns sur Tezos (polling)
async function listenTezosBurns() {
  console.log('Listening for Tezos burns...');
  let lastCheckedLevel = await tezos.rpc.getBlockHeader().then(header => header.level);

  setInterval(async () => {
    try {
      const currentLevel = await tezos.rpc.getBlockHeader().then(header => header.level);
      
      const events = await tezos.rpc.getEvents({
        address: process.env.TEZOS_FA2_ADDRESS,
        tag: 'Burn',
        startLevel: lastCheckedLevel
      });

      for (const event of events) {
        const { user, amount } = event.payload;
        console.log(`New burn detected - User: ${user}, Amount: ${amount}`);
        
        // Appel du withdraw sur Ethereum
        const tx = await vaultContract.withdraw(
          ethers.utils.parseUnits(amount, 0),
          '0x' // Proof vide pour l 'instant
        );
        
        console.log(`Ethereum withdrawal tx hash: ${tx.hash}`);
        await tx.wait(1);
        console.log(`Withdrawal confirmed for ${user}`);
      }

      lastCheckedLevel = currentLevel + 1;
    } catch (error) {
      console.error('Error processing burns:', error);
    }
  }, 30000); // toutes les 30 secondes

}


async function start() {
  try {
    await listenEthereumDeposits();
    await listenTezosBurns();
    console.log('Relayer operational');
  } catch (error) {
    console.error('Relayer startup failed:', error);
    process.exit(1);
  }
}

start();