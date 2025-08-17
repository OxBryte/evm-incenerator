"use client";

import React from "react";
import ContainerWrapper from "@/components/ContainerWrapper";
import { VStack, Text, Box, HStack } from "@chakra-ui/react";
import SweepWidget from "./components/sweep-widget";

const Sweep: React.FC = () => {
  return (
    <ContainerWrapper>
      <VStack
        pt={"6rem"}
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        gap="3rem"
      >
        {/* Product Explanation Section */}
        <VStack maxW="600px" textAlign="center" gap="1.5rem" px="1rem">
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="600"
            className="text-white"
            lineHeight="1.2"
          >
            Convert Your Remaining Tokens to ETH
          </Text>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            className="text-white/70"
            lineHeight="1.6"
            maxW="500px"
          >
            Have small amounts of various tokens scattered across your wallet?
            Sweep them all into ETH to cover your gas fees and clean up your
            portfolio.
          </Text>

          {/* Feature Highlights */}
          <HStack gap="2rem" flexWrap="wrap" justify="center" mt="1rem">
            <Box
              px="1.5rem"
              py="1rem"
              borderRadius="12px"
              border="1px solid"
              borderColor="white/10"
              bg="white/5"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" className="text-white/80" fontWeight="500">
                🧹 Clean Portfolio
              </Text>
            </Box>

            <Box
              px="1.5rem"
              py="1rem"
              borderRadius="12px"
              border="1px solid"
              borderColor="white/10"
              bg="white/5"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" className="text-white/80" fontWeight="500">
                ⛽ Gas Fee Coverage
              </Text>
            </Box>

            <Box
              px="1.5rem"
              py="1rem"
              borderRadius="12px"
              border="1px solid"
              borderColor="white/10"
              bg="white/5"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" className="text-white/80" fontWeight="500">
                💰 Maximize Value
              </Text>
            </Box>
          </HStack>
        </VStack>

        {/* Sweep Widget */}
        <SweepWidget />
      </VStack>
    </ContainerWrapper>
  );
};

export default Sweep;
