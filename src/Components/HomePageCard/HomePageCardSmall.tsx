import { Box } from "@mui/material";
import React from "react";
import "./HomePageCard.scss";

interface HomePageCardProps {
  image: string;
  quote: string;
  author: string;
  style: React.CSSProperties;
}

const HomePageCardSmall = ({
  image,
  quote,
  author,
  style,
}: HomePageCardProps) => {
  return (
    <Box
      sx={{
        borderRadius: "9px",
        width: "auto",
        display: "block",
        // height: "50%",
        ...style,
      }}
      className="card-wrapper"
    >
      <div className="card-image">
        <img src={image} />
      </div>
      <Box className="card-content-wrapper-mobile" sx={{ ...style }}>
        <div className="card-content">
          <div className="card-quote">{quote}</div>
          <div className="card-author">{author}</div>
        </div>
      </Box>
    </Box>
  );
};

export default HomePageCardSmall;
