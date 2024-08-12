import { ReactNode, useState, useEffect } from "react";
import { Box } from "@mui/material";
import TopBar from "../Components/TopBar";
import LinearProgress from "@mui/material/LinearProgress";
import CachedData, {
  Prefetch,
  Sutraani,
} from "../Services/Common/GlobalServices";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [progress, setProgress] = useState(0);

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
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

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
        {progress == 100 ? (
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
              width: "90%",
              height: "100%",
              position: "absolute",
              top: "50%",
              left: "5%",
            }}
          >
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Layout;
