import React from "react";
import { AppBar, Toolbar, IconButton, Box, Link, Button } from "@mui/material";
import appIcon from "../../assets/madhwa2.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { replace, useLocation, useNavigate } from "react-router-dom";
import useToken from "../../Services/Auth/useToken";

interface TopBarProps {
  toggleMenu: () => void;
  expandNavigationMenu: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  toggleMenu,
  expandNavigationMenu,
}) => {
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const { creds, setToken } = useToken();

  const logout = () => {
    setToken(null);
    navigate("/", { replace: true });
  };

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
        {!pathName.includes("login") && (
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
        )}
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexGrow: 2,
          }}
        >
          <IconButton
            sx={{ marginRight: "8px", marginLeft: "6px", height: "48px", width:"48px" }}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <img  style={{ width : "50px", height: "48px" }} src={appIcon} />
          </IconButton>
          <div className="app-name-wrapper">
            <span className="app-name"> द्वैत निधिः</span>
            <span className="app-tagline">Dwaita Nidhi</span>
          </div>
          <div className="app-sub-name">
            A collection of works by Srimadananda Theertha Bhagavadpadacharya
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
          {!pathName.includes("search") && !pathName.includes("login") && (
            <SearchOutlinedIcon
              sx={{ color: "#fffffd", cursor: "pointer" }}
              onClick={() => {
                navigate("/search", { state: { from: "top-bar" } });
              }}
            />
          )}
          {/* <BookmarkBorderOutlinedIcon sx={{ mx: 3, color: "#fffffd" }} /> */}
          {!pathName.includes("login") && creds == null ? (
            <Link href="/login" style={{ fontSize: "13px", color: "#fffffd" }}>
              Login
            </Link>
          ) : creds?.username ? (
            <div className="app-name-wrapper">
              <Link style={{ fontSize: "13px", color: "#fffffd" }}>
                {creds?.username}
              </Link>
              <Link
                onClick={logout}
                style={{ fontSize: "13px", color: "red", cursor: "pointer" }}
              >
                Logout
              </Link>
            </div>
          ) : (
            <></>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
