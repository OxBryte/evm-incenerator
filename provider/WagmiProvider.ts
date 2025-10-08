import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";

// Get projectId from https://dashboard.reown.com
// Fallback to WALLETCONNECT_PROJECT_ID for backwards compatibility
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b10ff2f14f1c8a4efecf95865ebb1ac2";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [base];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
