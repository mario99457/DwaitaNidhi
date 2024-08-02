import { Box } from "@mui/material";
import React from "react";
import landingCard from "../../assets/landing_page.png";

const Landing = () => {
  return (
    <Box sx={{ textAlign: "center", padding: "16px" }}>
      <img src={landingCard} />
    </Box>
  );
};

export default Landing;
