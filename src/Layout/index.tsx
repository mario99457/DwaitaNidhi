import { ReactNode } from "react";
import { Box } from "@mui/material";
import TopBar from "../Components/TopBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        gap: 3,
        overflowY: "hidden",
        height: "100vh",
        // height: {
        //   xs: "calc(100vh - 40px)",
        //   lg: "100vh",
        // },
      }}
    >
      <TopBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        height="calc(100% - 130px)"
      >
        <Box
          sx={{
            width: "100%",
            overflowY: "auto",
            height: "100%",
          }}
          className="layout-content"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
