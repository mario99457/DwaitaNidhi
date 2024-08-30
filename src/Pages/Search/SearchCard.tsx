import { Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

interface SearchCardProps {
  title: string;
  author: string;
  bookName: string;
  content: string;
  datanav: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  title,
  author,
  content,
  bookName,
  datanav
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
            {bookName}
          </Typography>
          <div className="flex-center">
            <div className="search-card-tag">read more...</div>
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
