import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import appIcon from "../../assets/app_logo.svg";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  toggleMenu: () => void;
  expandNavigationMenu: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  toggleMenu,
  expandNavigationMenu,
}) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#600000",
        color: "#ffffff",
        height: "55px",
        // padding: "8px 8px 0",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25);",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "55px !important",
          padding: "0 30px 0 10px !important",
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
          onClick={toggleMenu}
        >
          {expandNavigationMenu ? (
            <ArrowBackIcon sx={{ color: "#F18B41" }} />
          ) : (
            <MenuIcon sx={{ color: "#F18B41" }} />
          )}
        </IconButton>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexGrow: 2,
          }}
          onClick={() => {
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
          </div>
          <div className="app-sub-name">
            A collection of works by Sri acharya
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
            alignItems: "center",
          }}
          className="top-bar-links"
        >
          <SearchOutlinedIcon sx={{ color: "#fffffd" }} />
          <BookmarkBorderOutlinedIcon sx={{ mx: 3, color: "#fffffd" }} />
          <span style={{ fontSize: "13px", color: "#fffffd" }}>Login</span>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
