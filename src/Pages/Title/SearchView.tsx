import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { SearchResult } from "../../types/GlobalType.type";
// import Formatter from "../../Services/Common/Formatter";
import Parser from "html-react-parser";

interface SearchViewProps {
  handleTitleClick: (selectedTitle: SearchResult) => void;
  titles: any[];
}

const SearchView: React.FC<SearchViewProps> = ({
  handleTitleClick,
  titles,
}) => {
  return (
    <>
      {titles.length ? (
        <List>
          {titles.map((data: SearchResult) => (
            <ListItem
              sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                px: "20px",
                cursor: "pointer",
                overflow: "auto",
              }}
              key={data.sutranum}
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
                  {data.sutranum}&nbsp;
                  {/* {Formatter.toDevanagariNumeral(data.i)} &nbsp; */}
                </span>
                <span
                  style={{
                    fontFamily: "Vesper Libre",
                  }}
                >
                  {Parser(data.sutra)}
                </span>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      ) : (
        <>
          <Typography fontFamily="poppins" textAlign="center">
            No Matching sutras found
          </Typography>
        </>
      )}
    </>
  );
};

export default SearchView;
