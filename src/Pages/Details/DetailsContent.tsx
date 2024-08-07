import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import playButton from "../../assets/PlayButton.svg";
import bookmark from "../../assets/bookmark.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import details from "./details.json";

interface DetailsContentProps {
  selectedCommentary: {
    name: string;
    author: string;
    data: string;
  };
  style?: React.CSSProperties;
}

const DetailsContent = ({ selectedCommentary, style }: DetailsContentProps) => {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        marginTop: "16px",
        background: "#f4f4f4",
        padding: "20px 28px",
        minHeight: "300px",
        ...style,
      }}
    >
      <Stack
        className="detail-header"
        direction="row"
        justifyContent="space-between"
      >
        <div className="d-flex align-items-end">
          <Typography
            color="#A74600"
            fontFamily={"Tiro Devanagari Hindi"}
            lineHeight="45.58px"
            fontSize="26px"
            minWidth="90px"
          >
            {selectedCommentary.name}
          </Typography>
          <Typography
            color="#616161"
            fontSize="16px"
            fontFamily={"Tiro Devanagari Hindi"}
            lineHeight="21.2px"
            marginLeft={5}
            marginBottom={1}
          >
            {selectedCommentary.author}
          </Typography>
        </div>
        <div className="d-flex align-items-center">
          <img src={playButton} alt="play" />
          <img src={bookmark} alt="bookmark" style={{ marginLeft: "3rem" }} />
          <KeyboardArrowDownIcon
            sx={{ color: "#616161", marginLeft: "26px" }}
          />
        </div>
      </Stack>
      <Typography
        fontFamily="Tiro Devanagari Hindi"
        fontSize="18px"
        lineHeight="23.94px"
        marginTop="27px"
      >
        {details.data}
      </Typography>
    </Box>
  );
};

export default DetailsContent;
