import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Sloga } from "../../types/GlobalType.type";
import { Chapters } from "../../types/Context.type";
import Formatter from "../../Services/Common/Formatter";

interface ListViewProps {
  handleSlogaClick: (selectedSloga: Sloga) => void;
  toc: Chapters[] | undefined;
  slogas: Sloga[] | undefined;
}

const AlphaBetView: React.FC<ListViewProps> = ({
  handleSlogaClick,
  slogas,
}) => {
  return (
    <List>
      {slogas?.map((data) => (
        <ListItem
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            px: "20px",
            cursor: "pointer",
          }}
          key={data.i}
          onClick={() => handleSlogaClick(data)}
        >
          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Tiro Devanagari Hindi",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#787878",
                fontFamily: "Tiro Devanagari Hindi",
              }}
            >
              {Formatter.toDevanagariNumeral(data.i)} &nbsp;
            </span>
            <span
              style={{
                fontFamily: "Tiro Devanagari Hindi",
              }}
            >
              {data.s}
            </span>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default AlphaBetView;
