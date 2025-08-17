"use client";

import { COLORS } from "@/constants/theme";
import {
  Button,
  useDisclosure,
  Box,
  Text,
  VStack,
  Flex,
  IconButton,
  Avatar,
  SimpleGrid,
  useBreakpointValue,
  Badge,
  Divider,
} from "@chakra-ui/react";
import TokenRow from "./TokenRow";
import ApproveAllCard from "./ApproveAllCard";
import { IoMdClose } from "react-icons/io";
import ModalComponent from "@/components/ModalComponent/TabViewModal";
import useSelectToken from "@/hooks/useSelectToken";
import { useState } from "react";
import { Token } from "@/lib/components/types";

function ApprovalModal({
  tokensAllowanceStatus,
  refetch,
}: {
  tokensAllowanceStatus: boolean;
  refetch: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tokenList: selectedTokens } = useSelectToken();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Responsive grid columns
  const gridColumns = useBreakpointValue({ base: 2, md: 3, lg: 4 });
  const maxHeight = useBreakpointValue({ base: "50vh", md: "60vh" });

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setViewMode('list');
  };

  const handleBackToGrid = () => {
    setSelectedToken(null);
    setViewMode('grid');
  };

  // Removed handleApproveAllSuccess as it's no longer needed

  return (
    <>
      <Button
        isDisabled={tokensAllowanceStatus}
        borderRadius="8px"
        width="100%"
        color="#FDFDFD"
        fontSize="16px"
        fontWeight={400}
        bg={
          tokensAllowanceStatus
            ? `${COLORS.inputBgcolor}`
            : `${COLORS.btnGradient}`
        }
        _hover={{
          bg: tokensAllowanceStatus
            ? `${COLORS.inputBgcolor}`
            : `${COLORS.btnGradient}`,
        }}
        onClick={() => onOpen()}
      >
        Approval
      </Button>

      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        modalContentStyle={{ py: "24px", px: "32px" }}
      >
        {/* Header */}
        <Flex justify="space-between" alignItems="center" mb={6}>
          <VStack align="start" spacing={1}>
            <Text fontWeight={700} fontSize="24px" color="white">
              {viewMode === 'grid' ? 'Approve Tokens' : 'Approve Token'}
            </Text>
            <Text fontSize="14px" color="gray.400">
              {viewMode === 'grid' 
                ? `Manage approvals for ${selectedTokens.length} tokens` 
                : 'Review and approve individual token'
              }
            </Text>
          </VStack>

          <IconButton
            aria-label="close-btn"
            icon={<IoMdClose size="24px" color="white" />}
            onClick={onClose}
            bg="gray.700"
            color="white"
            _hover={{
              bg: "gray.600",
            }}
            borderRadius="12px"
          />
        </Flex>

        {viewMode === 'grid' ? (
          // Grid View - Compact token selection with Approve All
          <VStack spacing={6} align="stretch">
            {/* Approve All Section */}
            <ApproveAllCard 
              tokens={selectedTokens} 
            />

            {/* Token Grid */}
            <Box>
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="16px" fontWeight="600" color="white">
                  Individual Tokens
                </Text>
                <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                  {selectedTokens.length} tokens
                </Badge>
              </Flex>
              
              <Box maxH={maxHeight} overflowY="auto">
                <SimpleGrid columns={gridColumns} spacing={4}>
                  {selectedTokens.map((token) => (
                    <Box
                      key={token.address}
                      p={4}
                      bg="gray.700"
                      border="1px solid"
                      borderColor="gray.600"
                      borderRadius="16px"
                      cursor="pointer"
                      _hover={{
                        borderColor: COLORS.btnGradient,
                        transform: "translateY(-2px)",
                        transition: "all 0.2s",
                        bg: "gray.650",
                      }}
                      onClick={() => handleTokenSelect(token)}
                    >
                      <VStack spacing={3}>
                        <Avatar size="md" name={token.name} src={token.logoURI} />
                        <VStack spacing={1}>
                          <Text fontSize="14px" fontWeight="600" textAlign="center" color="white">
                            {token.symbol.length > 10 ? `${token.symbol.substring(0, 8)}...` : token.symbol}
                          </Text>
                          <Text fontSize="12px" color="gray.400" textAlign="center" noOfLines={2}>
                            {token.name.length > 20 ? `${token.name.substring(0, 18)}...` : token.name}
                          </Text>
                        </VStack>
                        <Badge 
                          size="sm" 
                          colorScheme={token.userBalance > 0 ? "green" : "gray"}
                          variant="subtle"
                          fontSize="11px"
                          px={2}
                          py={1}
                        >
                          {token.userBalance > 0 ? 'Has Balance' : 'No Balance'}
                        </Badge>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </Box>
          </VStack>
        ) : (
          // List View - Detailed token approval
          <Box maxH={maxHeight} overflowY="auto">
            {selectedToken && (
              <>
                <Flex justify="space-between" alignItems="center" mb={4}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleBackToGrid}
                    leftIcon={<IoMdClose size="16px" />}
                    color="white"
                    _hover={{ bg: "gray.700" }}
                  >
                    Back to Grid
                  </Button>
                </Flex>
                <Divider mb={4} borderColor="gray.600" />
                <TokenRow token={selectedToken} refetch={refetch} onClose={onClose} />
              </>
            )}
          </Box>
        )}
      </ModalComponent>
    </>
  );
}

export default ApprovalModal;
