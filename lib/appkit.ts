"use client";

import { createAppKit } from "@reown/appkit/react";
import { base } from "wagmi/chains";
import { projectId, wagmiAdapter } from "@/provider/WagmiProvider";
import { metadata } from "@/constants/config";

// Create AppKit instance once as a singleton
let appKitInstance: ReturnType<typeof createAppKit> | null = null;

export function getAppKit() {
  if (!appKitInstance) {
    if (!projectId) {
      throw new Error("Project ID is not defined");
    }

    appKitInstance = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [base],
      defaultNetwork: base,
      metadata: metadata,
      features: {
        analytics: true,
      },
    });
  }

  return appKitInstance;
}

// Initialize on module load
if (typeof window !== "undefined") {
  getAppKit();
}

