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
import CachedData, { GenericBook } from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";
import CloseIcon from "@mui/icons-material/Close";
import SearchCard from "./SearchCard";
import { useLocation, useNavigationType, useNavigate } from "react-router-dom";
import { Prefetch } from "../../Services/Common/GlobalServices";
import navigationHistory from "../../Services/Common/NavigationHistory";

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
  const availableBooks = CachedData.data?.books?.filter(
    (book: Book) => book.searchable)
          .map((book: Book) => {
            return {
              name: book.name,
              label: book.title,
            };
          });
  const [searchResult, setSearchResult] = useState<
    SearchResultData[] | undefined
  >([]);
  const searchEnabledBooks = CachedData.data?.books?.filter((book: Book) => book.searchable).map(b => b.name);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();

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

  // Track navigation history
  useEffect(() => {
    // Only push to history if we're actually on the search page
    if (window.location.pathname === '/search') {
      navigationHistory.push('/search', 'Search');
    }
  }, [location.pathname]);

  // var searchResults = getBookClass().

  const handleSearch = (searchTerm = searchParam) => {
    // Load all searchable books if not already loaded
    const loadSearchableBooks = async () => {
      const searchableBooks = CachedData.data.books?.filter((book: Book) => book.searchable);
      
      for (const book of searchableBooks || []) {
        const bookIndexKey = book.name + "index";
        const bookSummaryKey = book.name + "summary";
        
        if (!CachedData.data[bookIndexKey] || !CachedData.data[bookSummaryKey]) {
          await Prefetch.loadBookData(book.name);
        }
      }
      
      // Now perform the search
      const result = GenericBook.searchBooks(
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

    loadSearchableBooks();
  };

  return (
    <Box sx={{ padding: { lg: "22px 20%", xs: "22px 5%" } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          fontFamily="Poppins"
          fontSize="26px"
          fontWeight={600}
          color="#BC4501"
        >
          Search
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            onClick={() => navigationHistory.debugHistory()}
            variant="outlined"
            size="small"
          >
            Debug History
          </Button>
          <Button 
            onClick={() => navigationHistory.clearHistory()}
            variant="outlined"
            size="small"
            color="error"
          >
            Clear History
          </Button>
        </Box>
      </Box>
      <Stack direction="row" mt={3} spacing={2}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          hiddenLabel
          size="small"
          sx={{ width: "75%", fontSize: "1.1em" }}
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
            fontSize:"1em",
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
      <Box 
        sx={{ 
          mt: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <StyledChip
            sx={{ fontSize:"1.1em" }}
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
            sx={{ fontSize:"1.1em" }}
            label={item.label}
            selected={selectedOption == item.name}
            disabled={!searchEnabledBooks.includes(item.name)}
            onClick={() => {
              setSelectedOption(item.name);
            }}
            key={item.name}
          />
        ))}
      </Box>
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
