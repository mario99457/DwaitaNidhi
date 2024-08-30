import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import CachedData, { Sutraani } from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

interface NavigationMenuProps {
  expandNavigationMenu: boolean;
}

interface NavigationItem {
  name?: string;
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string | null;
  subMenu?: NavigationItem[];
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  expandNavigationMenu,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(
    pathname.split("/")[1] || ""
  );
  const [selectedMenu, setSelectedMenu] = useState<string>(
    selectedBook ? "books" : "home"
  );
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>(
    selectedBook || ""
  );
  const [expandedMenu, setExpandedMenu] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigation: NavigationItem[] = [
    {
      key: "home",
      label: "HOME",
      icon: <HomeRoundedIcon fontSize="medium" />,
      path: "/",
    },
    {
      key: "books",
      label: "सर्वमूलग्रन्थाः",
      icon: (
        <MenuBookTwoToneIcon fontSize="medium" className="menu-icon-book" />
      ),
      path: null,
      subMenu: CachedData.data.books.map((book: Book) => {
        return {
          name: book.name,
          key: book.name,
          label: book.title,
          path: `/${book.name}`,
        };
      }),
    },
    {
      key: "otherBooks",
      label: "अन्यग्रन्थाः",
      icon: (
        <MenuBookTwoToneIcon fontSize="medium" className="menu-icon-book" />
      ),
      path: null,
      //   subMenu: [],
    },
  ];

  useEffect(() => {
    setSelectedBook(pathname.split("/")[1] || "");
  }, [pathname]);

  useEffect(() => {
    Sutraani.populateAllSutras();
    if (
      selectedBook &&
      CachedData.data.books.find((book: Book) => book.name == selectedBook)
    ) {
      setSelectedMenu("books");
      setExpandedMenu({ books: true });
    }
    if (!selectedBook) {
      setSelectedMenu("home");
      setExpandedMenu({});
    }
  }, [selectedBook]);

  const handleMenuItemClick = (
    e: React.MouseEvent<HTMLElement>,
    item: NavigationItem
  ) => {
    if (item.subMenu) {
      setExpandedMenu((prevState) => ({
        ...prevState,
        [item.key]: !prevState[item.key],
      }));
      if (!expandNavigationMenu) {
        setAnchorEl(e.currentTarget);
      }
    }
    if (item.path) {
      setSelectedMenu(item.key);
      setSelectedSubMenu("");
      navigate(item.path);
    }
  };

  const handleSubMenuClick = (
    item: NavigationItem,
    parentItem: NavigationItem
  ) => {
    setSelectedSubMenu(item.key);
    setSelectedMenu(parentItem.key);
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F4F4F4",
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
        justifyContent: "space-between",
        transition: "width 0.1s ease, min-width 0.1s ease",
        width: expandNavigationMenu ? 200 : 60,
        minWidth: expandNavigationMenu ? 200 : 60,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 3,
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <List disablePadding>
          {navigation.map((item) => (
            <React.Fragment key={item.key}>
              <ListItem
                key={item.key}
                disablePadding
                sx={{
                  display: "block",
                  background:
                    selectedMenu == item.key ? "#0000000D" : "transparent",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 60,
                    justifyContent: expandNavigationMenu ? "initial" : "center",
                    //   px: 2.5,
                  }}
                  // onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                  // onMouseLeave={(e) => setAnchorEl(null)}
                  onClick={(e) => handleMenuItemClick(e, item)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: expandNavigationMenu ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: expandNavigationMenu ? 1 : 0 }}
                  />
                  {item.subMenu?.length && expandNavigationMenu ? (
                    expandedMenu[item.key] ? (
                      <ExpandLess sx={{ color: "#61616180" }} />
                    ) : (
                      <ExpandMore sx={{ color: "#61616180" }} />
                    )
                  ) : (
                    ""
                  )}
                </ListItemButton>
              </ListItem>

              {expandedMenu[item.key] && expandNavigationMenu && (
                <Collapse
                  in={expandedMenu[item.key]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subMenu?.map((subMenu: NavigationItem) => (
                      <React.Fragment key={subMenu.key}>
                        <ListItem
                          key={subMenu.key}
                          sx={{
                            cursor: "pointer",
                            borderWidth: "1px 0px 1px 0px",
                            borderStyle: "solid",
                            borderColor: "#E4E4E4B2",
                            py: 0.5,
                            px: "20px",
                            minHeight: 50,
                          }}
                          onClick={() => handleSubMenuClick(subMenu, item)}
                        >
                          <ListItemIcon sx={{ minWidth: "30px" }}>
                            <Avatar
                              sx={{
                                width: "30px",
                                height: "30px",
                                bgcolor:
                                  selectedSubMenu == subMenu.key
                                    ? "#A44803"
                                    : "#616161",
                                marginRight: "12px",
                              }}
                            >
                              {subMenu.key[0].toUpperCase()}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primaryTypographyProps={{
                              fontFamily: "Poppins",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              color:
                                selectedSubMenu == subMenu.key
                                  ? "#A44803"
                                  : "#616161",
                              fontWeight:
                                selectedSubMenu == subMenu.key ? "600" : "400",
                            }}
                            primary={subMenu.label}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              )}
              {!expandNavigationMenu && item.subMenu && (
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                    className: "sidebar-menu-list",
                  }}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  {item.subMenu.map((subItem) => (
                    <MenuItem
                      key={subItem.key}
                      onClick={() => handleSubMenuClick(subItem, item)}
                    >
                      {subItem.label}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </React.Fragment>
          ))}
        </List>
        <div>
          <List disablePadding>
            <ListItem
              disablePadding
              sx={{
                display: "block",
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 60,
                  justifyContent: expandNavigationMenu ? "initial" : "center",
                  //   px: 2.5,
                }}
                onClick={(e) => handleMenuItemClick(e, item)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: expandNavigationMenu ? 1 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Settings"
                  sx={{ opacity: expandNavigationMenu ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
          <Box
            className="app-footer"
            sx={{
              fontFamily: "Poppins",
              color: "#616161",
              pl: 2,
              pb: 5,
              minHeight: "260px",
              maxHeight: "260px",
              overflow: "hidden",
            }}
          >
            {expandNavigationMenu && (
              <>
                <div style={{ width: "110px", fontSize: "13px" }}>
                  @copyright -2024 Developed and Maintained by
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>
                  Sri Sripadaraja Mutt, Mulabagilu
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ fontSize: "14px", gap: "12px", height: "60px" }}
                >
                  <EmailOutlinedIcon />
                  Contact Us
                </div>              
              </>
            )}
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default NavigationMenu;
