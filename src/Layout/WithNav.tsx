import { ReactNode, useState, useEffect } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import TopBar from "../Components/TopBar";
import TopBarSmall from "../Components/TopBar/TopBarMobile";
import CachedData, { Prefetch } from "../Services/Common/GlobalServices";
import NavigationMenu from "../Components/NavigationMenu";
import NavigationMenuSmall from "../Components/NavigationMenu/NavigationMenuSmall";
import { Outlet } from 'react-router';

interface LayoutProps {
  children: ReactNode;
}

const LayoutWithNav = ({ children }: LayoutProps) => {
  const [progress, setProgress] = useState(true);
  const [expandNavigationMenu, setExpandNavigationMenu] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleMenu = () => {
    setExpandNavigationMenu(!expandNavigationMenu);
  };

  useEffect(() => {
    const requiredData = [
      "sutraani",
      "bhashyam",
      "sutradipika",
      "books",
      "sutraaniSummary",    
      "gitaIndex",
      "gbhashyam",
      "gitaSummary",
      "prameyadipika"
    ];
    Prefetch.prefetchRequiredServerData(requiredData, () => {});

    const timer = setInterval(() => {
      if (CachedData?.data?.books) {
        console.log(CachedData.data);
        setProgress(false);
        clearInterval(timer);
      }
    }, 200);

    return () => {
      clearInterval(timer);
    };
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
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LayoutWithNav;
