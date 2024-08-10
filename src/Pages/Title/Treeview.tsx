import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import tocData from "./treeData.json";
import { Sloga } from "../../types/GlobalType.type";

interface ListViewProps {
  handleSlogaClick: (selectedSloga: Sloga) => void;
  fromDetailPage?: boolean;
  selectedSloga?: Sloga;
}

const TreeView: React.FC<ListViewProps> = ({ handleSlogaClick }) => {
  const [openChapters, setOpenChapters] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [cacheSloga, setCacheSloga] = useState<{ [key: string]: any[] }>({});

  const handleChapterClick = (chapterId: string) => {
    setOpenChapters((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
  };

  const handleSubChapterClick = (chapterId: string, subchapterId: string) => {
    const chapterKey = `${chapterId}.${subchapterId}`;
    setOpenChapters((prevState) => ({
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
    const slogas = tocData.data.filter((data) => {
      if (data.a == chapterId && data.p == subchapterId) {
        return data;
      }
    });
    return slogas;
  };

  return (
    <List sx={{ borderTop: "1px solid #dddddd", paddingTop: 0 }}>
      {tocData.chapters.map((chapter) => (
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
              primary={`${chapter.n}. ${chapter.name}`}
              primaryTypographyProps={{
                fontFamily: "Tiro Devanagari Hindi",
                fontSize: "26px",
                color: "#A74600",
              }}
            />
            <IconButton>
              {openChapters[chapter.n] ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItem>
          <Collapse in={openChapters[chapter.n]} timeout="auto" unmountOnExit>
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
                        fontFamily: "Tiro Devanagari Hindi",
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
                        }}
                      ></div>
                      <span
                        style={{
                          color: "#787878",
                          marginRight: "8px",
                          marginLeft: "20px",
                          fontFamily: "Tiro Devanagari Hindi",
                        }}
                      >
                        {chapter.n}.{subchapter.n}
                      </span>
                      <span style={{ fontFamily: "Tiro Devanagari Hindi" }}>
                        {subchapter.name}
                      </span>
                    </ListItemText>
                    <IconButton>
                      {openChapters[`${chapter.n}${subchapter.n}`] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </ListItem>
                  <Collapse
                    in={openChapters[`${chapter.n}.${subchapter.n}`]}
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
                              pl: "60px",
                              py: 0.5,
                            }}
                            key={sloga.i}
                            onClick={() => handleSlogaClick(sloga)}
                          >
                            <ListItemText
                              primaryTypographyProps={{
                                fontFamily: "Tiro Devanagari Hindi",
                                fontSize: "16px",
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
                                  fontFamily: "Tiro Devanagari Hindi",
                                }}
                              >
                                {sloga.i} &nbsp;
                              </span>
                              <span
                                style={{
                                  fontFamily: "Tiro Devanagari Hindi",
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
        </React.Fragment>
      ))}
    </List>
  );
};

export default TreeView;