import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const AlphaBetView = () => {
  return (
    <List>
      <ListItem
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <ListItemText primary="Item 1" />
      </ListItem>
      <ListItem
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <ListItemText primary="Item 2" />
      </ListItem>
      <ListItem
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <ListItemText primary="Item 3" />
      </ListItem>
    </List>
  );
};

export default AlphaBetView;
