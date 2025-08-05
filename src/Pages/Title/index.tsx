import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CachedData, { GenericBook, Prefetch } from "../../Services/Common/GlobalServices";
import navigationHistory from "../../Services/Common/NavigationHistory";
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
import AudioPlayer from "../Details/AudioPlayer";
import SearchBox from "../../Components/SearchBox";

const TitlePage = () => {
  const { bookName } = useParams();
  const [selectedView, setSelectedView] = useState("list");
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBook, setSlectedBook] = useState<Book | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchResult, setSearchResult] = useState<any[] | boolean>(false);
  const { state, dispatch } = useAppData();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [commentaryScript, setCommentaryScript] = useState<string>(() => getScriptPreference());
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [isScrollRestored, setIsScrollRestored] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false);

  // Track navigation history
  useEffect(() => {
    navigationHistory.push(window.location.pathname, selectedBook?.title || 'Title Index');
  }, [selectedBook]);

  const handleTitleClick = (selectedTitle: Title) => {
    // Save current state before navigating with proper scroll detection
    const getScrollPosition = () => {
      // Find the main scrollable container (MuiBox)
      const scrollableContainers = document.querySelectorAll('div[class*="MuiBox-root"]');
      let mainScrollContainer: Element | null = null;
      let maxScrollTop = 0;
      
      scrollableContainers.forEach(container => {
        const style = window.getComputedStyle(container);
        if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
          if (container.scrollTop > maxScrollTop) {
            maxScrollTop = container.scrollTop;
            mainScrollContainer = container;
          }
        }
      });
      
      // Return the scroll position from the main container
      return maxScrollTop;
    };
    
    // Get scroll position from the main container
    const scrollY = getScrollPosition();
    
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
      scrollY: scrollY,
      documentHeight: documentHeight,
      viewportHeight: window.innerHeight,
      timestamp: Date.now()
    };
    localStorage.setItem('titleIndexState', JSON.stringify(currentState));
    
    // Track navigation to details page
    const detailsPath = `/${bookName}/${selectedTitle.i}`;
    navigationHistory.push(detailsPath, selectedTitle.s || 'Details');
    navigate(detailsPath);
  };

  const handleSearch = (searchTerm: string) => {
    const result = GenericBook.searchBook(searchTerm);
    setSearchResult(result);
    setSelectedView("search");
  };

  // Wrapper to handle SearchResult type for SearchView
  const handleSearchResultClick = (selectedResult: any) => {
    console.log('Search result clicked:', selectedResult);
    console.log('Available titles:', GenericBook.allTitles?.length);
    
    // SearchResult has i property which is the title ID
    const found = GenericBook.allTitles?.find((t: any) => {
      console.log('Comparing:', t.i, 'with', selectedResult.i, 'Type:', typeof t.i, typeof selectedResult.i);
      return t.i === selectedResult.i;
    });
    
    console.log('Found title:', found);
    
    if (found) {
      console.log('Navigating to title:', found.i);
      handleTitleClick(found);
    } else {
      console.error('Title not found for search result:', selectedResult);
      // Fallback: try to navigate directly with the titlenum
      if (selectedResult.i) {
        console.log('Attempting direct navigation with title ID:', selectedResult.i);
        navigate(`/${bookName}/${selectedResult.i}`);
      }
    }
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
        } else {
          // If navigating to a different book, explicitly scroll to top
          const scrollToTop = () => {
            // Find the main scrollable container (MuiBox)
            const scrollableContainers = document.querySelectorAll('div[class*="MuiBox-root"]');
            let mainScrollContainer: Element | null = null;
            
            scrollableContainers.forEach(container => {
              const style = window.getComputedStyle(container);
              if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
                if (container.scrollHeight > container.clientHeight) {
                  mainScrollContainer = container;
                }
              }
            });

            if (mainScrollContainer) {
              (mainScrollContainer as HTMLElement).scrollTop = 0;
            } else {
              // Fallback to window scroll
              window.scrollTo(0, 0);
            }
          };

          // Try immediate scroll to top
          scrollToTop();
          
          // Also try with delays to ensure DOM is ready
          setTimeout(scrollToTop, 10);
          setTimeout(scrollToTop, 50);
          setTimeout(scrollToTop, 100);
        }
      } catch (error) {
        console.log('Error restoring title index state:', error);
      }
    } else {
      // No saved state, ensure we're at the top
      const scrollToTop = () => {
        // Find the main scrollable container (MuiBox)
        const scrollableContainers = document.querySelectorAll('div[class*="MuiBox-root"]');
        let mainScrollContainer: Element | null = null;
        
        scrollableContainers.forEach(container => {
          const style = window.getComputedStyle(container);
          if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
            if (container.scrollHeight > container.clientHeight) {
              mainScrollContainer = container;
            }
          }
        });

        if (mainScrollContainer) {
          (mainScrollContainer as HTMLElement).scrollTop = 0;
        } else {
          // Fallback to window scroll
          window.scrollTo(0, 0);
        }
      };

      // Try immediate scroll to top
      scrollToTop();
      
      // Also try with delays to ensure DOM is ready
      setTimeout(scrollToTop, 10);
      setTimeout(scrollToTop, 50);
      setTimeout(scrollToTop, 100);
    }
  }, [bookName]);

  // Handle navigation state from Details page
  useEffect(() => {
    if (location.state && typeof location.state === 'object') {
      const { view, fromDetails } = location.state as { view?: string; fromDetails?: boolean };

      if (fromDetails && view) {
        // Set the view that was passed from Details page
        setSelectedView(view);

        // Clear the state to prevent it from being used again
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, navigate, location.pathname]);

  // Immediate scroll restoration to prevent flash to top - ONLY when coming from details
  useEffect(() => {
    // Only restore scroll if we're coming from details page
    const isComingFromDetails = location.state && typeof location.state === 'object' && 
      (location.state as any).fromDetails === true;
    
    if (!isComingFromDetails) {
      // For non-details navigation, show content immediately
      setIsScrollRestored(true);
      return;
    }

    const savedState = localStorage.getItem('titleIndexState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.bookName === bookName && (Date.now() - state.timestamp) < 3600000 && state.scrollY > 0) {
          // Simple scroll restoration with minimal delays
          const restoreScroll = () => {
            const scrollableContainers = document.querySelectorAll('div[class*="MuiBox-root"]');
            let mainScrollContainer: Element | null = null;
            
            scrollableContainers.forEach(container => {
              const style = window.getComputedStyle(container);
              if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
                if (container.scrollHeight > container.clientHeight) {
                  mainScrollContainer = container;
                }
              }
            });

            if (mainScrollContainer) {
              (mainScrollContainer as HTMLElement).scrollTop = state.scrollY;
            } else {
              // Fallback to window scroll
              window.scrollTo(0, state.scrollY);
            }
          };

          // Try restoration with minimal delays
          restoreScroll();
          setTimeout(restoreScroll, 50);
          
          // Show content after scroll restoration
          setTimeout(() => {
            setIsScrollRestored(true);
          }, 100);
        } else {
          setIsScrollRestored(true);
        }
      } catch (error) {
        console.log('Error restoring scroll position:', error);
        setIsScrollRestored(true);
      }
    } else {
      setIsScrollRestored(true);
    }
  }, [bookName, location.state]);

  // Separate effect for scroll restoration after view is set - ONLY when coming from details
  useEffect(() => {
    // Only restore scroll if we're coming from details page
    const isComingFromDetails = location.state && typeof location.state === 'object' && 
      (location.state as any).fromDetails === true;
    
    if (!isComingFromDetails) {
      return;
    }

    const savedState = localStorage.getItem('titleIndexState');
    if (savedState && selectedView && !hasRestoredScroll) {
      try {
        const state = JSON.parse(savedState);
        if (state.bookName === bookName && (Date.now() - state.timestamp) < 3600000) {
          // Simple scroll restoration
          const restoreScrollPosition = () => {
            if (!state.scrollY || state.scrollY <= 0 || isUserScrolling) {
              return;
            }
            
            // Find the main scrollable container (MuiBox)
            const scrollableContainers = document.querySelectorAll('div[class*="MuiBox-root"]');
            let mainScrollContainer: Element | null = null;

            scrollableContainers.forEach(container => {
              const style = window.getComputedStyle(container);
              if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
                if (container.scrollHeight > container.clientHeight) {
                  mainScrollContainer = container;
                }
              }
            });

            if (mainScrollContainer) {
              (mainScrollContainer as HTMLElement).scrollTop = state.scrollY;
              setHasRestoredScroll(true);
            } else {
              // Fallback to window scroll
              window.scrollTo(0, state.scrollY);
              setHasRestoredScroll(true);
            }
          };

          // Try restoration with minimal delays
          setTimeout(restoreScrollPosition, 200);
          setTimeout(restoreScrollPosition, 500);
        }
      } catch (error) {
        console.log('Error in robust scroll restoration:', error);
      }
    }
  }, [selectedView, bookName, hasRestoredScroll, isUserScrolling, location.state]);



  useEffect(() => {
    setCommentaryScript(getScriptPreference());
    // Reset scroll restoration flags when book changes
    setHasRestoredScroll(false);
    setIsUserScrolling(false);
    // Don't reset isScrollRestored here to prevent flash
  }, [bookName]);

  // Track scroll position continuously
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      // Try to get scroll from main container first
      const mainContainer = document.querySelector('main') || document.querySelector('.MuiContainer-root') || document.body;
      const scrollY = mainContainer.scrollTop || 
                     window.pageYOffset || 
                     document.documentElement.scrollTop || 
                     document.body.scrollTop || 
                     window.scrollY || 
                     0;
      setCurrentScrollY(scrollY);
      
      // Mark user as scrolling
      setIsUserScrolling(true);
      
      // If user is scrolling and we haven't restored yet, mark as restored to prevent interference
      if (!hasRestoredScroll) {
        setHasRestoredScroll(true);
      }
      
      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Set timeout to mark user as not scrolling after 150ms of no scroll events
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);
      }, 150);
    };

    // Set initial scroll position
    handleScroll();
    
    // Add scroll event listener to both window and main container
    const mainContainer = document.querySelector('main') || document.querySelector('.MuiContainer-root') || document.body;
    window.addEventListener('scroll', handleScroll, { passive: true });
    mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mainContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [hasRestoredScroll]);



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
          opacity: isScrollRestored ? 1 : 0,
          transition: 'opacity 0.1s ease-in-out',
        }}
      >
        {showPlayer && (
          <AudioPlayer
            selectedTitle={selectedBook as any}
            handleClosePlayer={() => {
              setShowPlayer(false);
              // Clear the currently playing title when closing the player
              dispatch({ type: "setCurrentlyPlayingTitle", title: null });
            }}
          />
        )}
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
              <Stack 
                direction="row" 
                spacing={{ xs: 1, md: 2 }} 
                alignItems="center"
                sx={{
                  flexWrap: 'nowrap',
                  minWidth: 'fit-content'
                }}
              >
                {/* Audio button with proper spacing */}
                {selectedBook.audio && (
                  <img
                    src="/src/assets/Play_no_track.svg"
                    alt="play"
                    style={{ 
                      cursor: "pointer",
                      marginLeft: "8px",
                    }}
                    onClick={() => setShowPlayer(true)}
                  />
                )}
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
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                    cursor: 'pointer',
                    color: selectedView === 'reader' ? '#BC4501' : '#A0A0A0',
                    background: selectedView === 'reader' ? '#FCF4CD' : 'transparent',
                    borderRadius: 1,
                    border: selectedView === 'reader' ? '2px solid #BC4501' : '2px solid transparent',
                    p: 0.5,
                  }}
                  onClick={() => setSelectedView('reader')}
                />
              </Stack>
            </Stack>

            {/* Search box - new row on mobile, inline on desktop */}
            <Box sx={{ 
              mb: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
              {isMobile ? (
                <SearchBox
                  onSearch={handleSearch}
                  placeholder={"Type in English or Devanagari"}
                  onClear={handleClearSearch}
                  isMobile={true}
                  textFieldStyle={{
                    width: '100%',
                    maxWidth: '100%'
                  }}
                />
              ) : (
                <SearchBox
                  onSearch={handleSearch}
                  placeholder={"Type in English or Devanagari"}
                  onClear={handleClearSearch}
                  isMobile={false}
                  textFieldStyle={{
                    width: '100%',
                    maxWidth: '100%'
                  }}
                />
              )}
            </Box>

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
                commentaryScript={commentaryScript || 'devanagari'}
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
