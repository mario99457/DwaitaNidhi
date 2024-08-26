import { Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

interface SearchCardProps {
  name: string;
  author: string;
  lastVisited: string;
  content: string;
  path: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  name,
  author,
  lastVisited,
  content,
}) => {
  return (
    <Card
      sx={{
        width: "100%",
        bgcolor: "#F4F2F2",
        borderRadius: "9px",
        pr: "5%",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            fontSize="18px"
            lineHeight="37px"
            fontWeight="400"
            color="#A74600"
          >
            {name}
          </Typography>
          <div className="flex-center">
            <Typography fontFamily="Poppins" fontSize="12px" color="#818080">
              Last Visited: {lastVisited}
            </Typography>
            <div className="search-card-tag">उपयाति</div>
          </div>
        </Stack>
        <Typography
          fontSize="14px"
          color="#616161"
          lineHeight="21px"
          fontWeight="400"
          mt={1}
        >
          {author}
        </Typography>
        <div className="search-card-content">{content}</div>
      </CardContent>
    </Card>
  );
};

export default SearchCard;
