import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import tocData from "./treeData.json";

const AlphaBetView = () => {
  return (
    <List>
      {tocData.data.map((data) => (
        <ListItem
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            px: "20px",
          }}
          key={data.i}
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
              {data.i} &nbsp;
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
