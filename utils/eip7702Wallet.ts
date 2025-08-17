import { 
  type WalletClient, 
  type PublicClient, 
  type Address, 
  type Hex,
  encodeFunctionData,
  parseEther,
  createWalletClient,
  http
} from "viem";
import { EIP7702_IMPLEMENTATION_ABI } from "./eip7702";

// EIP-7702 Wallet Integration Utilities
export interface EIP7702WalletCapabilities {
  eip7702: boolean;
  erc5792: boolean;
  erc7710: boolean;
  erc7715: boolean;
}

export interface EIP7702TransactionRequest {
  to: Address;
  data: Hex;
  value: bigint;
  type: "0x04"; // EIP-7702 transaction type
  authorizations: Hex[];
  chainId: bigint;
}

/**
 * Check if wallet supports EIP-7702 features
 */
export async function checkEIP7702Capabilities(
  walletClient: WalletClient
): Promise<EIP7702WalletCapabilities> {
  try {
    const capabilities = await walletClient.request({
      method: 'wallet_getCapabilities',
      params: []
    }) as any;

    return {
      eip7702: capabilities?.eip7702 === true,
      erc5792: capabilities?.erc5792 === true,
      erc7710: capabilities?.erc7710 === true,
      erc7715: capabilities?.erc7715 === true,
    };
  } catch {
    return {
      eip7702: false,
      erc5792: false,
      erc7710: false,
      erc7715: false,
    };
  }
}

/**
 * Send EIP-7702 transaction with proper 0x04 type
 */
export async function sendEIP7702Transaction(
  walletClient: WalletClient,
  transaction: EIP7702TransactionRequest
): Promise<Hex> {
  try {
    // Try EIP-7702 specific method first
    const hash = await walletClient.request({
      method: 'eth_sendTransaction',
      params: [{
        ...transaction,
        type: '0x04',
        authorizations: transaction.authorizations
      }]
    }) as Hex;

    return hash;
  } catch (error) {
    console.error("EIP-7702 transaction failed, falling back to standard transaction:", error);
    
    // Fallback to standard transaction
    const hash = await walletClient.sendTransaction({
      to: transaction.to,
      data: transaction.data,
      value: transaction.value,
    });

    return hash;
  }
}

/**
 * Use ERC-5792 wallet_sendCalls for batch execution
 */
export async function sendERC5792Calls(
  walletClient: WalletClient,
  calls: Array<{ to: Address; data: Hex; value: bigint }>
): Promise<Hex> {
  try {
    const result = await walletClient.request({
      method: 'wallet_sendCalls',
      params: [{
        calls: calls.map(call => ({
          to: call.to,
          data: call.data,
          value: call.value.toString()
        }))
      }]
    }) as any;

    return result.hash;
  } catch (error) {
    throw new Error(`ERC-5792 not supported: ${error}`);
  }
}

/**
 * Use ERC-7710/7715 for companion account permissions
 */
export async function requestERC7710Permissions(
  walletClient: WalletClient,
  companionAddress: Address,
  permissions: string[]
): Promise<boolean> {
  try {
    const result = await walletClient.request({
      method: 'wallet_grantPermissions',
      params: [{
        target: companionAddress,
        permissions: permissions
      }]
    }) as boolean;

    return result;
  } catch (error) {
    console.error("ERC-7710/7715 not supported:", error);
    return false;
  }
}

/**
 * Create EIP-7702 wallet client with extended capabilities
 */
export function createEIP7702WalletClient(
  account: any,
  chain: any,
  transport: any
): WalletClient {
  const client = createWalletClient({
    account,
    chain,
    transport,
  });

  // Extend with EIP-7702 methods
  return {
    ...client,
    sendEIP7702Transaction: (transaction: EIP7702TransactionRequest) => 
      sendEIP7702Transaction(client, transaction),
    sendERC5792Calls: (calls: Array<{ to: Address; data: Hex; value: bigint }>) =>
      sendERC5792Calls(client, calls),
    requestERC7710Permissions: (companionAddress: Address, permissions: string[]) =>
      requestERC7710Permissions(client, companionAddress, permissions),
    checkEIP7702Capabilities: () => checkEIP7702Capabilities(client),
  };
}

/**
 * Get implementation contract address for current network
 */
export function getImplementationAddress(chainId: number): Address {
  // In a real implementation, this would return the deployed contract address
  // For now, we'll use a placeholder
  const addresses: Record<number, Address> = {
    1: "0x0000000000000000000000000000000000000001" as Address, // Mainnet
    11155111: "0x0000000000000000000000000000000000000001" as Address, // Sepolia
    137: "0x0000000000000000000000000000000000000001" as Address, // Polygon
    42161: "0x0000000000000000000000000000000000000001" as Address, // Arbitrum
  };

  return addresses[chainId] || "0x0000000000000000000000000000000000000001" as Address;
}
