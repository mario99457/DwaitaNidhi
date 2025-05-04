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
        // Prefetching data from local storage or server
        await Prefetch.prefetchBooksAndDependencies(() => {
          console.log("All files have been downloaded or fetched from local storage.");
          setProgress(false);
        });
      };
      fetchData();
    }  
  }, []);

  // useEffect(() => {
  //   const requiredData = ["books"];

  //   var keysToPrefetch: string[] = [];
  //   var prefetchEndPoints: { [key: string]: string } = {};
  //   Prefetch.prefetchRequiredServerData(requiredData, () => {});

  //   const path = location.pathname;
  //   // if (path && path.split("/").length > 1) {
  //   //   bookName = path.split("/")[1];
  //   // }

  //   const checkAllTrue = (fetchDone: { [key: string]: boolean }) => {
  //     let result = true;
  //     const keys = Object.keys(fetchDone);

  //     for (var o = 0; o < keys.length; ++o) {
  //       result = result && fetchDone[keys[o]];
  //     }

  //     return result;
  //   };
  //   const timer = setInterval(() => {
  //     if (CachedData.data["books"]) {
  //       //if (checkAllTrue(CachedData.fetchDone)){
  //       // setProgress(false);
  //       // clearInterval(timer);
  //       // }
  //       // else{
  //       if (Object.keys(CachedData.data).length == 1) {
  //         keysToPrefetch = [];
  //         CachedData.data.books.map((book) => {
  //           prefetchEndPoints[book.name + "index"] = book.name + "/index.txt";
  //           prefetchEndPoints[book.name + "summary"] =
  //             book.name + "/summary.txt";

  //           if (book.audio) {
  //             prefetchEndPoints[book.name + "audio"] = book.name + "/audio.txt";
  //             keysToPrefetch.push(book.name + "audio");
  //           }
  //           keysToPrefetch.push(book.name + "index");
  //           keysToPrefetch.push(book.name + "summary");

  //           book?.commentaries?.map((c) => {
  //             prefetchEndPoints[c.key] = c.data;
  //             keysToPrefetch.push(c.key);
  //           });
  //         });

  //         CachedData.fetchDataForKeys(
  //           keysToPrefetch,
  //           () => {},
  //           () => {},
  //           prefetchEndPoints
  //         );
  //       }

  //       const timer1 = setInterval(() => {
  //         if (
  //           Object.keys(CachedData.data).length ==
  //           keysToPrefetch.length + 1
  //         ) {
  //           if (path && path.split("/").length > 1) {
  //             const book = path.split("/")[1];
  //             if (
  //               book &&
  //               CachedData?.data?.books &&
  //               CachedData?.data.books.find((item: any) => item.name === book)
  //             ) {
  //               dispatch({
  //                 type: "setSelectedBook",
  //                 book: CachedData?.data.books.find(
  //                   (item: any) => item.name === book
  //                 ),
  //               });
  //             }
  //           }

  //           setProgress(false);
  //           clearInterval(timer);
  //           clearInterval(timer1);
  //         }
  //       }, 200);
  //     }
  //   }, 200);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

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
