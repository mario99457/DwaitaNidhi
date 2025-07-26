import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Title } from "../../types/GlobalType.type";
import { Chapters } from "../../types/Context.type";
import Formatter from "../../Services/Common/Formatter";

interface ListViewProps {
  handleTitleClick: (selectedTitle: Title) => void;
  toc: Chapters[] | undefined;
  titles: ((t?: any) => any) | undefined;
  allTitles?: Title[];
}

const AlphaBetView: React.FC<ListViewProps> = ({
  handleTitleClick,
  titles,
  allTitles,
}) => {
  const titleList = titles && titles("z")?.titles && titles("z")?.titles.length > 0
    ? titles("z")?.titles
    : allTitles || [];
  return (
    <List>
      {titleList.map((data: Title) => (
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
              fontSize: "22px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#787878",
                flexShrink: "0",
              }}
            >
              {data?.a && data?.n
                ? Formatter.toDevanagariNumeral(`${data?.a}${data?.p ? `.${data?.p}` : ""}.${data?.n}`)
                : Formatter.toDevanagariNumeral(data.n)
              }{" "}
              &nbsp;
            </span>
            <span
              style={{
                fontSize: "22px",
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
