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
    // Save current state before navigating
    const currentScrollY = Math.max(0, window.scrollY);
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    const currentState = {
      view: selectedView,
      bookName: bookName,
      scrollY: currentScrollY,
      documentHeight: documentHeight,
      viewportHeight: window.innerHeight,
      timestamp: Date.now()
    };
    console.log('Saving state:', {
      scrollY: currentState.scrollY,
      documentHeight: currentState.documentHeight,
      viewportHeight: currentState.viewportHeight,
      view: currentState.view
    });
    localStorage.setItem('titleIndexState', JSON.stringify(currentState));
    
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

  // Restore saved view state when returning to title index
  useEffect(() => {
    const savedState = localStorage.getItem('titleIndexState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        // Only restore if it's for the same book and not too old (within 1 hour)
        if (state.bookName === bookName && (Date.now() - state.timestamp) < 3600000) {
          setSelectedView(state.view);
        }
      } catch (error) {
        console.log('Error restoring title index state:', error);
      }
    }
  }, [bookName]);

  // Separate effect for scroll restoration after view is set
  useEffect(() => {
    const savedState = localStorage.getItem('titleIndexState');
    if (savedState && selectedView) {
      try {
        const state = JSON.parse(savedState);
        if (state.bookName === bookName && (Date.now() - state.timestamp) < 3600000) {
         // Robust scroll restoration with multiple strategies
         const restoreScrollPosition = () => {
           if (!state.scrollY || state.scrollY <= 0) return;
           
           console.log('Attempting to restore scroll to:', state.scrollY);
           
           // Strategy 1: Direct scroll
           window.scrollTo(0, state.scrollY);
           
           // Strategy 2: After a delay, check and retry if needed
           setTimeout(() => {
             const currentScroll = window.scrollY;
             console.log('Current scroll:', currentScroll, 'Target:', state.scrollY);
             
             if (Math.abs(currentScroll - state.scrollY) > 20) {
               console.log('Retrying scroll restoration...');
               // Strategy 3: Force scroll with different method
               document.documentElement.scrollTop = state.scrollY;
               document.body.scrollTop = state.scrollY;
               window.scrollTo(0, state.scrollY);
             }
           }, 300);
           
           // Strategy 4: Final attempt after content is definitely loaded
           setTimeout(() => {
             const currentScroll = window.scrollY;
             if (Math.abs(currentScroll - state.scrollY) > 20) {
               console.log('Final scroll restoration attempt...');
               window.scrollTo({ top: state.scrollY, behavior: 'auto' });
             }
           }, 1000);
         };
         
         // Wait for content to be ready, then restore scroll
         const waitForContentAndRestore = () => {
           // Check multiple indicators that content is loaded
           const contentIndicators = [
             document.querySelector('[data-title-id]'),
             document.querySelector('.MuiTypography-root'),
             document.querySelector('.MuiBox-root'),
             document.body.scrollHeight > 200,
             document.readyState === 'complete'
           ];
           
           const hasContent = contentIndicators.some(indicator => indicator);
           
           if (hasContent) {
             console.log('Content detected, restoring scroll...');
             restoreScrollPosition();
           } else {
             console.log('Content not ready, waiting...');
             setTimeout(waitForContentAndRestore, 200);
           }
         };
         
         // Start the process with multiple attempts
         setTimeout(waitForContentAndRestore, 100);
         setTimeout(waitForContentAndRestore, 500);
         setTimeout(waitForContentAndRestore, 1000);
         setTimeout(waitForContentAndRestore, 2000);
        }
      } catch (error) {
        console.log('Error restoring scroll position:', error);
      }
    }
  }, [selectedView, bookName]);

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
                handleTitleClick={handleTitleClick}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default TitlePage;
