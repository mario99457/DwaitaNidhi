import React, { useEffect, useRef, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import tocData from "./treeData.json";
import { Title } from "../../types/GlobalType.type";
import { Chapters } from "../../types/Context.type";
import Formatter from "../../Services/Common/Formatter";
import Sanscript from '@indic-transliteration/sanscript';
import { useAppData } from "../../Store/AppContext";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AudioHighlightingService } from "../../Services/Common/GlobalServices";

interface ListViewProps {
  handleTitleClick: (selectedTitle: Title) => void;
  fromDetailPage?: boolean;
  selectedTitle?: Title;
  toc: Chapters[] | undefined;
  titles: Title[] | undefined;
  isMobile: boolean;
  commentaryScript: string;
}

const TreeView: React.FC<ListViewProps> = ({
  handleTitleClick,
  toc: tocData,
  titles,
  isMobile,
  selectedTitle,
  commentaryScript,
}) => {
  const [closedChapters, setClosedChapters] = useState<{
    [key: string]: boolean;
  }>({});
  const [cacheTitle, setCacheTitle] = useState<{ [key: string]: any[] }>({});
  const [loader, setLoader] = useState(false);
  const titleRef = useRef<any>({});
  const { state } = useAppData();

  // Check if a title is currently playing using generic service
  const isCurrentlyPlaying = (title: Title) => {
    return state.currentlyPlayingTitle && state.currentlyPlayingTitle.i === title.i;
  };

  // Scroll to currently playing title when it changes
  useEffect(() => {
    if (state.currentlyPlayingTitle) {
      const titleElement = titleRef.current[state.currentlyPlayingTitle.i];
      if (titleElement) {
        // Ensure the title is visible by scrolling to it
        titleElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [state.currentlyPlayingTitle]);

  const handleChapterClick = (chapterId: string) => {
    setClosedChapters((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
  };

  useEffect(() => {
    let titleObject: any = {};
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);

    // Check if there are no chapters OR if chapters exist but no titles match
    const hasMatchingTitles = () => {
      if (!tocData || tocData.length === 0) return false;
      
      for (const chapter of tocData) {
        if (chapter.sub && chapter.sub.length > 0) {
          for (const sub of chapter.sub) {
            if (getTitle(chapter.n, sub.n).length > 0) {
              return true;
            }
          }
        } else {
          if (getTitle(chapter.n, "").length > 0) {
            return true;
          }
        }
      }
      return false;
    };

    if (tocData?.length == 0 || !hasMatchingTitles()) {
      titleObject = {
        noTree: true,
        titles: titles,
      };
    } else {
      tocData?.map((chapter) => {
        if (chapter.sub) {
          chapter.sub.map((subchapter) => {
            titleObject[`${chapter.n}.${subchapter.n}`] = getTitle(
              chapter.n,
              subchapter.n
            );
          });
        } else {
          titleObject[`${chapter.n}`] = getTitle(chapter.n, "");
        }
      });
    }
    setCacheTitle(titleObject);
  }, [tocData]);

  useEffect(() => {
    if (selectedTitle && titleRef.current[selectedTitle?.i]) {
      titleRef.current[selectedTitle?.i].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [titleRef.current[selectedTitle?.i || ""]]);

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
      if (subchapterId) {
        return data.a == chapterId && data.p == subchapterId;
      } else {
        return data.a == chapterId && (data.p === undefined || data.p === "");
      }
    });
    return filteredTitle || [];
  };

  // Check if any titles match the chapter structure
  const hasMatchingTitles = () => {
    if (!tocData || tocData.length === 0) return false;
    
    for (const chapter of tocData) {
      if (chapter.sub && chapter.sub.length > 0) {
        for (const sub of chapter.sub) {
          if (getTitle(chapter.n, sub.n).length > 0) {
            return true;
          }
        }
      } else {
        if (getTitle(chapter.n, "").length > 0) {
          return true;
        }
      }
    }
    return false;
  };


  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <List sx={{ borderTop: "1px solid #dddddd", paddingTop: 0 }}>
        {((!tocData) || tocData.length === 0 || (tocData.length > 0 && !hasMatchingTitles())) && (
          <List component="div" disablePadding>
            {titles && titles.map((title) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    borderBottom: "1px solid #dddddd",
                    pl: {
                      lg: "60px",
                      xs: "20px",
                    },
                    py: 0.5,
                    backgroundColor:
                      title.i == selectedTitle?.i
                        ? "#DDDDDD"
                        : isCurrentlyPlaying(title)
                        ? "#FFF3CD"
                        : "",
                    borderLeft: isCurrentlyPlaying(title) ? "4px solid #BC4501" : "none",
                  }}
                  key={title.i}
                  onClick={() => handleTitleClick(title)}
                  ref={(el) => (titleRef.current[title.i] = el)}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      // fontFamily: "Vesper Libre",
                      fontSize: "22px",
                      color: "#616161",
                    }}
                  >
                    <span
                      style={{
                        color: "#787878",
                        flexShrink: "0",
                        fontSize: "22px",
                      }}
                    >
                      {Sanscript.t(Formatter.toDevanagariNumeral(`${title?.n}`), 'devanagari', commentaryScript || 'devanagari')} &nbsp;
                    </span>
                    <span
                      style={{
                        fontSize: "22px",
                        whiteSpace: 'pre-line',
                        lineHeight: 1.4,
                        display: 'block',
                        overflow: 'visible',
                      }}
                    >
                      {Sanscript.t(title.s, 'devanagari', commentaryScript || 'devanagari')}
                    </span>
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        )}
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
                primary={
                  `${Sanscript.t(Formatter.toDevanagariNumeral(chapter.n), 'devanagari', commentaryScript || 'devanagari')}. ` +
                  Sanscript.t(chapter.name, 'devanagari', commentaryScript || 'devanagari')
                }
                primaryTypographyProps={{
                  fontSize: "30px",
                  color: "A74600",
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
                  {chapter.sub?.map((subchapter) => (
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
                            // fontFamily: "Vesper Libre",
                            fontSize: "24px",
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
                              fontFamily: "24px",
                            }}
                          >
                            {Sanscript.t(Formatter.toDevanagariNumeral(chapter.n), 'devanagari', commentaryScript || 'devanagari')}.
                            {Sanscript.t(Formatter.toDevanagariNumeral(subchapter.n), 'devanagari', commentaryScript || 'devanagari')}
                          </span>
                          <span style={{ fontSize: "24px" }}>
                            {Sanscript.t(subchapter.name, 'devanagari', commentaryScript || 'devanagari')}
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
                                  backgroundColor:
                                    title.i == selectedTitle?.i
                                      ? "#DDDDDD"
                                      : isCurrentlyPlaying(title)
                                      ? "#FFF3CD"
                                      : "",
                                  borderLeft: isCurrentlyPlaying(title) ? "4px solid #BC4501" : "none",
                                }}
                                key={title.i}
                                onClick={() => handleTitleClick(title)}
                                ref={(el) => (titleRef.current[title.i] = el)}
                              >
                                <ListItemText
                                  primaryTypographyProps={{
                                    // fontFamily: "Vesper Libre",
                                    fontSize: "22px",
                                    color: "#616161",
                                  }}
                                >
                                  <div className="circle-bullet"></div>
                                  &nbsp;
                                  {isCurrentlyPlaying(title) && (
                                    <PlayArrowIcon 
                                      sx={{ 
                                        color: '#BC4501', 
                                        fontSize: '20px', 
                                        mr: 1 
                                      }} 
                                    />
                                  )}
                                  <span
                                    style={{
                                      color: "#787878",
                                      flexShrink: "0",
                                      fontSize: "22px",
                                    }}
                                  >
                                    {Sanscript.t(
                                      Formatter.toDevanagariNumeral(`${title?.a}.${title?.p}.${title?.n}`),
                                      'devanagari',
                                      commentaryScript || 'devanagari'
                                    )}
                                    &nbsp;
                                  </span>
                                  <span style={{ fontSize: "22px", whiteSpace: 'pre-line' }}>
                                    {Sanscript.t(title.s, 'devanagari', commentaryScript || 'devanagari')}
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

            {!chapter.sub && (
              <Collapse
                in={!closedChapters[chapter.n]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {cacheTitle[`${chapter.n}`]?.map((title) => (
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        borderBottom: "1px solid #dddddd",
                        pl: {
                          lg: "60px",
                          xs: "20px",
                        },
                        py: 0.5,
                        backgroundColor:
                          title.i == selectedTitle?.i
                            ? "#DDDDDD"
                            : isCurrentlyPlaying(title)
                            ? "#FFF3CD"
                            : "",
                        borderLeft: isCurrentlyPlaying(title) ? "4px solid #BC4501" : "none",
                      }}
                      key={title.i}
                      onClick={() => handleTitleClick(title)}
                      ref={(el) => (titleRef.current[title.i] = el)}
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "22px",
                          color: "#616161",
                        }}
                      >
                        <div className="circle-bullet"></div>
                        &nbsp;
                        {isCurrentlyPlaying(title) && (
                          <PlayArrowIcon 
                            sx={{ 
                              color: '#BC4501', 
                              fontSize: '20px', 
                              mr: 1 
                            }} 
                          />
                        )}
                        <span
                          style={{
                            color: "#787878",
                            flexShrink: "0",
                            fontSize: "22px",
                          }}
                        >
                          {Sanscript.t(
                            Formatter.toDevanagariNumeral(
                              `${title?.a}${title?.p ? `.${title?.p}` : ""}.${title?.n}`
                            ),
                            'devanagari',
                            commentaryScript || 'devanagari'
                          )}
                          &nbsp;
                        </span>
                        <span style={{ fontSize: "22px", whiteSpace: 'pre-line' }}>
                        {Sanscript.t(title.s, 'devanagari', commentaryScript || 'devanagari')}
                        </span>
                      </ListItemText>
                    </ListItem>
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
