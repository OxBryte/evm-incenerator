"use client";

import React from "react";
import ContainerWrapper from "@/components/ContainerWrapper";
import { VStack, Text, Box, Grid, Flex, Icon } from "@chakra-ui/react";
import SweepWidget from "./components/sweep-widget";
import { motion } from "framer-motion";
import { FiZap, FiTrendingUp, FiShield } from "react-icons/fi";
import { RiSparkling2Fill } from "react-icons/ri";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionFlex = motion(Flex);

const Sweep: React.FC = () => {
  const features = [
    {
      icon: RiSparkling2Fill,
      title: "Clean Portfolio",
      description: "Remove dust tokens in one sweep",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Single transaction for all tokens",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: FiTrendingUp,
      title: "Maximize Value",
      description: "Best rates through DEX aggregation",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: FiShield,
      title: "Secure & Safe",
      description: "Audited smart contracts",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  return (
    <ContainerWrapper>
      <VStack
        pt={{ base: "5rem", md: "6rem" }}
        pb={{ base: "3rem", md: "5rem" }}
        width="100%"
        minH="calc(100vh - 100px)"
        justifyContent="center"
        alignItems="center"
        gap={{ base: "2.5rem", md: "4rem" }}
        position="relative"
        overflow="hidden"
      >
        {/* Animated Background Gradient Orbs */}
        <MotionBox
          position="absolute"
          top="-20%"
          left="-10%"
          width="500px"
          height="500px"
          borderRadius="full"
          bgGradient="radial(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)"
          filter="blur(60px)"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <MotionBox
          position="absolute"
          bottom="-20%"
          right="-10%"
          width="600px"
          height="600px"
          borderRadius="full"
          bgGradient="radial(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)"
          filter="blur(60px)"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Hero Section */}
        <MotionVStack
          maxW={{ base: "90%", md: "700px" }}
          textAlign="center"
          gap="2rem"
          px="1rem"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          position="relative"
          zIndex={1}
        >
          {/* Badge */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Flex
              align="center"
              gap="8px"
              px="16px"
              py="8px"
              borderRadius="full"
              bg="rgba(102, 126, 234, 0.1)"
              border="1px solid"
              borderColor="rgba(102, 126, 234, 0.3)"
              backdropFilter="blur(10px)"
              display="inline-flex"
            >
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                bg="rgba(102, 126, 234, 1)"
                animation="pulse 2s infinite"
              />
              <Text fontSize="sm" fontWeight="600" className="text-white/90">
                Convert Dust to ETH
              </Text>
            </Flex>
          </MotionBox>

          {/* Main Heading */}
          <VStack gap="1rem">
            <Text
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="700"
              className="text-white"
              lineHeight="1.1"
              letterSpacing="-0.02em"
              bgGradient="linear(to-r, white, gray.400)"
              bgClip="text"
            >
              Sweep Your Tokens
              <br />
              <Box
                as="span"
                bgGradient="linear(to-r, #667eea, #764ba2, #f093fb)"
                bgClip="text"
              >
                In One Click
              </Box>
            </Text>

            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              className="text-white/60"
              lineHeight="1.7"
              maxW="600px"
              fontWeight="400"
            >
              Aggregate low-value tokens scattered across your wallet and
              convert them to ETH. Save on gas fees and maximize your
              portfolio's potential.
            </Text>
          </VStack>

          {/* Stats */}
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap="1.5rem"
            width="100%"
            maxW="500px"
            mt="1rem"
          >
            {[
              { value: "100+", label: "Tokens Supported" },
              { value: "< 5s", label: "Transaction Time" },
              { value: "0%", label: "Platform Fee" },
            ].map((stat, index) => (
              <MotionBox
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                <VStack
                  spacing="4px"
                  p="1rem"
                  borderRadius="12px"
                  bg="rgba(255, 255, 255, 0.03)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(10px)"
                  transition="all 0.3s"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(102, 126, 234, 0.5)",
                    transform: "translateY(-2px)",
                  }}
                >
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    className="text-white"
                  >
                    {stat.value}
                  </Text>
                  <Text
                    fontSize="xs"
                    className="text-white/50"
                    fontWeight="500"
                  >
                    {stat.label}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </Grid>
        </MotionVStack>

        {/* Sweep Widget - Main Focus */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          width="100%"
          display="flex"
          justifyContent="center"
          position="relative"
          zIndex={2}
        >
          <SweepWidget />
        </MotionBox>

        {/* Feature Cards */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          width="100%"
          maxW="1200px"
          px="1rem"
          position="relative"
          zIndex={1}
        >
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap="1.5rem"
            width="100%"
          >
            {features.map((feature, index) => (
              <MotionFlex
                key={feature.title}
                direction="column"
                p="1.5rem"
                borderRadius="16px"
                bg="rgba(255, 255, 255, 0.03)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(20px)"
                position="relative"
                overflow="hidden"
                cursor="pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -5,
                  borderColor: "rgba(102, 126, 234, 0.5)",
                }}
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  bgGradient: feature.gradient,
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
                _hover={{
                  _before: {
                    opacity: 1,
                  },
                }}
              >
                <Flex
                  width="48px"
                  height="48px"
                  borderRadius="12px"
                  bg="rgba(255, 255, 255, 0.05)"
                  align="center"
                  justify="center"
                  mb="1rem"
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    bgGradient: feature.gradient,
                    opacity: 0.1,
                  }}
                >
                  <Icon as={feature.icon} fontSize="24px" color="white" />
                </Flex>

                <Text
                  fontSize="md"
                  fontWeight="600"
                  className="text-white"
                  mb="0.5rem"
                >
                  {feature.title}
                </Text>

                <Text fontSize="sm" className="text-white/50" lineHeight="1.6">
                  {feature.description}
                </Text>
              </MotionFlex>
            ))}
          </Grid>
        </MotionBox>

        {/* Add pulse animation keyframe */}
        <style jsx global>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </VStack>
    </ContainerWrapper>
  );
};

export default Sweep;
