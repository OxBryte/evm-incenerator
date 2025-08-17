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
  // const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   const lastVisit = localStorage.getItem("lastVisit");
  //   const weeksToShowModal = 2;

  //   if (!lastVisit) {
  //     localStorage.setItem("lastVisit", new Date().toISOString());
  //     setModalOpen(true); //**Show the modal for the first visit
  //   } else {
  //     if (checkDateRange(lastVisit, weeksToShowModal)) {
  //       setModalOpen(true); //**Show the modal if returning after the specified weeks
  //     }
  //   }
  //   //**Updating the last visit date
  //   localStorage.setItem("lastVisit", new Date().toISOString());
  // }, []);

  // const closeModal = () => {
  //   setModalOpen(false);
  // };

  return (
    <StateContextProvider>
      <Flex
        as="div"
        direction="column"
        minH="100vh"
        // bgImage={["/image/Perspective-Background-lines.png"]}
        // bgSize={"cover"}
        // bgPos={["inherit"]}
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
