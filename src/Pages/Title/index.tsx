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
import ScriptSelector, { getScriptPreference } from '../../Components/ScriptSelector';
import alphaIcon from '../../assets/alpha.svg';
import alphaSelectedIcon from '../../assets/alpha_selected.svg';
import listIcon from '../../assets/list.svg';
import listSelectedIcon from '../../assets/list_selected.svg';
import DescriptionIcon from '@mui/icons-material/Description'; // Material UI document icon
import ReaderView from './ReaderView';

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
  const [commentaryScript, setCommentaryScript] = useState<string>(() => getScriptPreference());

  const handleTitleClick = (selectedTitle: Title) => {
    navigate(`/${bookName}/${selectedTitle.i}`);
  };

  const handleSearch = (searchTerm: string) => {
    const result = GenericBook.searchBook(searchTerm);
    setSearchResult(result);
    setSelectedView("search");
  };

  // Wrapper to handle SearchResult type for SearchView
  const handleSearchResultClick = (selectedResult: any) => {
    // SearchResult has titlenum and title, but we need to find the Title object
    const found = GenericBook.allTitles.find((t: any) => t.i === selectedResult.titlenum);
    if (found) handleTitleClick(found);
  };

  useEffect(() => {
    const loadBookData = async () => {
      if (!bookName) return;

      const book = CachedData.data.books?.find(
        (book: Book) => book.name == bookName
      );
      
      if (book) {
        setSlectedBook(book);
        
        // Debug: Log chapters and titles for Mundaka
        if (book.name.toLowerCase().includes('mundaka')) {
          console.log('MUNDAKA DEBUG: selectedBook.chapters:', JSON.stringify(book.chapters, null, 2));
          setTimeout(() => {
            console.log('MUNDAKA DEBUG: GenericBook.allTitles:', JSON.stringify(GenericBook.allTitles, null, 2));
          }, 2000); // Wait for titles to load
        }
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

  useEffect(() => {
    setCommentaryScript(getScriptPreference());
  }, [bookName]);

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
            <ScriptSelector script={commentaryScript} setScript={setCommentaryScript} />
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
              <Stack direction="row" spacing={2} alignItems="center">
                <img
                  src={selectedView === 'list' ? listSelectedIcon : listIcon}
                  alt="Index View"
                  style={{
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    border: selectedView === 'list' ? '2px solid #BC4501' : '2px solid transparent',
                    borderRadius: 4,
                    background: selectedView === 'list' ? '#FCF4CD' : 'transparent',
                    padding: 2,
                  }}
                  onClick={() => setSelectedView('list')}
                />
                <img
                  src={selectedView === 'alphabet' ? alphaSelectedIcon : alphaIcon}
                  alt="Sort by Alphabets"
                  style={{
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    border: selectedView === 'alphabet' ? '2px solid #BC4501' : '2px solid transparent',
                    borderRadius: 4,
                    background: selectedView === 'alphabet' ? '#FCF4CD' : 'transparent',
                    padding: 2,
                  }}
                  onClick={() => setSelectedView('alphabet')}
                />
                <DescriptionIcon
                  sx={{
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    color: selectedView === 'reader' ? '#BC4501' : '#A0A0A0',
                    background: selectedView === 'reader' ? '#FCF4CD' : 'transparent',
                    borderRadius: 1,
                    border: selectedView === 'reader' ? '2px solid #BC4501' : '2px solid transparent',
                    p: 0.5,
                  }}
                  onClick={() => setSelectedView(selectedView === 'reader' ? 'list' : 'reader')}
                />
                {selectedBook.audio && (
                  <img
                    src="/src/assets/PlayButton.svg"
                    alt="play"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPlayer(true)}
                  />
                )}
              </Stack>
            </Stack>

            {selectedView === "list" && (
              <Treeview
                handleTitleClick={handleTitleClick}
                toc={selectedBook.chapters}
                titles={GenericBook.allTitles}
                isMobile={isMobile}
                commentaryScript={commentaryScript || 'devanagari'}
              />
            )}
            {selectedView === "search" && (
              <SearchView
                titles={searchResult as any[]}
                handleTitleClick={handleSearchResultClick}
              />
            )}
            {selectedView === "alphabet" && (
              <AlphaBetView
                handleTitleClick={handleTitleClick}
                toc={selectedBook.chapters}
                titles={GenericBook.getIndexList}
                allTitles={GenericBook.allTitles}
              />
            )}
            {selectedView === "reader" && (
              <ReaderView
                titles={GenericBook.allTitles}
                commentaryScript={commentaryScript || 'devanagari'}
                toc={selectedBook.chapters}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default TitlePage;
