"use client";
import {
  Checkbox,
  HStack,
  Text,
  VStack,
  WrapItem,
  Avatar,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import FormatNumber from "../FormatNumber";
import { TokenListProvider } from "@/provider/tokenListProvider";
import { MoralisAssetClass } from "@/utils/classes";

function TokenSelectListRow({ token }: { token: MoralisAssetClass }) {
  const { logoURI, name, symbol, quoteUSD, userBalance } = token;

  const { isTokenSelected, addTokenList, removeTokenList } =
    useContext(TokenListProvider);

  return (
    <HStack
      justifyContent="space-between"
      width="100%"
      whiteSpace="nowrap"
      cursor="pointer"
      className={`${isTokenSelected(token) ? "bg-white/10" : ""} hover:bg-white/20 transition-colors duration-300 px-4 py-2`}
      onClick={
        isTokenSelected(token)
          ? (e) => {
              e.preventDefault();
              removeTokenList(token);
            }
          : (e) => {
              e.preventDefault();
              addTokenList(token);
            }
      }
    >
      <Checkbox
        isChecked={isTokenSelected(token)}
        colorScheme="white"
        iconColor={"#fff"}
      >
        <HStack alignItems="center">
          <WrapItem>
            <Avatar size="sm" name={name} src={logoURI} />
          </WrapItem>
          <VStack gap="0" alignItems="start">
            <Text className="text-white" fontWeight="700">
              {symbol.length > 6 ? `${symbol.substring(0, 5)}...` : symbol}
            </Text>
            <Text className="text-white/50" fontSize="13px" fontWeight={500}>
              {name}
            </Text>
          </VStack>
        </HStack>
      </Checkbox>

      {/* bALANCE AND price panels*/}

      <VStack alignItems="end" gap="0">
        <Text fontWeight="700">
          <FormatNumber
            suf={symbol.length > 4 ? `${symbol.substring(0, 3)}...` : symbol}
            amount={userBalance}
          />
        </Text>
        <Text color="#A8BBD6" fontSize="smaller">
          ~ <FormatNumber pre="$" amount={quoteUSD} />
        </Text>
      </VStack>
    </HStack>
  );
}

export default TokenSelectListRow;
