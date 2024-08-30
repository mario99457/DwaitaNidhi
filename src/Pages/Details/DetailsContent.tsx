import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import playButton from "../../assets/PlayButton.svg";
import bookmark from "../../assets/bookmark.svg";
// import details from "./details.json";
import { Sutraani } from "../../Services/Common/GlobalServices";
import { Title } from "../../types/GlobalType.type";
import Parser from "html-react-parser";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

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
}

const DetailsContent = ({
  selectedCommentary,
  style,
  selectedTitle,
  defaultExpanded,
}: DetailsContentProps) => {
  const [commentaries, setCommentaries] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(defaultExpanded || false);

  useEffect(() => {
    setCommentaries(Sutraani.getCommentaries(selectedTitle));
  }, [selectedTitle]);

  useEffect(() => {
    console.log("inside commentaroes method", commentaries);
  }, [commentaries]);

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
        <div className="d-flex align-items-end">
          <Typography
            color="#A74600"
            fontFamily={"Vesper Libre"}
            lineHeight="45.58px"
            fontSize="26px"
            minWidth="90px"
          >
            {selectedCommentary.name}
          </Typography>
          <Typography
            color="#616161"
            fontSize="16px"
            fontFamily={"Vesper Libre"}
            lineHeight="21.2px"
            marginLeft={5}
            marginBottom={1}
          >
            {selectedCommentary.author}
          </Typography>
        </div>
        <div className="d-flex align-items-center">
          <img src={playButton} alt="play" />
          {/* <img src={bookmark} alt="bookmark" style={{ marginLeft: "3rem" }} /> */}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: "#616161", marginLeft: "26px" }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
      </Stack>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Typography
          fontFamily="Vesper Libre"
          fontSize="18px"
          lineHeight="33px"
          marginTop="27px"
          whiteSpace="pre-line"
        >
          {Parser(
            commentaries.find((data) => data.key == selectedCommentary.key)
              ?.text || ""
          )}
        </Typography>
      </Collapse>
    </Box>
  );
};

export default DetailsContent;
