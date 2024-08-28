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
import { Sloga } from "../../types/GlobalType.type";
import { Chapters } from "../../types/Context.type";
import Formatter from "../../Services/Common/Formatter";

interface ListViewProps {
  handleSlogaClick: (selectedSloga: Sloga) => void;
  fromDetailPage?: boolean;
  selectedSloga?: Sloga;
  toc: Chapters[] | undefined;
  slogas: Sloga[] | undefined;
}

const TreeView: React.FC<ListViewProps> = ({
  handleSlogaClick,
  toc: tocData,
  slogas,
}) => {
  const [closedChapters, setClosedChapters] = useState<{
    [key: string]: boolean;
  }>({});
  const [cacheSloga, setCacheSloga] = useState<{ [key: string]: any[] }>({});
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
    const slogaObject: any = {};
    tocData?.map((chapter) => {
      chapter.sub?.map((subchapter) => {
        slogaObject[`${chapter.n}.${subchapter.n}`] = getSloga(
          chapter.n,
          subchapter.n
        );
      });
    });
    setCacheSloga(slogaObject);
  }, [tocData]);

  const handleSubChapterClick = (chapterId: string, subchapterId: string) => {
    const chapterKey = `${chapterId}.${subchapterId}`;
    setClosedChapters((prevState) => ({
      ...prevState,
      [chapterKey]: !prevState[chapterKey],
    }));
    if (!cacheSloga[chapterKey]) {
      const sloga = getSloga(chapterId, subchapterId);
      setCacheSloga((prevState) => ({
        ...prevState,
        [chapterKey]: sloga,
      }));
    }
  };

  const getSloga = (chapterId: string, subchapterId: string) => {
    const filteredSloga = slogas?.filter((data: Sloga) => {
      if (data.a == chapterId && data.p == subchapterId) {
        return data;
      }
    });
    return filteredSloga || [];
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
                          px: "20px",
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
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              background: "#A74600",
                              rotate: "45deg",
                              flexShrink: "0",
                            }}
                          ></div>
                          <span
                            style={{
                              color: "#787878",
                              marginRight: "8px",
                              marginLeft: "20px",
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
                          {cacheSloga[`${chapter.n}.${subchapter.n}`]?.map(
                            (sloga) => (
                              <ListItem
                                sx={{
                                  cursor: "pointer",
                                  borderBottom: "1px solid #dddddd",
                                  pl: {
                                    lg: "60px",
                                    xs: "40px",
                                  },
                                  py: 0.5,
                                }}
                                key={sloga.i}
                                onClick={() => handleSlogaClick(sloga)}
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
                                    {Formatter.toDevanagariNumeral(sloga.i)}{" "}
                                    &nbsp;
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Vesper Libre",
                                    }}
                                  >
                                    {sloga.s}
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
