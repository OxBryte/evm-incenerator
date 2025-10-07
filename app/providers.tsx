"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { RootProvider } from "@/provider";
import { State, WagmiProvider } from "wagmi";
import ClientOnly from "@/components/ClientOnly";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, projectId, wagmiAdapter } from "@/provider/WagmiProvider";
import { createAppKit } from "@reown/appkit";
import { metadata } from "@/constants/config";

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const queryClient = new QueryClient();
  if (!projectId) {
    throw new Error("Project ID is not defined");
  }

  const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [base],
    defaultNetwork: base,
    metadata: metadata,
    features: {
      analytics: true, // Optional - defaults to your Cloud configuration
    },
  });

  return (
    <RootProvider initialState={initialState}>
      <ClientOnly>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: "auto",
              theme: "mini-app-theme",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              logo: process.env.NEXT_PUBLIC_ICON_URL,
            },
          }}
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </WagmiProvider>
        </MiniKitProvider>
      </ClientOnly>
    </RootProvider>
  );
}
