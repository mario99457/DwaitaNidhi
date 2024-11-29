import { ReactNode, useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TopBar from "../Components/TopBar";
import TopBarSmall from "../Components/TopBar/TopBarMobile";
import CachedData, { Prefetch } from "../Services/Common/GlobalServices";
import NavigationMenu from "../Components/NavigationMenu";
import NavigationMenuSmall from "../Components/NavigationMenu/NavigationMenuSmall";
import { useLocation } from "react-router-dom";
import { useAppData } from "../Store/AppContext";
import { Outlet } from "react-router";

interface LayoutProps {
  children: ReactNode;
}

const LayoutWithNav = ({ children }: LayoutProps) => {
  const [progress, setProgress] = useState(true);
  const [expandNavigationMenu, setExpandNavigationMenu] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const { dispatch } = useAppData();

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
      "prameyadipika",
      "audio"
    ];
    Prefetch.prefetchRequiredServerData(requiredData, () => {});
    // let bookName = "";
    const path = location.pathname;
    // if (path && path.split("/").length > 1) {
    //   bookName = path.split("/")[1];
    // }

    const timer = setInterval(() => {
      if (Object.keys(CachedData.data).length == requiredData.length) {
        setProgress(false);
        clearInterval(timer);
        if (path && path.split("/").length > 1) {
          const book = path.split("/")[1];
          if (
            book &&
            CachedData?.data?.books &&
            CachedData?.data.books.find((item: any) => item.name === book)
          ) {
            dispatch({
              type: "setSelectedBook",
              book: CachedData?.data.books.find(
                (item: any) => item.name === book
              ),
            });
          }
        }
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
