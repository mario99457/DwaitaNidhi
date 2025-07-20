import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CachedData, { GenericBook, Prefetch } from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";
import { Title } from "../../types/GlobalType.type";
import { useAppData } from "../../Store/AppContext";
import AlphaBetView from "./AlphaBetView";
import SearchView from "./SearchView";
import Treeview from "./Treeview";

const TitlePage = () => {
  const { bookName } = useParams();
  const [selectedView, setSelectedView] = useState("list");
  const navigate = useNavigate();
  const [selectedBook, setSlectedBook] = useState<Book | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchResult, setSearchResult] = useState<any[] | boolean>(false);
  const { state, dispatch } = useAppData();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoadingBook, setIsLoadingBook] = useState(false);

  const handleTitleClick = (selectedTitle: Title) => {
    navigate(`/${bookName}/${selectedTitle.i}`);
  };

  const handleSearch = (searchTerm: string) => {
    const result = GenericBook.searchBook(searchTerm);
    setSearchResult(result);
    setSelectedView("search");
  };

  useEffect(() => {
    const loadBookData = async () => {
      if (!bookName) return;

      const book = CachedData.data.books?.find(
        (book: Book) => book.name == bookName
      );
      
      if (book) {
        setSlectedBook(book);
        
        // Check if book data is already loaded
        const bookIndexKey = bookName + "index";
        const bookSummaryKey = bookName + "summary";
        
        if (!CachedData.data[bookIndexKey] || !CachedData.data[bookSummaryKey]) {
          setIsLoadingBook(true);
          
          // Load book data lazily
          await Prefetch.loadBookData(bookName, () => {
            setIsLoadingBook(false);
            
            // Initialize the book data
            CachedData.selectedBook = bookName;
            GenericBook.populateIndexList();
            GenericBook.populateCommenatries();
            
            dispatch({
              type: "setSelectedBook",
              book: book,
            });
          });
        } else {
          // Book data already loaded, just initialize
          CachedData.selectedBook = bookName;
          GenericBook.populateIndexList();
          GenericBook.populateCommenatries();
          
          dispatch({
            type: "setSelectedBook",
            book: book,
          });
        }
      }
    };

    loadBookData();
  }, [bookName, dispatch]);

  const handleClearSearch = () => {
    setSearchResult(false);
    setSelectedView("list");
  };

  if (isLoadingBook) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading book data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          width: {
            lg: "90%",
            xs: "100%",
          },
          background: "#FFFFFF",
          margin: "auto",
          minHeight: "100%",
          padding: { lg: "16px 38px", xs: "16px" },
        }}
      >
        {selectedBook && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: { lg: "48px", xs: "32px" },
                  fontWeight: "400",
                  color: "#BC4501",
                }}
              >
                {selectedBook.title}
              </Typography>
              {selectedBook.audio && (
                <img
                  src="/src/assets/PlayButton.svg"
                  alt="play"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPlayer(true)}
                />
              )}
            </Stack>

            {selectedView === "list" && (
              <Treeview
                handleTitleClick={handleTitleClick}
                toc={selectedBook.chapters}
                titles={GenericBook.allTitles}
                isMobile={isMobile}
              />
            )}
            {selectedView === "search" && (
              <SearchView
                titles={searchResult as any[]}
                handleTitleClick={handleTitleClick}
              />
            )}
            {selectedView === "alphabet" && (
              <AlphaBetView
                handleTitleClick={handleTitleClick}
                toc={selectedBook.chapters}
                titles={GenericBook.getIndexList}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default TitlePage;
