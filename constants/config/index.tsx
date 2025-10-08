import {
  SITE_DESCRIPTION,
  SITE_ICON_URL,
  SITE_NAME,
  SITE_URL,
} from "@/utils/site";

// Reown AppKit project ID (formerly WalletConnect)
export const REOWN_PROJECT_ID = "b10ff2f14f1c8a4efecf95865ebb1ac2";

if (!REOWN_PROJECT_ID) {
  console.warn(
    "You need to provide a NEXT_PUBLIC_PROJECT_ID env variable"
  );
}

// Metadata for Reown AppKit
export const metadata = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  icons: [SITE_ICON_URL],
};
