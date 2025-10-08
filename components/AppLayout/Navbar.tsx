"use client";

import ContainerWrapper from "../ContainerWrapper";
import { Box, HStack, useDisclosure } from "@chakra-ui/react";
import { memo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import LogoSvg from "@/assets/icons/LogoSVG.svg";
import ConnectButton from "../Buttons/ConnectButton";
import { CustomConnectButton } from "../Buttons/SmartWalletButton";
import { useAccount } from "wagmi";
import ActivitiesModal from "../ActivitiesModal";

const MotionBox = motion(Box);

const NavBar = () => {
  const { isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MotionBox
      as="nav"
      position="fixed"
      w="100%"
      top={0}
      zIndex={1000}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        bg={
          isScrolled
            ? "rgba(10, 10, 10, 0.8)"
            : "rgba(10, 10, 10, 0.3)"
        }
        backdropFilter={isScrolled ? "blur(20px)" : "blur(0px)"}
        borderBottom="1px solid"
        borderColor={
          isScrolled
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.05)"
        }
        transition="all 0.3s ease"
        boxShadow={
          isScrolled
            ? "0 4px 30px rgba(0, 0, 0, 0.3)"
            : "none"
        }
        py={isScrolled ? "8px" : "12px"}
      >
        <ContainerWrapper>
          <HStack h={"55px"} justify={"space-between"}>
            <HStack spacing="20px">
              <Link href={"/"} role="logo_link" prefetch={false}>
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image 
                    alt="Logo" 
                    src={LogoSvg}
                    style={{
                      filter: isScrolled ? "drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))" : "none",
                      transition: "filter 0.3s ease"
                    }}
                  />
                </MotionBox>
              </Link>

              {isScrolled && (
                <MotionBox
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  width="1px"
                  height="24px"
                  bg="rgba(255, 255, 255, 0.1)"
                />
              )}
            </HStack>

            <HStack spacing="12px">
              <ConnectButton onOpen={onOpen} />
              {!isConnected && <CustomConnectButton />}
            </HStack>
          </HStack>

          <ActivitiesModal isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        </ContainerWrapper>
      </Box>
    </MotionBox>
  );
};

export default memo(NavBar);
