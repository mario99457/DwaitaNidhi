import { ReactNode, useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import TopBar from "../Components/TopBar";
import CachedData, { Prefetch } from "../Services/Common/GlobalServices";
import NavigationMenu from "../Components/NavigationMenu";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [progress, setProgress] = useState(true);
  const [expandNavigationMenu, setExpandNavigationMenu] = useState(false);

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
    ];
    Prefetch.prefetchRequiredServerData(requiredData, (e) => {});

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
        // height: {
        //   xs: "calc(100vh - 40px)",
        //   lg: "100vh",
        // },
      }}
    >
      <TopBar
        toggleMenu={toggleMenu}
        expandNavigationMenu={expandNavigationMenu}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        height="calc(100% - 55px)"
        className="layout-content"
      >
        {!progress ? (
          <>
            <NavigationMenu expandNavigationMenu={expandNavigationMenu} />
            <Box
              sx={{
                width: "100%",
                overflowY: "auto",
                height: "100%",
              }}
            >
              {children}
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

export default Layout;
