import React from "react";
import { Box, Typography } from "@mui/material";

const ComingSoon: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h3" component="div" gutterBottom>
        Coming Soon
      </Typography>
      <Typography variant="body1" component="div">
        This page is under construction. Please check back later.
      </Typography>
    </Box>
  );
};

export default ComingSoon;
