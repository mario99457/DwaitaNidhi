import { Box, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ToC_Icon from "../../assets/toc.svg";
import SearchBox from "../../Components/SearchBox";
import playButton from "../../assets/PlayButton.svg";
import TreeView from "./Treeview";
import listIconSelected from "../../assets/list_selected.svg";
import alphaIcon from "../../assets/alpha.svg";
import listIcon from "../../assets/list.svg";
import alphaIconSelected from "../../assets/alpha_selected.svg";
import AlphaBetView from "./AlphaBetView";

const TitlePage = () => {
  const { bookName } = useParams();
  const [selectedView, setSelectedView] = useState("list");
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
        minHeight: "100%",
        padding: "16px 38px",
        display: "flex",
        flexDirection: "column",
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
      <Container
        sx={{
          backgroundColor: "#E9E9E9",
          padding: "20px 44px 13px 21px",
          borderRadius: "6px",
          marginTop: "16px",
          color: "#BC4501",
          fontFamily: "Tiro Devanagari Hindi",
          fontSize: "18px",
        }}
      >
        इको गुणवृद्धी ॥१.१.३ ॥ इग्ग्रहणं किमर्थम् । ॥
        इग्ग्रहणमात्सन्ध्यक्षरव्यञ्ञ्जननिवृत्त्यर्थम् ॥ इग्ग्रहणं क्रियते । किं
        प्रयोजनम् । आकारनिवृत्त्यर्थं सन्ध्यक्षरनिवृत्त्यर्थं
        व्यञ्ञ्जननिवृत्त्यर्थं च । आकारनिवृत्त्यर्थं तावत् - याता वाता । आकारस्य
        गुणः प्राप्नोति । इग्ग्र्हणान्न भवति । सन्ध्यक्षरनिवृत्त्यर्थम्
      </Container>
      <Box
        sx={{ mt: "3rem", display: "flex", justifyContent: "space-between" }}
      >
        <div
          style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
        >
          <img src={ToC_Icon} width={`18px`} height={`18px`} />
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "Poppins",
              fontSize: "22px",
              fontWeight: "300",
              marginLeft: "10px",
            }}
          >
            सूत्रावलि
          </Typography>
        </div>
        <div className="search-box-wrapper">
          <SearchBox onSearch={() => {}} placeholder={""} />
          <img src={playButton} />
        </div>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
        <img
          src={selectedView == "list" ? listIconSelected : listIcon}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedView("list")}
        />
        <img
          src={selectedView == "alpha" ? alphaIconSelected : alphaIcon}
          style={{ cursor: "pointer", marginLeft: "13px" }}
          onClick={() => setSelectedView("alpha")}
        />
      </Box>
      <Box sx={{ mt: 2 }} className="treeview-box-wrapper">
        {selectedView == "alpha" ? <AlphaBetView /> : <TreeView />}
      </Box>
    </Box>
  );
};

export default TitlePage;
