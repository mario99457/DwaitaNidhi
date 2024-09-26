import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import playButton from "../../assets/PlayButton.svg";
import playButton2 from "../../assets/Play_no_track.svg";
// import bookmark from "../../assets/bookmark.svg";
// import details from "./details.json";
import CachedData from "../../Services/Common/GlobalServices";
import { Title } from "../../types/GlobalType.type";
import Parser from "html-react-parser";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useAppData } from "../../Store/AppContext";

interface DetailsContentProps {
  selectedCommentary: {
    name: string;
    author: string;
    key: string;
  };
  selectedTitle: Title;
  style?: React.CSSProperties;
  key: string;
  defaultExpanded?: boolean | { expanded: boolean };
  isMobile: boolean;
  setShowPlayer: () => void;
}

const DetailsContent = ({
  selectedCommentary,
  style,
  selectedTitle,
  defaultExpanded,
  isMobile,
  setShowPlayer,
}: DetailsContentProps) => {
  const [commentaries, setCommentaries] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(defaultExpanded || false);
  const { state } = useAppData();

  useEffect(() => {
    setCommentaries(
      CachedData.getBookClass(state.selectedBook?.name)?.getCommentaries(
        selectedTitle
      )
    );
  }, [selectedTitle]);

  useEffect(() => {
    if (defaultExpanded && typeof defaultExpanded === "object") {
      setExpanded(defaultExpanded.expanded);
    } else setExpanded(defaultExpanded || false);
  }, [defaultExpanded]);

  return (
    <Box
      sx={{
        borderRadius: "8px",
        marginTop: "16px",
        background: "#f4f4f4",
        padding: "20px 28px",
        minHeight: "100px",
        ...style,
      }}
      id={selectedCommentary.key}
    >
      <Stack
        className="detail-header"
        direction="row"
        justifyContent="space-between"
      >
        <div
          className={`d-flex detail-meta ${
            isMobile ? "align-items-start" : "align-items-end"
          }`}
        >
          <Typography
            color="#A74600"
            lineHeight="45.58px"
            fontSize="30px"
            minWidth="90px"
          >
            {selectedCommentary.name}
          </Typography>
          <Typography
            color="#616161"
            fontSize="20px"
            lineHeight="21.2px"
            marginLeft={{ lg: 5 }}
            marginBottom={1}
          >
            {selectedCommentary.author}
          </Typography>
        </div>
        <div
          className={`d-flex ${
            isMobile ? "align-items-baseline" : "align-items-center"
          }`}
        >
          <img
            src={isMobile ? playButton2 : playButton}
            style={{ cursor: "pointer" }}
            alt="play"
            onClick={() => setShowPlayer()}
          />
          {/* <img src={bookmark} alt="bookmark" style={{ marginLeft: "3rem" }} /> */}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: "#616161", marginLeft: "26px" }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
      </Stack>
      <Collapse in={Boolean(expanded)}>
        <Typography
          fontSize="22px"
          lineHeight="33px"
          marginTop="27px"
          whiteSpace="pre-line"
        >
          {Parser(
            commentaries?.find((data) => data.key == selectedCommentary.key)
              ?.text || ""
          )}
        </Typography>
      </Collapse>
    </Box>
  );
};

export default DetailsContent;
