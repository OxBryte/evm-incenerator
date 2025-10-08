"use client";

import { createAppKit } from "@reown/appkit/react";
import { base } from "wagmi/chains";
import { projectId, wagmiAdapter } from "@/provider/WagmiProvider";
import { metadata } from "@/constants/config";

// Create AppKit instance once as a singleton
let appKitInstance: ReturnType<typeof createAppKit> | null = null;
let isInitialized = false;

export function initAppKit() {
  if (!isInitialized && typeof window !== "undefined") {
    if (!projectId) {
      console.warn("Project ID is not defined, skipping AppKit initialization");
      return null;
    }

    try {
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
      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize AppKit:", error);
      return null;
    }
  }

  return appKitInstance;
}

export function getAppKit() {
  return appKitInstance;
}
