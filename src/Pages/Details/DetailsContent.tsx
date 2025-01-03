import {
  Backdrop,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useDebugValue, useEffect, useState } from "react";
import playButton from "../../assets/Play_no_track.svg";
import pencilEdit from "../../assets/pencil_edit.svg";
import saveEdit from "../../assets/save_edit.svg";
import cancelEdit from "../../assets/cancel_edit.svg";
// import bookmark from "../../assets/bookmark.svg";
// import details from "./details.json";
import CachedData, { GenericBook } from "../../Services/Common/GlobalServices";
import { Title } from "../../types/GlobalType.type";
import Parser from "html-react-parser";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import useToken from "../../Services/Auth/useToken";
import { useAppData } from "../../Store/AppContext";
import ContentEditable from "react-contenteditable";

interface DetailsContentProps {
  selectedCommentary: {
    name: string;
    author: string;
    key: string;
    number: string;
    audio: boolean;
  };
  selectedTitle: Title;
  style?: React.CSSProperties;
  key: string;
  defaultExpanded?: boolean | { expanded: boolean };
  isMobile: boolean;
  setShowPlayer: () => void;
  editContent: () => void;
}

const DetailsContent = ({
  selectedCommentary,
  style,
  selectedTitle,
  defaultExpanded,
  isMobile,
  setShowPlayer,
  editContent,
}: DetailsContentProps) => {
  const [commentaries, setCommentaries] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(defaultExpanded || false);
  const { creds } = useToken();

  const [editable, setEditable] = React.useState(false);
  const [editedText, setEditedText] = React.useState("<html></html>");
  const { state } = useAppData();

  const handleChange = (evt) => {
    setEditedText(evt.target.value);
  };

  const handleSave = (id) => {
    GenericBook?.updateContent(
      selectedCommentary.key,
      selectedTitle.i,
      editedText
    );
    //TODO:
    //create json object with title number, commentary name
    //preprocess text
    //call service to update text to GitHub
    setEditable(!editable);
  };

  const handleCancel = (id) => {
    //TODO:
    //create json object with title number, commentary name
    //preprocess text
    //call service to update text to GitHub
    setEditable(!editable);
  };

  const sanitizeConf = {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
    allowedAttributes: { a: ["href"] },
  };

  // const sanitize = () => {
  //   useState({ html: sanitizeHtml(html, sanitizeConf) });
  // };

  const toggleEditable = () => {
    setEditable(!editable);
  };

  useEffect(() => {
    setCommentaries(
      GenericBook.getCommentaries(
        selectedTitle
      )
    );
  }, [selectedTitle]);

  useEffect(() => {
    setEditedText(
      commentaries?.find((data) => data.key == selectedCommentary.key)?.text
    );
  }, [commentaries]);

  useEffect(() => {
    if (defaultExpanded && typeof defaultExpanded === "object") {
      setExpanded(defaultExpanded.expanded);
    } else setExpanded(defaultExpanded || false);
  }, [defaultExpanded]);

  return (
    <Box
      sx={{
        borderRadius: "8px",
        marginTop: "16px",
        background: "#f4f4f4",
        padding: "20px 10px",
        minHeight: "100px",
        ...style,
      }}
      id={selectedCommentary.key}
    >
      <Stack
        className="detail-header"
        direction="row"
        justifyContent="space-between"
        sx={{
          top: "100px",
          position: "sticky",
          background: "#f4f4f4",
          zIndex: 2
        }}
      >
        <div
          className={`d-flex detail-meta ${
            isMobile ? "align-items-start" : "align-items-end"
          }`}
        >
          <Typography
            color="#A74600"
            lineHeight="45.58px"
            fontSize="30px"
            minWidth="90px"
          >
            {selectedCommentary.name}
          </Typography>
          <Typography
            color="#616161"
            fontSize="20px"
            lineHeight="21.2px"
            marginLeft={{ lg: 5 }}
            marginBottom={1}
          >
            {selectedCommentary.author}
          </Typography>
        </div>
        <div
          className={`d-flex ${
            isMobile ? "align-items-baseline" : "align-items-center"
          }`}
        >
          {selectedCommentary.audio ? (
            <img
              src={playButton}
              style={{ cursor: "pointer" }}
              alt="play"
              onClick={() => setShowPlayer()}
            />
          ) : (
            <></>
          )}
          {/* <img src={bookmark} alt="bookmark" style={{ marginLeft: "3rem" }} /> */}
          {creds?.token ? (
            !editable ? (
              <img
                src={pencilEdit}
                alt="edit"
                style={{ marginLeft: "3rem" }}
                onClick={() => toggleEditable()}
              />
            ) : (
              <div>
                <img
                  src={saveEdit}
                  alt="save"
                  style={{ marginLeft: "3rem" }}
                  onClick={() =>
                    handleSave(selectedTitle.i + "_" + selectedCommentary.key)
                  }
                />{" "}
                <img
                  src={cancelEdit}
                  alt="save"
                  style={{ marginLeft: "3rem" }}
                  onClick={() =>
                    handleCancel(selectedTitle.i + "_" + selectedCommentary.key)
                  }
                />
              </div>
            )
          ) : (
            <></>
          )}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: "#616161", marginLeft: "26px" }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
      </Stack>
      <Collapse in={Boolean(expanded)}>
        <ContentEditable
          id={selectedTitle.i + "_" + selectedCommentary.key}
          className="editable"
          tagName="pre"
          html={!editedText?"<html></html>" : editedText} // innerHTML of the editable div
          disabled={!editable} // use true to disable edition
          onChange={handleChange} // handle innerHTML change
          //onBlur={sanitize}
        />
        {/* <Typography
          fontSize="22px"
          lineHeight="33px"
          marginTop="27px"
          whiteSpace="pre-line"
        >
          {Parser(
            commentaries?.find((data) => data.key == selectedCommentary.key)
              ?.text || ""
          )}
        </Typography> */}
      </Collapse>
    </Box>
  );
};

export default DetailsContent;
