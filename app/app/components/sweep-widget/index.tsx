"use client";

import { TokenSelector } from "@/components/TokenSelector";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import {
  Button,
  Flex,
  HStack,
  Text,
  VStack,
  Spinner,
  chakra,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { COLORS } from "@/constants/theme";
import SweepButton from "./swap-button";
import { useRouter } from "next/navigation";
import { SweepIcon } from "@/assets/svg";
import OverlappingImage, { getImageArray } from "./ImageLap";
import { useAccount, useEstimateFeesPerGas } from "wagmi";
import { useWalletsPortfolio } from "@/hooks/useMobula";
import { useEthPrice } from "@/hooks/useGetETHPrice2";
import { ETH_ADDRESS } from "@/utils";
import CustomTooltip from "@/components/CustomTooltip";
import useSelectToken from "@/hooks/useSelectToken";
import { ETHToReceive } from "@/components/ETHToReceive";
import FormatNumber from "@/components/FormatNumber";

function SweepWidget() {
  const { address } = useAccount();
  const { tokenList: selectedTokens, clearList } = useSelectToken();
  const { data: estimateData, isLoading: isLoadingEstimateFee } =
    useEstimateFeesPerGas();

  const router = useRouter();

  const { refetch: refetchTokenBalance } = useWalletsPortfolio();

  const { isLoading, ethPrice } = useEthPrice({
    address: ETH_ADDRESS,
  });

  // Generate random time between 3 and 6 seconds
  const randomTime = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, or 6

  useEffect(() => {
    if (address === undefined) {
      clearList();
    }
  }, [address]);

  return (
    <VStack gap="12px" className="w-full max-w-[500px]">
      <Flex justify="end" fontSize="small" width="100%">
        <HStack>
          <Button
            fontWeight="500"
            bg={COLORS.btnBGGradient}
            borderRadius={10}
            fontSize="14px"
            className="text-white/60"
            shadow="small"
            border="1px solid #B190EB"
            onClick={() => {
              refetchTokenBalance();
              router.refresh();
              clearList();
            }}
            _hover={{
              bg: `${COLORS.btnBGGradient}`,
            }}
          >
            Refresh
          </Button>
          {/* <SwapSettings /> */}
        </HStack>
      </Flex>

      {/* ----------- mainbox ---------- */}
      <VStack
        className="border-white/10 border w-full"
        padding="16px"
        borderRadius="12px"
        gap="16px"
      >
        {/* <Box>
          <Image
            width={428}
            height={118}
            alt="Swap tokens Art"
            src="/image/ConvertArt.svg"
          />
        </Box> */}

        <VStack as={"div"} width="100%" gap="12px">
          <Flex width="100%" justify="space-between">
            <Flex gap="6px" alignItems="center">
              <SweepIcon />
              <Text
                fontWeight={500}
                fontSize={{ base: "13px", md: "14px" }}
                className="text-white"
              >
                Sweep
              </Text>
            </Flex>
            <chakra.span fontSize="12px" className="text-white/50">
              {isLoading ? (
                <Flex alignItems="center" gap="2">
                  <Spinner
                    size="sm"
                    color="#9E829F"
                    thickness="2px"
                    speed="0.8s"
                  />
                  <Text fontSize="12px" className="text-white/50">
                    Loading price...
                  </Text>
                </Flex>
              ) : (
                `1ETH ≈ $${ethPrice}`
              )}
            </chakra.span>
          </Flex>
          {/* -------------------- Token Selector is here ------------------- */}
          <TokenSelector>
            <Flex
              width="100%"
              className="border-white/10 border"
              justifyContent="space-between"
              padding="16px 12px"
              fontSize="small"
              fontWeight="bold"
              borderRadius="6px"
              alignItems="center"
            >
              {selectedTokens?.length > 0 ? (
                <Flex alignItems="center" gap="6px">
                  <OverlappingImage
                    imageArray={getImageArray(selectedTokens)}
                  />
                  <Text fontSize="14px" fontWeight="500" className="text-white">
                    {" "}
                    {selectedTokens.length} tokens selected
                  </Text>
                </Flex>
              ) : (
                <Text className="text-white" fontWeight={500} fontSize={14}>
                  Select Tokens
                </Text>
              )}
              <ChevronDownIcon color="#ffffff" fontSize="16px" />
            </Flex>
          </TokenSelector>
        </VStack>

        <VStack
          as={"div"}
          fontSize="small"
          width="100%"
          className="border-t-white/10 border-t"
          paddingTop="24px"
        >
          <Flex width="100%" justifyContent="space-between">
            <Flex alignItems="center" gap="4px">
              <Text fontSize="14px" fontWeight={500} className="text-white/60">
                You will receive
              </Text>
              <CustomTooltip label="Estimated Total Value you will receive in ETH(WETH)">
                <AiOutlineQuestionCircle className="text-white/50" />
              </CustomTooltip>
            </Flex>

            <ETHToReceive selectedTokens={selectedTokens} />
          </Flex>

          <Flex width="100%" justifyContent="space-between">
            <Flex alignItems="center" gap="4px">
              <Text fontSize="14px" fontWeight={500} className="text-white/60">
                Max fee per gas
              </Text>
              <CustomTooltip label="Maximum amount you're willing to pay per unit of gas for this transaction.">
                <AiOutlineQuestionCircle className="text-white/50" />
              </CustomTooltip>
            </Flex>

            {isLoadingEstimateFee ? (
              <Flex alignItems="center" gap="2">
                <Spinner
                  size="sm"
                  color="#9E829F"
                  thickness="2px"
                  speed="0.8s"
                />
                <Text fontSize="12px" className="text-white/50">
                  Loading...
                </Text>
              </Flex>
            ) : (
              <Text>
                <FormatNumber
                  //@ts-expect-error - estimateData is not typed
                  amount={estimateData ? estimateData.maxFeePerGas : "__"}
                  suf="WEI"
                />
              </Text>
            )}
          </Flex>

          <Flex width="100%" justifyContent="space-between">
            <Flex alignItems="center" gap="4px">
              <Text fontSize="14px" fontWeight={500} className="text-white/60">
                Estimated transaction time
              </Text>
              <CustomTooltip label="Estimated time taken for this transaction to be completed.">
                <AiOutlineQuestionCircle className="text-white/50" />
              </CustomTooltip>
            </Flex>

            <Text>{randomTime} seconds</Text>
          </Flex>
          {/* -------------------- Connect Button & Sweep Button is here ------------------- */}
          <SweepButton />
        </VStack>
      </VStack>
    </VStack>
  );
}
export default SweepWidget;
