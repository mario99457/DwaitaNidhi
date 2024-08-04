import { Box } from "@mui/material";
import React from "react";
import "./HomePageCard.scss";

interface HomePageCardProps {
  image: string;
  quote: string;
  author: string;
  style: React.CSSProperties;
}

const HomePageCard = ({ image, quote, author, style }: HomePageCardProps) => {
  return (
    <Box
      sx={{
        borderRadius: "9px",
        marginTop: "22px",
        width: "713px",
        display: "flex",
        height: "17%",
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

export default HomePageCard;
