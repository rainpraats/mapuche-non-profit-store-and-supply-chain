import { ethers, Wallet } from 'ethers';
import { ANVIL_PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS } from './envVariables';
import abi from './abi.js';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new Wallet(ANVIL_PRIVATE_KEY, provider);
export const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
