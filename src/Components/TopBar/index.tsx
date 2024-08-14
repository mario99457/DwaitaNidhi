import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Tabs, Tab } from "@mui/material";
import appIcon from "../../assets/app_logo.svg";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import { Link, useLocation, useNavigate } from "react-router-dom";
import CachedData, { Sutraani } from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";

interface TopBarProps {
  progress: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ progress }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selctedMenu, setSelctedMenu] = useState(pathname.split("/")[1] ?? "");

  const handleMenuClick = (
    e: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setSelctedMenu(value);
    navigate(`/${value}`);
  };

  useEffect(() => {
    if (selctedMenu && selctedMenu == "sutraani" && !progress) {
      Sutraani.populateAllSutras();
    }
  }, [selctedMenu, progress]);

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#600000",
        color: "#ffffff",
        height: "130px",
        padding: "8px 8px 0",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25);",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexGrow: 2,
          }}
          onClick={() => {
            setSelctedMenu("");
            navigate("/");
          }}
        >
          <IconButton
            sx={{ marginRight: "8px", marginLeft: "6px" }}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <img src={appIcon} />
          </IconButton>
          <div className="app-name-wrapper">
            <span className="app-name"> द्वैत निधि</span>
            <span className="app-tagline">Dwaita Nidhi</span>
            <div className="app-sub-name">
              A collection of works by Sri acharya with searchable commentaries
            </div>
          </div>
        </Box>
        <Box
          sx={{
            flexGrow: 2,
            textAlign: "end",
            display: "flex",
            height: "100%",
            justifyContent: "end",
            paddingTop: "8px",
          }}
          className="top-bar-links"
        >
          <Link to={"/"}>Contact Us</Link>
          <Link to={"/"}>How it works</Link>
          <Link to={"/"}>Login</Link>
        </Box>
      </Toolbar>
      <Box
        sx={{
          display: "flex",
          marginTop: "6px",
        }}
      >
        <Box
          sx={{
            flexGrow: 2,
            paddingLeft: "11rem",
          }}
        >
          <Tabs
            value={selctedMenu}
            onChange={handleMenuClick}
            className="top-bar-tabs"
          >
            {!progress
              ? CachedData.data.books?.map((item: Book) => (
                  <Tab
                    label={item.title}
                    value={item.name}
                    sx={{ color: "#ffffff" }}
                    key={item.name}
                  />
                ))
              : ""}
          </Tabs>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SearchOutlinedIcon />
          <BookmarkBorderOutlinedIcon sx={{ mx: 4 }} />
        </Box>
      </Box>
    </AppBar>
  );
};

export default TopBar;
