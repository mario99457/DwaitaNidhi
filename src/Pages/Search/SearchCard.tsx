import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";
import { SearchResultData } from "./index";
import Parser from "html-react-parser";
import { useNavigate } from "react-router-dom";

interface SearchCardProps extends SearchResultData {
  isMobile: boolean;
  searchParam: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  title,
  content,
  bookName,
  datanav,
  isMobile,
  searchParam,
}) => {
  const navigate = useNavigate();

  const handleSearchResultClick = () => {
    sessionStorage.setItem("search", searchParam);
    navigate(datanav);
  };

  return (
    <Card
      sx={{
        width: "100%",
        bgcolor: "#F4F2F2",
        borderRadius: "9px",
        pr: {
          lg: "5%",
        },
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            fontSize="1.5em"
            lineHeight="37px"
            fontWeight="400"
            color="#A74600"
            className="ellipsis"
          >
            {title}
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "#0085FF",
              fontSize: "1.1em",
              border: "1px solid #D4D2D2",
              borderRadius: "5px",
              textTransform: "none",
              background: "#FFFFFF",
              flexShrink: 0,
              alignItems: "flex-start",
              height: "33px",
            }}
            onClick={handleSearchResultClick}
          >
            read more...
          </Button>
        </Stack>
        <Typography
          fontSize="1.2em"
          color="#616161"
          lineHeight="21px"
          fontWeight="400"
          mt={1}
        >
          {bookName}
        </Typography>
        <div className="search-card-content">{Parser(content)}</div>
      </CardContent>
    </Card>
  );
};

export default SearchCard;
