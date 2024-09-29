import { ReactNode, useState, useEffect } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import TopBar from "../Components/TopBar";
import TopBarSmall from "../Components/TopBar/TopBarMobile";
import { Outlet } from 'react-router';

const LayoutWithoutNav = () => {
  const [progress, setProgress] = useState(true);
  const [expandNavigationMenu, setExpandNavigationMenu] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleMenu = () => {
    setExpandNavigationMenu(!expandNavigationMenu);
  };
 
  return (
    <Box
      sx={{
        gap: 3,
        overflowY: "hidden",
        height: "100vh",
      }}
    >
      {isMobile ? (
        <TopBarSmall
          toggleMenu={toggleMenu}
          expandNavigationMenu={expandNavigationMenu}
          progress={progress}
        />
      ) : (
        <TopBar
          toggleMenu={toggleMenu}
          expandNavigationMenu={expandNavigationMenu}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        height="calc(100% - 55px)"
        className={`layout-content ${isMobile ? "layout-content-mobile" : ""}`}
      >        
       <Box
              sx={{
                width: "100%",
                overflowY: "auto",
                height: "100%",
                overflowX: {
                  xs: "hidden",
                },
              }}
            >
              <Outlet />
            </Box>
      </Box>
    </Box>
  );
};

export default LayoutWithoutNav;