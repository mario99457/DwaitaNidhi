import { Box, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

const TitlePage = () => {
  const { bookName } = useParams();
  const bookToValueMap = {
    menu1: "ब्रह्मसूत्राणि",
    menu2: " भगवद्गीता",
    menu3: "रामायणम्",
  };

  return (
    <Box
      sx={{
        width: "80%",
        background: "#FFFFFF",
        margin: "auto",
        height: "100%",
        padding: "16px 32px",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Poppins",
          fontSize: "26px",
          color: "#A74600",
          fontWeight: "600",
        }}
      >
        {bookToValueMap[bookName]}
      </Typography>
    </Box>
  );
};

export default TitlePage;
