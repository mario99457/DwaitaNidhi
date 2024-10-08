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
        width: {
          xs: "90vw",
          lg: "768px",
        },
        display: "block",
        height: "auto",
        ...style,
      }}
      className="card-wrapper"
    >
      <div className="card-image">
        <img src={image} />
      </div>
      <div className="card-content">
        <div className="card-quote">{quote}</div>
        <div className="card-author">{author}</div>
      </div>
    </Box>
  );
};

export default HomePageCardSmall;
