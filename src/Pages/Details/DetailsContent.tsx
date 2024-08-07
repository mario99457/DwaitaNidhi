import { Box } from "@mui/material";
import React from "react";

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
      {selectedCommentary.name}
    </Box>
  );
};

export default DetailsContent;
