"use client";

import { type ReactNode, useEffect } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { RootProvider } from "@/provider";
import { State, WagmiProvider } from "wagmi";
import ClientOnly from "@/components/ClientOnly";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/provider/WagmiProvider";
import { initAppKit } from "@/lib/appkit";

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const queryClient = new QueryClient();

  // Initialize AppKit on mount (client-side only)
  useEffect(() => {
    initAppKit();
  }, []);

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
