"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  Text,
  Box,
  Spinner,
  HStack,
  DrawerContent,
  Flex,
  Button,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  DrawerOverlay,
  IconButton,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { COLORS } from "@/constants/theme";
import { IoMdClose } from "react-icons/io";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { HiOutlineExternalLink } from "react-icons/hi";
import Tokens from "./Tokens";
import Transactions from "./Transactions";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { truncateAddress } from "@/utils/walletUtils";
import { useBalances } from "@/hooks/balances/useBalances";
import Avatar from "@/assets/svg";
import FormatNumber from "../FormatNumber";
import { MoralisAssetClass } from "@/utils/classes";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNT_TX } from "@/utils/queries";
import { MdCheckCircleOutline } from "react-icons/md";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import Cookies from "js-cookie";
import CopyToClipboard from "react-copy-to-clipboard";
import { ClipLoader } from "react-spinners";
import { useSmartWallet } from "@/hooks/useSmartWallet";
import Link from "next/link";
import TokenPercentageDifference from "../TokenPercentageDifference";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface IModals {
  isOpen: boolean;
  onClose: () => void;
  btnRef: React.RefObject<HTMLButtonElement>;
}

const ActivitiesModal: React.FC<IModals> = ({ isOpen, onClose, btnRef }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const { address } = useAccount();

  const { data: portfolioBalance, isLoading: loadPortfolio } = useBalance({
    address,
  });

  const { disconnect } = useDisconnect();
  const { moralisAssets, isLoading } = useBalances({ address });
  const [userWalletTokens, setWT] = useState<MoralisAssetClass[]>([]);
  const [addressCopied, setAddressCopied] = useState<boolean>(false);

  const { isSmartWallet } = useSmartWallet();

  const {
    data: txns,
    loading,
    error,
  } = useQuery(GET_ACCOUNT_TX, {
    variables: { address },
  });

  useEffect(() => {
    if (moralisAssets) {
      setWT(moralisAssets);
    }
  }, [moralisAssets]);

  useEffect(() => {
    // Load the state from cookies on component mount
    const savedVisibility = Cookies.get("balanceVisibility");
    if (savedVisibility !== undefined) {
      setIsBalanceVisible(savedVisibility === "true");
    }
  }, []);

  const balanceVisibility = () => {
    setIsBalanceVisible((prev) => {
      const newState = !prev;
      // storing the newstate in cookies
      Cookies.set("balanceVisibility", newState.toString(), { expires: 7 }); // Expires in 7 days
      return newState;
    });
  };

  function disconnectAndCloseModal() {
    disconnect();
    onClose();
  }

  const drawerPlacement = useBreakpointValue<"bottom" | "right">({
    base: "bottom",
    md: "right",
  });

  return (
    <Drawer
      isOpen={isOpen}
      placement={drawerPlacement}
      onClose={onClose}
      finalFocusRef={btnRef}
      size={"sm"}
      blockScrollOnMount={true}
    >
      <DrawerOverlay
        bg="rgba(0, 0, 0, 0.7)"
        backdropFilter="blur(10px)"
      />
      <DrawerContent
        bg="linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)"
        borderLeft={{ base: "none", md: "1px solid" }}
        borderTop={{ base: "1px solid", md: "none" }}
        borderColor="rgba(102, 126, 234, 0.2)"
        borderRadius={{ base: "24px 24px 0px 0px", md: "0px" }}
        boxShadow="0 -4px 40px rgba(0, 0, 0, 0.5)"
      >
        {/* ----- Header ----- */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          py="24px"
          px="24px"
          borderBottom="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgGradient: "linear(to-br, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05))",
            zIndex: 0,
          }}
        >
          <VStack spacing="20px" position="relative" zIndex={1}>
            {/* Account Info */}
            <Flex justify="space-between" width="100%">
              <HStack spacing="12px">
                <Box
                  width="48px"
                  height="48px"
                  borderRadius="full"
                  bg="rgba(102, 126, 234, 0.15)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="2px solid"
                  borderColor="rgba(102, 126, 234, 0.3)"
                  position="relative"
                  _before={{
                    content: '""',
                    position: "absolute",
                    inset: "-2px",
                    borderRadius: "full",
                    padding: "2px",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                  }}
                >
                  <Avatar width={32} height={32} />
                </Box>

                <VStack align="start" spacing="4px">
                  {isSmartWallet && (
                    <Badge
                      fontSize="10px"
                      px="8px"
                      py="2px"
                      borderRadius="6px"
                      bg="rgba(0, 186, 130, 0.15)"
                      color="#00BA82"
                      border="1px solid"
                      borderColor="rgba(0, 186, 130, 0.3)"
                      fontWeight="600"
                    >
                      Smart Wallet
                    </Badge>
                  )}
                  <CopyToClipboard
                    text={address ?? ""}
                    onCopy={() => {
                      setAddressCopied(true);
                      setTimeout(() => {
                        setAddressCopied(false);
                      }, 800);
                    }}
                  >
                    <HStack
                      spacing="6px"
                      cursor="pointer"
                      px="12px"
                      py="6px"
                      borderRadius="8px"
                      transition="all 0.2s"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <Text
                        fontSize="15px"
                        fontWeight="600"
                        color="white"
                        letterSpacing="0.3px"
                      >
                        {truncateAddress(address || "")}
                      </Text>

                      {addressCopied ? (
                        <MdCheckCircleOutline
                          size={16}
                          color="#00BA82"
                        />
                      ) : (
                        <HiOutlineDocumentDuplicate
                          size={16}
                          color="rgba(255, 255, 255, 0.5)"
                        />
                      )}
                    </HStack>
                  </CopyToClipboard>
                </VStack>
              </HStack>

              <IconButton
                aria-label="Close drawer"
                icon={<IoMdClose size="20px" />}
                onClick={onClose}
                bg="rgba(255, 255, 255, 0.05)"
                color="white"
                borderRadius="12px"
                size="md"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                }}
              />
            </Flex>

            {/* Smart Wallet Link */}
            {isSmartWallet && (
              <MotionBox
                as={Link}
                href="https://keys.coinbase.com"
                rel="noopener noreferrer"
                target="_blank"
                w="100%"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  w="100%"
                  borderRadius="12px"
                  bg="rgba(0, 186, 130, 0.1)"
                  border="1px solid"
                  borderColor="rgba(0, 186, 130, 0.3)"
                  py="12px"
                  px="16px"
                  transition="all 0.3s"
                  _hover={{
                    bg: "rgba(0, 186, 130, 0.15)",
                    borderColor: "rgba(0, 186, 130, 0.5)",
                    transform: "translateX(4px)",
                  }}
                >
                  <Text fontSize="14px" fontWeight="600" color="#00BA82">
                    View Wallet on Coinbase
                  </Text>
                  <HiOutlineExternalLink size="16px" color="#00BA82" />
                </Flex>
              </MotionBox>
            )}

            {/* Balance Section */}
            <VStack align="start" spacing="12px" width="100%" mt="8px">
              <HStack spacing="10px">
                <Text fontWeight={600} fontSize="14px" color="rgba(255, 255, 255, 0.6)">
                  Total Balance
                </Text>

                <IconButton
                  aria-label="Toggle balance visibility"
                  icon={
                    isBalanceVisible ? (
                      <IoMdEye size="18px" />
                    ) : (
                      <IoMdEyeOff size="18px" />
                    )
                  }
                  onClick={balanceVisibility}
                  size="xs"
                  bg="rgba(255, 255, 255, 0.05)"
                  color="rgba(255, 255, 255, 0.7)"
                  borderRadius="8px"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.1)",
                  }}
                />
              </HStack>

              {loadPortfolio ? (
                <HStack spacing={3}>
                  <Spinner size="md" color="#667eea" thickness="3px" />
                  <Text fontSize="14px" color="rgba(255, 255, 255, 0.5)">
                    Loading balances...
                  </Text>
                </HStack>
              ) : (
                <HStack spacing="12px" align="center">
                  <Text
                    fontWeight={700}
                    fontSize="42px"
                    bgGradient="linear(to-r, white, gray.400)"
                    bgClip="text"
                    lineHeight="1"
                  >
                    {isBalanceVisible ? (
                      <FormatNumber
                        pre="$"
                        amount={
                          portfolioBalance?.value
                            ? Number(
                                userWalletTokens.reduce(
                                  (sum, item) => sum + item.quoteUSD,
                                  0
                                )
                              )
                            : 0
                        }
                      />
                    ) : (
                      "****"
                    )}
                  </Text>

                  <TokenPercentageDifference
                    data={userWalletTokens}
                    cacheDuration={300}
                    sum={userWalletTokens.reduce(
                      (sum, item) => sum + item.quoteUSD,
                      0
                    )}
                  />
                </HStack>
              )}
            </VStack>
          </VStack>
        </MotionBox>

        <DrawerBody px="0" py="0">
          <Tabs variant="unstyled" colorScheme="purple">
            <TabList
              px="24px"
              pt="20px"
              borderBottom="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              gap="8px"
            >
              <Tab
                color="rgba(255, 255, 255, 0.5)"
                fontSize="15px"
                fontWeight={500}
                px="16px"
                py="10px"
                borderRadius="10px"
                transition="all 0.2s"
                _selected={{
                  color: "white",
                  bg: "rgba(102, 126, 234, 0.15)",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
                }}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.05)",
                }}
              >
                Tokens
              </Tab>
              <Tab
                color="rgba(255, 255, 255, 0.5)"
                fontSize="15px"
                fontWeight={500}
                px="16px"
                py="10px"
                borderRadius="10px"
                transition="all 0.2s"
                _selected={{
                  color: "white",
                  bg: "rgba(102, 126, 234, 0.15)",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
                }}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.05)",
                }}
              >
                Transactions
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px="24px" py="20px">
                {isLoading ? (
                  <Flex
                    justify="center"
                    align="center"
                    height="200px"
                    flexDir="column"
                    gap="16px"
                  >
                    <Spinner size="lg" color="#667eea" thickness="4px" />
                    <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                      Loading tokens...
                    </Text>
                  </Flex>
                ) : (
                  <Tokens userWalletTOKENS={userWalletTokens} />
                )}
              </TabPanel>
              <TabPanel px="24px" py="20px">
                <Transactions
                  txns={txns?.tokenSwappeds}
                  loading={loading}
                  error={error}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>

        <DrawerFooter display={{ base: "none", md: "flex" }}>
          <Center
            as={Button}
            width="100%"
            bgColor="#FFDFE3"
            color="#E2001B"
            fontWeight={400}
            borderRadius="8px"
            h="40px"
            onClick={disconnectAndCloseModal}
            _hover={{
              bgColor: "#FFDFE3",
              color: "#E2001B",
            }}
          >
            Disconnect Wallet
          </Center>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ActivitiesModal;
