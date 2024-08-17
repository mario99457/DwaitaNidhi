import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import appIcon from "../../assets/app_logo.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  toggleMenu: () => void;
  expandNavigationMenu: boolean;
}

const TopBarSmall: React.FC<TopBarProps> = ({
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
          padding: "0 10px 0 10px !important",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 1 }}
          onClick={toggleMenu}
        >
          <MenuIcon sx={{ color: "#ffffff", fontSize: "2rem" }} />
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
            sx={{ marginRight: "8px", marginLeft: "6px", width: "50px" }}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <img src={appIcon} />
          </IconButton>
          <div className="app-name-wrapper app-name-wrap-small">
            <span className="app-name app-name-small"> द्वैत निधि</span>
            <span className="app-tagline app-tagline-small">Dwaita Nidhi</span>
          </div>
        </Box>
        <Box
          sx={{
            flexGrow: 2,
            textAlign: "end",
            display: "flex",
            height: "100%",
            justifyContent: "end",
            alignItems: "center",
          }}
          className="top-bar-links"
        >
          <MoreVertIcon sx={{ color: "#fffffd" }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBarSmall;
