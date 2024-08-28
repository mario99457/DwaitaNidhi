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
import { Sloga } from "../../types/GlobalType.type";
import { Book } from "../../types/Context.type";
import CachedData, {
  getBookClass,
  Sutraani,
} from "../../Services/Common/GlobalServices";
import SearchView from "./SearchView";

const TitlePage = () => {
  const { bookName } = useParams();
  const [selectedView, setSelectedView] = useState("list");
  const navigate = useNavigate();
  const [selectedBook, setSlectedBook] = useState<Book | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchResult, setSearchResult] = useState<any[] | boolean>(false);

  const handleSlogaClick = (selectedSloga: Sloga) => {
    navigate(`/${bookName}/${selectedSloga.i}`);
  };

  const handleSearch = (searchTerm: string) => {
    const result = Sutraani.searchSutraani(searchTerm);
    setSearchResult(result);
    setSelectedView("search");
    // console.log("inside search", result);
  };

  useEffect(() => {
    const book = CachedData.data.books.find(
      (book: Book) => book.name == bookName
    );
    if (book) {
      setSlectedBook(book);
    }
  }, [bookName]);

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
            fontFamily: "Poppins",
            fontSize: "26px",
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
            onSearch={Sutraani.searchSutraani}
            placeholder={"Type in English or Devanagari"}
            textFieldStyle={{
              width: "100%",
              borderRadius: "28px",
              marginTop: 2,
            }}
            isMobile={true}
          />
        )}
        <Container
          sx={{
            backgroundColor: "#E9E9E9",
            padding: "20px 44px 13px 21px",
            borderRadius: "6px",
            marginTop: "16px",
            color: "#BC4501",
            fontFamily: "Vesper Libre",
            fontSize: "18px",
          }}
        >
          इको गुणवृद्धी ॥१.१.३ ॥ इग्ग्रहणं किमर्थम् । ॥
          इग्ग्रहणमात्सन्ध्यक्षरव्यञ्ञ्जननिवृत्त्यर्थम् ॥ इग्ग्रहणं क्रियते ।
          किं प्रयोजनम् । आकारनिवृत्त्यर्थं सन्ध्यक्षरनिवृत्त्यर्थं
          व्यञ्ञ्जननिवृत्त्यर्थं च । आकारनिवृत्त्यर्थं तावत् - याता वाता ।
          आकारस्य गुणः प्राप्नोति । इग्ग्र्हणान्न भवति ।
          सन्ध्यक्षरनिवृत्त्यर्थम्
        </Container>
        <Box
          sx={{ mt: "3rem", display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
          >
            <img src={ToC_Icon} width={`18px`} height={`18px`} />
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "Poppins",
                fontSize: "22px",
                fontWeight: "300",
                marginLeft: "10px",
              }}
            >
              सूत्रावलि
            </Typography>
          </div>
          <Box className="search-box-wrapper">
            {!isMobile && (
              <SearchBox
                onSearch={handleSearch}
                placeholder={"Type in English or Devanagari"}
              />
            )}
            <img src={playButton} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
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
            handleSlogaClick={handleSlogaClick}
            toc={selectedBook?.chapters}
            slogas={getBookClass(bookName)?.getSutraList}
          />
        )}
        {selectedView == "list" && (
          <TreeView
            handleSlogaClick={handleSlogaClick}
            toc={selectedBook?.chapters}
            slogas={getBookClass(bookName || "")?.allSutras}
          />
        )}
        {selectedView == "search" && (
          <SearchView
            slogas={searchResult}
            handleSlogaClick={handleSlogaClick}
          />
        )}
      </Box>
    </Box>
  );
};

export default TitlePage;
