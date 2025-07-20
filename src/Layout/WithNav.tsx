import {
  Box,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../Components/TopBar";
import TopBarSmall from "../Components/TopBar/TopBarMobile";
import NavigationMenu from "../Components/NavigationMenu";
import NavigationMenuSmall from "../Components/NavigationMenu/NavigationMenuSmall";
import { AppDataProvider, useAppData } from "../Store/AppContext";
import CachedData, { Prefetch } from "../Services/Common/GlobalServices";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutWithNav = ({ children }: LayoutProps) => {
  const [progress, setProgress] = useState(false);
  const [expandNavigationMenu, setExpandNavigationMenu] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const { dispatch } = useAppData();

  const toggleMenu = () => {
    setExpandNavigationMenu(!expandNavigationMenu);
  };

  useEffect(() => {
    if(!progress){
      const fetchData = async () => {
        setProgress(true);
        try {
          // Only load books.json initially - much faster startup
          await Prefetch.loadInitialData(() => {
            console.log("Initial books.json loaded. App ready for navigation.");
            console.log("Available books:", CachedData.data.books);
            setProgress(false);
          });
        } catch (error) {
          console.error("Error loading initial data:", error);
          setProgress(false);
        }
      };
      fetchData();
    }  
  }, []);

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
        {!progress ? (
          <>
            {isMobile ? (
              <NavigationMenuSmall
                expandNavigationMenu={expandNavigationMenu}
                toggleMenu={toggleMenu}
              />
            ) : (
              <NavigationMenu expandNavigationMenu={expandNavigationMenu} />
            )}
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
          </>
        ) : (
          <Box
            sx={{
              width: "80%",
              position: "absolute",
              top: "50%",
              left: "10%",
            }}
            className="custom-progress-bar"
          >
            <LinearProgress sx={{ backgroundColor: "#600000" }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LayoutWithNav;
