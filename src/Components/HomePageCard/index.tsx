import { Box } from "@mui/material";
import React from "react";
import "./HomePageCard.scss";

interface HomePageCardProps {
  image: string;
  quote: string;
  author: string;
  style?: React.CSSProperties;
}

const HomePageCard = ({ image, quote, author, style }: HomePageCardProps) => {
  return (
    <Box
      sx={{
        borderRadius: "9px",
        width: "100%",
        display: "block",
        height: "87%",
        // ...style,
      }}
      className="card-wrapper"
    >
      <div className="card-image">
        <img src={image} />
      </div>
      <Box
        className="card-content"
        sx={{ background: style?.background, opacity: 0.7 }}
      >
        <div className="card-quote">{quote}</div>
        <div className="card-author">{author}</div>
      </Box>
    </Box>
  );
};

export default HomePageCard;
