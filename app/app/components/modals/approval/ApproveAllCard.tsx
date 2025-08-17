"use client";

import {
  Box,
  Button,
  Flex,
  VStack,
  Text,
  Progress,
  HStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { COLORS } from "@/constants/theme";
import { useBatchApproveAll } from "@/hooks/approvals/useBatchApproveAll";
import { Token } from "@/lib/components/types";
import { FiZap } from "react-icons/fi";

interface ApproveAllCardProps {
  tokens: Token[];
}

export default function ApproveAllCard({ tokens }: ApproveAllCardProps) {
  const { approveAllTokens, isLoading, progress, isSuccess } = useBatchApproveAll(tokens);

  const tokensWithBalance = tokens.filter(token => token.userBalance > 0);
  const totalValue = tokensWithBalance.reduce((sum, token) => sum + (token.userBalance * (token.price || 0)), 0);

  return (
    <Box
      p={6}
      bg="gray.700"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.600"
      mb={6}
    >
      <Flex justify="space-between" align="start" mb={4}>
        <VStack align="start" spacing={2}>
          <HStack>
            <Icon as={FiZap} color="yellow.400" boxSize={5} />
            <Text fontSize="18px" fontWeight="700" color="white">
              Approve All Tokens
            </Text>
          </HStack>
                           <Text fontSize="14px" color="gray.300">
                   Approve all {tokensWithBalance.length} tokens using full EIP-7702 implementation with smart contract
                 </Text>
          <HStack spacing={4}>
            <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
              {tokensWithBalance.length} tokens
            </Badge>
            {totalValue > 0 && (
              <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                ${totalValue.toFixed(2)} total value
              </Badge>
            )}
          </HStack>
        </VStack>

        <Button
          size="lg"
          bg={COLORS.btnGradient}
          color="white"
          _hover={{ bg: COLORS.btnGradient, opacity: 0.9 }}
          _active={{ bg: COLORS.btnGradient, opacity: 0.8 }}
          isLoading={isLoading}
          loadingText="Approving..."
          onClick={approveAllTokens}
          isDisabled={tokensWithBalance.length === 0 || isSuccess}
          px={8}
          py={3}
          borderRadius="12px"
          fontWeight="600"
        >
          {isSuccess ? "Approved!" : "Approve All"}
        </Button>
      </Flex>

      {isLoading && (
        <Box mt={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontSize="12px" color="gray.400">
              Processing batch approval...
            </Text>
            <Text fontSize="12px" color="gray.400">
              {progress}%
            </Text>
          </Flex>
          <Progress
            value={progress}
            size="sm"
            colorScheme="blue"
            borderRadius="full"
            bg="gray.600"
          />
        </Box>
      )}

      {isSuccess && (
        <Box mt={4} p={3} bg="green.900" borderRadius="8px" border="1px solid" borderColor="green.600">
          <Text fontSize="14px" color="green.300" textAlign="center">
            ✅ All tokens have been successfully approved!
          </Text>
        </Box>
      )}
    </Box>
  );
}
