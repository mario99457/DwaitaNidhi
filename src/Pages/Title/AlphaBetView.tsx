import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Title } from "../../types/GlobalType.type";
import { Chapters } from "../../types/Context.type";
import Formatter from "../../Services/Common/Formatter";

interface ListViewProps {
  handleTitleClick: (selectedTitle: Title) => void;
  toc: Chapters[] | undefined;
  titles: ((t?: any) => any) | undefined;
}

const AlphaBetView: React.FC<ListViewProps> = ({
  handleTitleClick,
  titles,
}) => {
  return (
    <List>
      {titles("z")?.titles.map((data: Title) => (
        <ListItem
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            px: "20px",
            cursor: "pointer",
            overflow: "auto",
          }}
          key={data.i}
          onClick={() => handleTitleClick(data)}
        >
          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Vesper Libre",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#787878",
                fontFamily: "Vesper Libre",
                flexShrink: "0",
              }}
            >
              {Formatter.toDevanagariNumeral(`${data?.a}.${data?.p}.${data?.n}`)} &nbsp;
            </span>
            <span
              style={{
                fontFamily: "Vesper Libre",
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
