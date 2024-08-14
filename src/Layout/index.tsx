import { ReactNode, useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import TopBar from "../Components/TopBar";
import CachedData, {
  Prefetch,
  Sutraani,
} from "../Services/Common/GlobalServices";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [progress, setProgress] = useState(true);

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
      <TopBar progress={progress} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#e8e8e8",
        }}
        height="calc(100% - 130px)"
        className="layout-content"
      >
        {!progress ? (
          <Box
            sx={{
              width: "100%",
              overflowY: "auto",
              height: "100%",
            }}
          >
            {children}
          </Box>
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
