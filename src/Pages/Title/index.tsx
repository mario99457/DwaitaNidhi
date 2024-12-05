import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToC_Icon from "../../assets/toc.svg";
import SearchBox from "../../Components/SearchBox";
import playButton from "../../assets/PlayButton.svg";
import TreeView from "./Treeview";
import listIconSelected from "../../assets/list_selected.svg";
import alphaIcon from "../../assets/alpha.svg";
import listIcon from "../../assets/list.svg";
import alphaIconSelected from "../../assets/alpha_selected.svg";
import AlphaBetView from "./AlphaBetView";
import { Title } from "../../types/GlobalType.type";
import { Book } from "../../types/Context.type";
import CachedData, { Sutraani } from "../../Services/Common/GlobalServices";
import SearchView from "./SearchView";
import { useAppData } from "../../Store/AppContext";
import AudioPlayer from "../../Pages/Details/AudioPlayer";

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

  const handleTitleClick = (selectedTitle: Title) => {
    navigate(`/${bookName}/${selectedTitle.i}`);
  };

  const handleSearch = (searchTerm: string) => {
    const result = Sutraani.searchSutraani(searchTerm);
    setSearchResult(result);
    setSelectedView("search");
  };

  useEffect(() => {
    const book = CachedData.data.books.find(
      (book: Book) => book.name == bookName
    );
    if (book) {
      setSlectedBook(book);
    }
  }, [bookName]);

  const handleClearSearch = () => {
    setSearchResult(false);
    setSelectedView("list");
  };

  return (
    <Box
      sx={{
        width: { lg: "80%", xs: "100%" },
        background: "#FFFFFF",
        margin: "auto",
        minHeight: "100%",
        padding: {
          lg: "16px 38px",
          xs: "0",
        },
      }}
    >
      {showPlayer && (
        <AudioPlayer
          selectedTitle={CachedData.selectedBook}
          handleClosePlayer={() => setShowPlayer(false)}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: {
            xs: "20px",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "34px",
            color: "#A74600",
            fontWeight: "600",
            display: {
              lg: "block",
              xs: "none",
            },
          }}
        >
          {selectedBook?.title}
        </Typography>
        {isMobile && (
          <SearchBox
            onSearch={handleSearch}
            placeholder={"Type in English or Devanagari"}
            onClear={handleClearSearch}
            textFieldStyle={{
              width: "100%",
              borderRadius: "28px",
              marginTop: 2,
              fontFamily: "poppins",
            }}
            isMobile={true}
          />
        )}
        <Box
          sx={{ mt: "1rem", display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
          >
            <img src={ToC_Icon} width={`18px`} height={`18px`} />
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "28px",
                fontWeight: "300",
                marginLeft: "10px",
              }}
            >
              {
                CachedData.data.books.find(
                  (b) => b.name == state.selectedBook?.name
                )?.index
              }
            </Typography>
          </div>
          <Box className="search-box-wrapper">
            {!isMobile && (
              <SearchBox
                onSearch={handleSearch}
                placeholder={"Type in English or Devanagari"}
                onClear={handleClearSearch}
              />
            )}
            {/* <img src={playButton} /> */}
            <img
              src={playButton}
              style={{ cursor: "pointer" }}
              alt="play"
              onClick={() => setShowPlayer(!showPlayer)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            mt: 1,
            pointerEvents: searchResult ? "none" : "auto",
            opacity: searchResult ? 0.7 : 1,
          }}
        >
          <img
            src={selectedView == "list" ? listIconSelected : listIcon}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedView("list")}
          />
          <img
            src={selectedView == "alpha" ? alphaIconSelected : alphaIcon}
            style={{ cursor: "pointer", marginLeft: "13px" }}
            onClick={() => setSelectedView("alpha")}
          />
        </Box>
      </Box>
      <Box sx={{ mt: 2 }} className="treeview-box-wrapper">
        {selectedView == "alpha" && (
          <AlphaBetView
            handleTitleClick={handleTitleClick}
            toc={selectedBook?.chapters}
            titles={CachedData.getBookClass(bookName)?.getIndexList}
          />
        )}
        {selectedView == "list" && (
          <TreeView
            handleTitleClick={handleTitleClick}
            toc={selectedBook?.chapters}
            titles={CachedData.getBookClass(bookName || "")?.allTitles}
            isMobile={isMobile}
          />
        )}
        {selectedView == "search" && (
          <SearchView
            titles={searchResult}
            handleTitleClick={handleTitleClick}
          />
        )}
      </Box>
    </Box>
  );
};

export default TitlePage;
