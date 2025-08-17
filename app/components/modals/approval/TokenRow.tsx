"use client";

import { COLORS } from "@/constants/theme";
import { Token } from "@/lib/components/types";
import {
  HStack,
  WrapItem,
  Avatar,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Address, erc20Abi, parseUnits } from "viem";
import { toDecimalString } from "@/utils/numberUtils";
import { useAccount, useReadContract } from "wagmi";
import { ClipLoader } from "react-spinners";
import { RxReload } from "react-icons/rx";
import { assetscooper_contract } from "@/constants/contractAddress";
import { useApprove } from "@/hooks/useAssetScooperWriteContract";

interface TokenRowProps {
  token: Token;
  refetch: () => void;
  onClose: () => void;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, refetch, onClose }) => {
  const {
    name,
    logoURI,
    address: tokenAddress,
    symbol,
    userBalance,
    decimals,
  } = token;

  const { address } = useAccount();

  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch: refetchAllowance,
  } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as Address,
    functionName: "allowance",
    args: address ? [address, assetscooper_contract] : undefined,
  });

  const {
    approve,
    isLoading: isPendingApproval,
    isSuccess,
  } = useApprove(tokenAddress as Address, [
    assetscooper_contract,
    parseUnits(toDecimalString(userBalance), decimals),
  ]);

  const handleApprove = async () => {
    await approve();

    //***Close the modal only if the approval is successful
    if (isSuccess) {
      onClose();
    }
  };

  const isApproved =
    !!allowance && allowance >= parseUnits(toDecimalString(userBalance), decimals);
  const isLoading = isAllowanceLoading || isPendingApproval;

  useEffect(() => {
    if (isSuccess) {
      refetchAllowance();
      refetch();
      // Close the modal when the approval is successful
      onClose();
    }
  }, [isSuccess, onClose, refetchAllowance, refetch]);

  return (
    <HStack
      width="100%"
      justifyContent="space-between"
      padding="1.5rem"
      bg="gray.700"
      border="1px solid"
      borderColor="gray.600"
      borderRadius="16px"
    >
      <HStack alignItems="center" gap="12px">
        <WrapItem>
          <Avatar size="md" name={name} src={logoURI} />
        </WrapItem>

        <VStack gap="2" alignItems="start">
          <Text fontSize="16px" fontWeight="700" color="white">
            {symbol.length > 6 ? `${symbol.substring(0, 5)}...` : symbol}
          </Text>
          <Text color="gray.400" fontSize="14px">
            {name}
          </Text>
          <Badge 
            colorScheme={userBalance > 0 ? "green" : "gray"} 
            variant="subtle"
            fontSize="12px"
          >
            Balance: {userBalance.toFixed(4)}
          </Badge>
        </VStack>
      </HStack>

      <HStack alignItems="center" spacing={3}>
        <Button
          onClick={handleApprove}
          isLoading={isLoading}
          loadingText={isApproved ? "Approved" : "Approving..."}
          isDisabled={isApproved}
          size="lg"
          color="white"
          fontSize="16px"
          fontWeight={600}
          bg={isApproved ? "green.600" : COLORS.btnGradient}
          borderRadius="12px"
          px={8}
          _hover={{
            bg: isApproved ? "green.600" : COLORS.btnGradient,
            opacity: 0.9,
          }}
        >
          {isApproved ? "Approved" : "Approve"}
        </Button>

        <Button 
          onClick={() => refetchAllowance()} 
          isDisabled={isLoading}
          bg="gray.600"
          color="white"
          _hover={{ bg: "gray.500" }}
          borderRadius="12px"
          size="lg"
        >
          {isLoading ? <ClipLoader size={20} /> : <RxReload size={20} />}
        </Button>
      </HStack>
    </HStack>
  );
};

export default TokenRow;
