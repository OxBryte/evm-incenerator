import { Spinner, Flex, Text } from "@chakra-ui/react";
import { useEthPrice } from "@/hooks/useGetETHPrice2";
import { ETH_ADDRESS } from "@/utils";
import { Token } from "@/lib/components/types";
import FormatNumber from "@/components/FormatNumber";

export function ETHToReceive({ selectedTokens }: { selectedTokens: Token[] }) {
  const { ethPrice, isLoading } = useEthPrice({
    address: ETH_ADDRESS,
  });

  const quoteAllTokens = selectedTokens.reduce(
    (total, selectedToken) => total + selectedToken?.quoteUSD,
    0,
  );

  return (
    <Flex fontSize="14px">
      {isLoading ? (
        <Flex alignItems="center" gap="2">
          <Spinner size="sm" color="#9E829F" thickness="2px" speed="0.8s" />
          <Text fontSize="14px" className="text-white/50">
            Loading...
          </Text>
        </Flex>
      ) : ethPrice === 0 ? (
        "__"
      ) : (
        <div className="flex items-center gap-2">
          <FormatNumber amount={quoteAllTokens / ethPrice} suf="ETH" />/
          <Text fontSize="14px" className="text-white/50">
            ${quoteAllTokens.toFixed(2)}
          </Text>
        </div>
      )}
    </Flex>
  );
}
