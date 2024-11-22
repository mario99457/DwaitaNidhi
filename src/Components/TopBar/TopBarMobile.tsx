import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Typography, Link } from "@mui/material";
import appIcon from "../../assets/app_logo.svg";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CachedData from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";
import DrawerMenu from "../../Pages/Details/DrawerMenu";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogInOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogOutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import useToken from "../../Services/Auth/useToken";

interface TopBarProps {
  toggleMenu: () => void;
  expandNavigationMenu: boolean;
  progress: boolean;
}

const TopBarSmall: React.FC<TopBarProps> = ({
  toggleMenu,
  //expandNavigationMenu,
  progress,
}) => {
  const { pathname } = useLocation();
  const { bookName } = useParams();
  const pathName = useLocation().pathname;
  const { creds, setToken } = useToken();
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    navigate("/", { replace:true });
  };

  const pages = ["home", "title", "detail", "search"];
  const [pageName, setPageName] = useState(pages[0]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const BookClass = CachedData.getBookClass(bookName || "");
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const sections = pathname.split("/").filter((str) => str);
    if (pathname == "/") {
      setPageName(pages[0]);
      return;
    }
    if (pathname && !progress && CachedData?.data?.books?.length) {
      if (sections[0] && sections[0] != "search") {
        const tempBook = CachedData.data.books.find(
          (book: Book) => book.name == sections[0]
        );
        if (!tempBook) {
          return;
        }
        setSelectedBook(tempBook);

        setPageName(pages[sections.length]);
      }
    }
  }, [pathname, progress]);

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
        {!pathname.includes("login") &&
         (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 1 }}
            onClick={toggleMenu}
          >
            <MenuIcon sx={{ color: "#ffffff", fontSize: "2rem" }} />
          </IconButton>
        )}

        
        {pageName == "title" || pageName == "detail" ? (
          <>
            <Typography
              fontFamily="Poppins"
              fontSize="20px"
              color="#FFFFFF"
              fontWeight={600}
              sx={{
                position: "relative",
                left: "40%",
                transform: "translateX(-50%)",
              }}
            >
              {selectedBook?.title}
            </Typography>
            {/* {pageName == "detail" && (
              <div
                style={{
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "end",
                }}
                onClick={() => setOpenDrawer(true)}
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
            )} */}
          </>
        ) : (
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
              <span className="app-tagline app-tagline-small">
                Dwaita Nidhi
              </span>
            </div>
          </Box>
        )}
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
          {!pathname.includes("search") && (
            <SearchOutlinedIcon
              sx={{ color: "#fffffd", cursor: "pointer" }}
              onClick={() => {
                navigate("/search", { state: { from: "top-bar" } });
              }}
            />
          )}
          {!pathName.includes("login") && creds == null ? (
                  <LogInOutlinedIcon
                  sx={{ color: "#fffffd", cursor: "pointer" }}
                  onClick={() => {
                    navigate("/login", { state: { from: "top-bar" } });
                  }}
                />) :
            (creds?.username? 
              <div className="app-name-wrapper">
                {/* <Link style={{ fontSize: "13px", color: "#fffffd" }}>{creds?.username}</Link> */}
                <LogOutOutlinedIcon
                  sx={{ color: "#fffffd", cursor: "pointer" }}
                  onClick={logout}
                />
              </div> : <></>
          )}     
        </Box>
      </Toolbar>
      {openDrawer ? (
        <DrawerMenu
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          bookName={bookName}
          selectedTitle={{
            a: "",
            i: "",
            n: "",
            p: "",
            s: "",
          }}
          titles={BookClass?.allTitles}
        />
      ) : (
        ""
      )}
    </AppBar>
  );
};

export default TopBarSmall;
