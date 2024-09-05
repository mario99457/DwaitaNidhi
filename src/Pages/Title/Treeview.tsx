import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import tocData from "./treeData.json";
import { Title } from "../../types/GlobalType.type";
import { Chapters } from "../../types/Context.type";
import Formatter from "../../Services/Common/Formatter";

interface ListViewProps {
  handleTitleClick: (selectedTitle: Title) => void;
  fromDetailPage?: boolean;
  selectedTitle?: Title;
  toc: Chapters[] | undefined;
  titles: Title[] | undefined;
  isMobile: boolean;
}

const TreeView: React.FC<ListViewProps> = ({
  handleTitleClick,
  toc: tocData,
  titles,
  isMobile,
}) => {
  const [closedChapters, setClosedChapters] = useState<{
    [key: string]: boolean;
  }>({});
  const [cacheTitle, setCacheTitle] = useState<{ [key: string]: any[] }>({});
  const [loader, setLoader] = useState(false);

  const handleChapterClick = (chapterId: string) => {
    setClosedChapters((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
  };

  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
    const titleObject: any = {};
    tocData?.map((chapter) => {
      chapter.sub?.map((subchapter) => {
        titleObject[`${chapter.n}.${subchapter.n}`] = getTitle(
          chapter.n,
          subchapter.n
        );
      });
    });
    setCacheTitle(titleObject);
  }, [tocData]);

  const handleSubChapterClick = (chapterId: string, subchapterId: string) => {
    const chapterKey = `${chapterId}.${subchapterId}`;
    setClosedChapters((prevState) => ({
      ...prevState,
      [chapterKey]: !prevState[chapterKey],
    }));
    if (!cacheTitle[chapterKey]) {
      const title = getTitle(chapterId, subchapterId);
      setCacheTitle((prevState) => ({
        ...prevState,
        [chapterKey]: title,
      }));
    }
  };

  const getTitle = (chapterId: string, subchapterId: string) => {
    const filteredTitle = titles?.filter((data: Title) => {
      if (data.a == chapterId && data.p == subchapterId) {
        return data;
      }
    });
    return filteredTitle || [];
  };

  return (
    <>
      {/* <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
        onClick={() => setLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <List sx={{ borderTop: "1px solid #dddddd", paddingTop: 0 }}>
        {tocData?.map((chapter) => (
          <React.Fragment key={chapter.n}>
            <ListItem
              onClick={() => handleChapterClick(chapter.n)}
              sx={{
                cursor: "pointer",
                borderBottom: "1px solid #dddddd",
                py: 0.5,
                px: "20px",
              }}
              className="treeview-list-item"
            >
              <ListItemText
                primary={`${Formatter.toDevanagariNumeral(chapter.n)}. ${
                  chapter.name
                }`}
                primaryTypographyProps={{
                  fontFamily: "Vesper Libre",
                  fontSize: "26px",
                  color: "#A74600",
                }}
              />
              <IconButton>
                {!closedChapters[chapter.n] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItem>
            {chapter.sub && (
              <Collapse
                in={!closedChapters[chapter.n]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {chapter.sub.map((subchapter) => (
                    <React.Fragment key={subchapter.n}>
                      <ListItem
                        key={subchapter.n}
                        sx={{
                          cursor: "pointer",
                          borderBottom: "1px solid #dddddd",
                          py: 0.5,
                          px: { lg: "20px" },
                        }}
                        onClick={() =>
                          handleSubChapterClick(chapter.n, subchapter.n)
                        }
                        className="treeview-list-item"
                      >
                        <ListItemText
                          // primary={subchapter.name}
                          primaryTypographyProps={{
                            fontFamily: "Vesper Libre",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {!isMobile && (
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                background: "#A74600",
                                rotate: "45deg",
                                flexShrink: "0",
                              }}
                            ></div>
                          )}
                          <span
                            style={{
                              color: "#787878",
                              marginRight: "8px",
                              marginLeft: isMobile ? "4px" : "20px",
                              fontFamily: "Vesper Libre",
                            }}
                          >
                            {Formatter.toDevanagariNumeral(chapter.n)}.
                            {Formatter.toDevanagariNumeral(subchapter.n)}
                          </span>
                          <span style={{ fontFamily: "Vesper Libre" }}>
                            {subchapter.name}
                          </span>
                        </ListItemText>
                        <IconButton>
                          {!closedChapters[`${chapter.n}.${subchapter.n}`] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </IconButton>
                      </ListItem>
                      <Collapse
                        in={!closedChapters[`${chapter.n}.${subchapter.n}`]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {cacheTitle[`${chapter.n}.${subchapter.n}`]?.map(
                            (title) => (
                              <ListItem
                                sx={{
                                  cursor: "pointer",
                                  borderBottom: "1px solid #dddddd",
                                  pl: {
                                    lg: "60px",
                                    xs: "20px",
                                  },
                                  py: 0.5,
                                }}
                                key={title.i}
                                onClick={() => handleTitleClick(title)}
                              >
                                <ListItemText
                                  primaryTypographyProps={{
                                    fontFamily: "Vesper Libre",
                                    fontSize: "18px",
                                    color: "#616161",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="circle-bullet"></div>
                                  &nbsp;
                                  <span
                                    style={{
                                      color: "#787878",
                                      fontFamily: "Vesper Libre",
                                      flexShrink: "0",
                                    }}
                                  >
                                    {Formatter.toDevanagariNumeral(`${title?.a}.${title?.p}.${title?.n}`)}{" "}
                                    &nbsp;
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Vesper Libre",
                                    }}
                                  >
                                    {title.s}
                                  </span>
                                </ListItemText>
                              </ListItem>
                            )
                          )}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );
};

export default TreeView;
