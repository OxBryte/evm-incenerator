"use client";

import ContainerWrapper from "../ContainerWrapper";
import { Box, HStack } from "@chakra-ui/react";
import { memo } from "react";
import Link from "next/link";
import Image from "next/image";

import LogoSvg from "@/assets/icons/LogoSVG.svg";
import ConnectButton from "../Buttons/ConnectButton";
import { CustomConnectButton } from "../Buttons/SmartWalletButton";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

const NavBar = () => {
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  return (
    <Box
      bg="transparent"
      pos={"fixed"}
      w="100%"
      py="10px"
      zIndex={10}
      top={0}
      className="border-b-white/10 border-b"
    >
      <ContainerWrapper>
        <HStack h={"55px"} justify={"space-between"}>
          <HStack>
            <HStack>
              <Link href={"/"} role="logo_link" prefetch={false}>
                <Image alt="Logo" src={LogoSvg} />
              </Link>
            </HStack>
          </HStack>
          <HStack>
            <ConnectButton onOpen={open} />
            {!isConnected && <CustomConnectButton />}
          </HStack>
        </HStack>
      </ContainerWrapper>
    </Box>
  );
};

export default memo(NavBar);
