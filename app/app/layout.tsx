"use client";

import "../chakra.css";
import { ReactNode } from "react";
import AppNavbar from "@/components/AppLayout/Navbar";
import { Flex, Box } from "@chakra-ui/react";
import { StateContextProvider } from "@/provider/AppProvider";
// import DialogModal from "@/components/DialogModal";
// import { checkDateRange } from "@/utils/checkDateRange";

interface MainAppLayoutProps {
  children: ReactNode;
}

const MainAppLayout: React.FC<MainAppLayoutProps> = ({ children }) => {


  return (
    <StateContextProvider>
      <Flex
        as="div"
        direction="column"
        minH="100vh"
      >
        <AppNavbar />
        <Box flex="1" className="w-full" overflow="auto">
          {/* <DialogModal isOpen={isModalOpen} onClose={closeModal} /> */}
          {children}
        </Box>
      </Flex>
    </StateContextProvider>
  );
};

export default MainAppLayout;
