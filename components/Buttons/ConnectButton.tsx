"use client";

import { Button, Flex, Text, Box } from "@chakra-ui/react";
import Avatar from "@/assets/svg";
import { truncateAddress } from "@/utils/walletUtils";
import { useAccount } from "wagmi";
import { COLORS } from "@/constants/theme";
import { IoIosArrowDown } from "react-icons/io";
import { RiWallet3Line } from "react-icons/ri";
import { useAppKit } from "@reown/appkit/react";
import { motion } from "framer-motion";

const MotionButton = motion(Button);
const MotionBox = motion(Box);

export default function ConnectButtonRainbow({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const { address } = useAccount();
  const { open } = useAppKit();

  return address ? (
    <CustomConnectButton onOpen={onOpen} address={address} />
  ) : (
    <MotionButton
      bgGradient="linear(to-r, #667eea, #764ba2)"
      position="relative"
      overflow="hidden"
      _hover={{
        bgGradient: "linear(to-r, #764ba2, #667eea)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.35)",
      }}
      _active={{
        transform: "translateY(0px)",
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.25)",
      }}
      boxShadow="0 4px 15px rgba(102, 126, 234, 0.2)"
      h="44px"
      px="24px"
      color="white"
      fontWeight={600}
      fontSize="15px"
      borderRadius="12px"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      transition="all 0.3s ease"
      onClick={() => open()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        transition: "left 0.5s",
      }}
      sx={{
        "&:hover::before": {
          left: "100%",
        },
      }}
    >
      <Flex align="center" gap="8px">
        <RiWallet3Line size="18px" />
        <Text>Connect Wallet</Text>
      </Flex>
    </MotionButton>
  );
}

interface Props {
  onOpen: () => void;
  address: `0x${string}`;
}

function CustomConnectButton({ onOpen, address }: Props) {
  return (
    <MotionBox
      as="button"
      onClick={onOpen}
      px="16px"
      py="10px"
      borderRadius="12px"
      bg="rgba(255, 255, 255, 0.05)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        bg: "rgba(255, 255, 255, 0.08)",
        borderColor: "rgba(102, 126, 234, 0.5)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
      }}
      _active={{
        transform: "translateY(0px)",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Flex align="center" gap="10px">
        <Box
          width="32px"
          height="32px"
          borderRadius="full"
          bg="rgba(102, 126, 234, 0.15)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="2px solid"
          borderColor="rgba(102, 126, 234, 0.3)"
        >
          <Avatar />
        </Box>
        <Flex align="center" gap="8px">
          <Text
            fontSize="14px"
            fontWeight="600"
            color="white"
            letterSpacing="0.3px"
          >
            {truncateAddress(address || "")}
          </Text>
          <MotionBox
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <IoIosArrowDown size="14px" color="rgba(255, 255, 255, 0.7)" />
          </MotionBox>
        </Flex>
      </Flex>
    </MotionBox>
  );
}
