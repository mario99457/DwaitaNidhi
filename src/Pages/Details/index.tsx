import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ToC_Icon from "../../assets/toc.svg";
import prevButton from "../../assets/prev_button.svg";
import nextButton from "../../assets/next_button.svg";

const DetailPage = () => {
  const { slogaNumber } = useParams();
  const { state } = useLocation();
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={() => {}}>
      <Typography
        key="2"
        color="text.primary"
        fontFamily={"Tiro Devanagari Sanskrit"}
      >
        Home
      </Typography>
    </Link>,
    <Typography key="3" color="#A74600" fontFamily={"Tiro Devanagari Sanskrit"}>
      ब्र.सू. {state?.selectedSloga?.i}
    </Typography>,
  ];

  return (
    <Box
      sx={{
        width: "80%",
        background: "#FFFFFF",
        margin: "auto",
        minHeight: "100%",
        padding: "16px 38px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 0,
          pb: 4,
          borderBottom: "1px solid #BDBDBD",
        }}
      >
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          {breadcrumbs}
        </Breadcrumbs>
        <div
          style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
        >
          <img src={ToC_Icon} width={`18px`} height={`18px`} />
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "Tiro Devanagari Hindi",
              fontSize: "16px",
              fontWeight: "400",
              marginLeft: "10px",
            }}
          >
            सूत्रावलि
          </Typography>
        </div>
      </Box>
      <Box className="title-box-wrapper" sx={{ pt: 2 }}>
        <Box sx={{ display: "flex" }}>
          <img src={prevButton} />
          <Container
            sx={{
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontFamily="Tiro Devanagari Hindi"
              fontSize="30px"
              lineHeight="39.9px"
              color="#BC4501"
            >
              {state?.selectedSloga?.s}
            </Typography>
          </Container>
          <img src={nextButton} />
        </Box>
      </Box>
    </Box>
  );
};

export default DetailPage;
