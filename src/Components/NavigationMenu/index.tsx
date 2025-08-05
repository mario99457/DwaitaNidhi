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
  IconButton,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import CachedData, { GenericBook } from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAppData } from "../../Store/AppContext";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandSideBar, setExpandSideBar] = useState(true); // Always expanded by default
  const { dispatch } = useAppData();

  // Toggle sidebar visibility
  const handleToggleSidebar = () => {
    setExpandSideBar(!expandSideBar);
  };

  useEffect(() => {
    // Always keep books menu expanded when there's a selected book
    if (selectedBook) {
      setExpandedMenu(prev => ({ ...prev, books: true, otherBooks: true }));
    }
  }, [expandNavigationMenu]);

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
      subMenu: CachedData.data.books?.filter((book: Book) => book.type === 'sarvamoola').map((book: Book) => {
        return {
          name: book.name,
          key: book.name,
          label: book.title,
          path: `/${book.name}`,
        };
      }) || [],
    },
    {
      key: "otherBooks",
      label: "अन्यग्रन्थाः",
      icon: (
        <MenuBookTwoToneIcon fontSize="medium" className="menu-icon-book" />
      ),
      path: null,
      subMenu: CachedData.data.books?.filter((book: Book) => book.type === 'others').map((book: Book) => {
        return {
          name: book.name,
          key: book.name,
          label: book.title,
          path: `/${book.name}`,
        };
      }) || [],
    },
  ];

  useEffect(() => {
    const bookname = pathname.split("/")[1] || "";
    setSelectedBook(bookname);
    if (
      bookname &&
      CachedData.data.books?.find((book: Book) => book.name == bookname)
    ) {
      CachedData.selectedBook = bookname;
      // Only populate if data is available
      if (CachedData.data[bookname + "index"] && CachedData.data[bookname + "summary"]) {
        GenericBook.populateIndexList();
        GenericBook.populateCommenatries();
      }
      dispatch({
        type: "setSelectedBook",
        book: CachedData?.data.books.find(
          (item: any) => item.name === bookname
        ),
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (
      selectedBook &&
      CachedData.data?.books?.find((book: Book) => book.name == selectedBook)
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
      if (!expandSideBar) {
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
        transition: "width 0.5s ease, min-width 0.5s ease",
        width: expandSideBar ? 200 : 60,
        minWidth: expandSideBar ? 200 : 60,
        height: "100%",
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <IconButton
          onClick={handleToggleSidebar}
          sx={{
            color: "#616161",
            "&:hover": {
              backgroundColor: "#E0E0E0",
            },
          }}
        >
          {expandSideBar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

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
        <List
          disablePadding
        >
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
                    justifyContent: expandSideBar ? "initial" : "center",
                    //   px: 2.5,
                  }}
                  onClick={(e) => handleMenuItemClick(e, item)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: expandSideBar ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "20px",
                    }}
                    sx={{
                      opacity: expandSideBar ? 1 : 0,
                    }}
                  />
                  {item.subMenu?.length && expandSideBar ? (
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

              {expandedMenu[item.key] && expandSideBar && (
                <Collapse
                  in={expandedMenu[item.key]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    component="div"
                    disablePadding
                    sx={{
                      maxHeight: "33vh",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
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
                              fontSize: "20px",
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
              {!expandSideBar && item.subMenu && (
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
                  justifyContent: expandSideBar ? "initial" : "center",
                  //   px: 2.5,
                }}
                onClick={() => navigate("/settings")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: expandSideBar ? 1 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Settings"
                  primaryTypographyProps={{
                    fontFamily: "Vesper Libre",
                    fontSize: "14px",
                  }}
                  sx={{
                    opacity: expandSideBar ? 1 : 0,
                  }}
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
            {expandSideBar && (
              <div>
                <div
                  style={{
                    width: "110px",
                    fontSize: "13px",
                    fontFamily: "Vesper Libre",
                  }}
                >
                  @copyright -2024 Developed and Maintained by
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "Vesper Libre",
                  }}
                >
                  Dwaita Nidhi Software Solutions
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{
                    fontSize: "14px",
                    gap: "12px",
                    height: "60px",
                    fontFamily: "Vesper Libre",
                  }}
                >
                  <EmailOutlinedIcon />
                  Contact Us
                </div>
              </div>
            )}
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default NavigationMenu;
