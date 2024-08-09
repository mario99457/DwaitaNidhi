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

const TreeView = () => {
  const [openChapters, setOpenChapters] = useState<{ [key: string]: boolean }>(
    {}
  );

  const dummySolga = [
    {
      i: "11001",
      s: "ॐ अथातो ब्रह्मजिज्ञासा ॐ ",
      a: "1",
      p: "1",
      n: "1",
      e: "",
      pc: "",
    },
    {
      i: "11002",
      s: "ॐ जन्माद्यस्य यतः ॐ ",
      a: "1",
      p: "1",
      n: "2",
      e: "",
      pc: "",
    },
    {
      i: "11003",
      s: "ॐ शास्त्रयोनित्वात् ॐ ",
      a: "1",
      p: "1",
      n: "3",
      e: "",
      pc: "",
    },
    {
      i: "11004",
      s: "ॐ तत्तु समन्वयात् ॐ ",
      a: "1",
      p: "1",
      n: "4",
      e: "",
      pc: "",
    },
  ];

  const handleChapterClick = (chapterId: string) => {
    setOpenChapters((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
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
                      handleChapterClick(`${chapter.n}${subchapter.n}`)
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
                    in={openChapters[`${chapter.n}${subchapter.n}`]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {dummySolga.map((sloga) => (
                        <ListItem
                          //   onClick={() => handleChapterClick(chapter.n)}
                          sx={{
                            cursor: "pointer",
                            borderBottom: "1px solid #dddddd",
                            pl: "60px",
                            py: 0.5,
                          }}
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
                              {sloga.n} &nbsp;
                            </span>
                            <span
                              style={{ fontFamily: "Tiro Devanagari Hindi" }}
                            >
                              {sloga.s}
                            </span>
                          </ListItemText>
                        </ListItem>
                      ))}
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
