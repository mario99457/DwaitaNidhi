import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import CachedData, { Sutraani } from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";
import CloseIcon from "@mui/icons-material/Close";
import SearchCard from "./SearchCard";
import { useLocation, useNavigationType } from "react-router-dom";

export interface SearchResultData {
  title: string;
  author: string;
  bookName: string;
  content: string;
  datanav: string;
}

export const StyledChip = styled(Chip)<{ selected: boolean }>(
  ({ /*theme,*/ selected }) => ({
    background: selected ? "#FFC683" : "transparent",
    ":hover": {
      bgcolor: selected ? "#FFC683" : "#0000000a",
    },
    border: selected ? "none" : "1px solid #D5D5D5",
  })
);

const SearchPage = () => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [searchParam, setSearchParam] = useState("");
  const availableBooks = CachedData.data.books.map((book: Book) => {
    return {
      name: book.name,
      label: book.title,
    };
  });
  const [searchResult, setSearchResult] = useState<
    SearchResultData[] | undefined
  >([]);
  const searchEnabledBooks = ["sutraani"];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const storedSearch = sessionStorage.getItem("search");
    if (
      navigationType == "PUSH" &&
      location.state?.from &&
      location.state?.from == "top-bar"
    ) {
      setSearchParam("");
      setSearchResult([]);
      sessionStorage.removeItem("search");
    } else if (storedSearch) {
      setSearchParam(storedSearch);
      handleSearch(storedSearch);
    }
  }, []);

  // var searchResults = getBookClass().

  const handleSearch = (searchTerm = searchParam) => {
    const result = CachedData.getBookClass("sutraani")?.searchBooks(
      searchTerm,
      selectedOption
    );
    const searchData = result?.map((item: any) => {
      const data = {} as SearchResultData;
      data.title = item.name;
      data.author = item.commentaries[0]?.author;
      data.content = item.commentaries[0]?.fragment;
      data.bookName = item.commentaries[0]?.name;
      data.datanav = item.commentaries[0]?.datanav;
      return data;
    });
    setSearchResult(searchData);
  };

  return (
    <Box sx={{ padding: { lg: "22px 20%", xs: "22px 5%" } }}>
      <Typography
        fontFamily="Poppins"
        fontSize="26px"
        fontWeight={600}
        color="#BC4501"
      >
        Search
      </Typography>
      <Stack direction="row" mt={3} spacing={2}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          hiddenLabel
          size="small"
          sx={{ width: "75%" }}
          value={searchParam}
          onChange={(e) => {
            setSearchParam(e.target.value);
          }}
          autoFocus
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  cursor: "pointer",
                  display: searchParam ? "flex" : "none",
                }}
                onClick={() => {
                  setSearchParam("");
                  setSearchResult([]);
                }}
              >
                <CloseIcon sx={{ color: "#BB0E0E" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          sx={{
            color: "#FFFFFF",
            background: "#BC4501",
            "&:hover": {
              bgcolor: "#BC4501",
            },
          }}
          onClick={() => handleSearch()}
        >
          GO
        </Button>
      </Stack>
      <Stack direction="row" mt={3} spacing={2}>
        <StyledChip
          label={`All ${
            searchResult?.length ? `(${searchResult.length})` : ""
          }`}
          selected={selectedOption == "all"}
          onClick={() => {
            setSelectedOption("all");
          }}
        />

        {availableBooks.map((item: any) => (
          <StyledChip
            label={item.label}
            selected={selectedOption == item.name}
            disabled={!searchEnabledBooks.includes(item.name)}
            onClick={() => {
              setSelectedOption(item.name);
            }}
            key={item.name}
          />
        ))}
      </Stack>
      <Stack direction="column" mt={3} spacing={2}>
        {searchResult?.map((item: SearchResultData, index: number) => (
          <SearchCard
            key={`${item.bookName} ${index}`}
            {...item}
            isMobile={isMobile}
            searchParam={searchParam}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SearchPage;
