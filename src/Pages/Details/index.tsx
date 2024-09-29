import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Container,
  FormControl,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pencilEdit from "../../assets/pencil_edit.svg";
import ToC_Icon from "../../assets/toc.svg";
import prevButton from "../../assets/prev_button.svg";
import nextButton from "../../assets/next_button.svg";
import playButton from "../../assets/Play_no_track.svg";
import pauseButton from "../../assets/pauseButton.svg";
import Divider from "@mui/material/Divider";
// import SearchBox from "../../Components/SearchBox";
import DetailsContent from "./DetailsContent";
import DrawerMenu from "./DrawerMenu";
import CachedData from "../../Services/Common/GlobalServices";
import { Title } from "../../types/GlobalType.type";
import Formatter from "../../Services/Common/Formatter";
import Parser from "html-react-parser";
// import { Howl, Howler } from "howler";
import ReactHowler from "react-howler";
import testAudio from "../../assets/audio/small.mp3";
import AudioPlayer from "./AudioPlayer";
import useToken from '../../Services/Auth/useToken'; 

interface Commentary {
  name: string;
  author: string;
  key: string;
  lang: string;
  number: string;
  hidden: boolean;
  audio: boolean;
}
const DetailPage = () => {
  const { titleNumber, bookName, commentary } = useParams();
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const selectedKey = useRef("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { creds } = useToken();
  const [playAudio, setPlayAudio] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const BookClass = CachedData.getBookClass(bookName || "");

  const availableLanguages = [
    {
      id: "k",
      label: "ಕನ್ನಡ",
    },
    {
      id: "e",
      label: "English",
    }
  ];
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(
    availableLanguages[0].id
  );
  const [selectedCommentary, setSelectedCommentary] = useState<{
    [key: string]: any;
  }>({});
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const title = BookClass?.allTitles?.find(
      (title: Title) => title.i == titleNumber
    );
    if (title) {
      setSelectedTitle(title);
    }
  }, [titleNumber]);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };

  const handleCommentaryChange = (key: string) => {
    setSelectedCommentary((prevState) => ({
      ...prevState,
      [key]: { expanded: true },
    }));
    selectedKey.current = key;
  };

  useEffect(() => {
    if (commentary) {
      handleCommentaryChange(commentary);
    }
  }, [commentary]);

  useEffect(() => {
    if (selectedKey.current) {
      setTimeout(() => {
        const section = document.querySelector(`#${selectedKey.current}`);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [selectedCommentary]);

  const handleNavigateTitle = (navigation: string) => {
    if (navigation == "next" && selectedTitle && selectedTitle.srno) {
      const nextTitle: any = BookClass?.getRightArrow(selectedTitle);
      navigate(`/${bookName}/${nextTitle?.i}`);
    }
    if (navigation == "prev" && selectedTitle && selectedTitle.srno) {
      const prevTitle: any = BookClass?.getLeftArrow(selectedTitle);
      navigate(`/${bookName}/${prevTitle?.i}`);
    }
  };

  const handlePlayPause = () => {
    setPlayAudio((prevState) => !prevState);
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href={`/${bookName}`}
      onClick={() => {}}
    >
      <Typography key="2" color="text.primary" fontFamily={"Vesper Libre"}>
        Home
      </Typography>
    </Link>,
    <Typography key="3" color="#A74600" fontFamily={"Vesper Libre"}>
      ब्र.सू.{" "}
      {Formatter.toDevanagariNumeral(
        `${selectedTitle?.a}${
          selectedTitle?.p !== 0 ? "." + selectedTitle?.p : ""
        }.${selectedTitle?.n}`
      )}
    </Typography>,
  ];

  return (
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showPlayer && (
        <AudioPlayer
          selectedTitle={selectedTitle}
          handleClosePlayer={() => setShowPlayer(false)}
        />
      )}
      {selectedTitle ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 0,
              pb: 4,
              borderBottom: "1px solid #BDBDBD",
            }}
          >
            <div></div>
            {/* <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              {breadcrumbs}
            </Breadcrumbs> */}
            <div
              style={{
                display: "flex",
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={() => setOpenDrawer(true)}
              role="button"
            >
              <img src={ToC_Icon} width={`18px`} height={`18px`} />
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "20px",
                  fontWeight: "400",
                  marginLeft: "10px",
                }}
              >
                {
                  CachedData.data.books.find(
                    (b) => b.name == CachedData.data.selectedBook
                  )?.index
                }
              </Typography>
            </div>
          </Box>
          <Box className="title-box-wrapper" sx={{ pt: 2 }}>
            <Box sx={{ display: "flex" }}>
              <img
                src={prevButton}
                alt="previous"
                style={{
                  visibility: selectedTitle?.srno == 1 ? "hidden" : "visible",
                  cursor: "pointer",
                }}
                onClick={() => handleNavigateTitle("prev")}
              />

              <Container
                sx={{
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontSize="34px" lineHeight="39.9px" color="#BC4501">
                  {Parser(Formatter.formatVyakhya(selectedTitle?.s))}
                </Typography>
              </Container>

              <img
                src={nextButton}
                alt="next"
                style={{
                  cursor: "pointer",
                  visibility:
                    BookClass?.allTitles &&
                    selectedTitle &&
                    selectedTitle?.srno <= BookClass?.allTitles.length
                      ? "visible"
                      : "hidden",
                }}
                onClick={() => handleNavigateTitle("next")}
              />
            </Box>
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 4, mb: 2 }}
          >
            <Typography
              fontSize="24px"
              fontWeight="400"
              color="#969696"
            >
              ब्र.सू.{" "}
              {Formatter.toDevanagariNumeral(
                `${selectedTitle?.a}.${selectedTitle?.p}.${selectedTitle?.n}`
              )}
            </Typography>
            <ReactHowler
              src={[testAudio]}
              playing={playAudio}
              onEnd={() => setPlayAudio(false)}
            />
            <img
              src={playAudio ? pauseButton : playButton} // Conditionally render play/pause icon
              alt={playAudio ? "pause" : "play"}
              style={{ cursor: "pointer" }}
              onClick={handlePlayPause} // Use a single handler for both play and pause
            />
          </Stack>
          <Divider sx={{ borderBottom: "1px solid #BDBDBD" }} />
          <Box
            sx={{
              mt: 2,
              background: "#FCF4CD",
              borderRadius: "6px",
              minHeight: "100px",
              padding: { lg: "10px 36px 10px 20px", xs: "10px 20px 10px 20px" },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                fontFamily="Vesper Libre"
                fontSize="24px"
                fontWeight="400"
                color="#A74600"
              >
                संक्षेपार्थः
              </Typography>
              <div
                className={`d-flex ${
                  isMobile ? "align-items-baseline" : "align-items-center"
                }`}
              >
                {creds?.token ?
                  <img 
                    src={pencilEdit} 
                    alt="edit" 
                    style={{ marginRight: "3rem" }}
                    onClick={() => editContent()} 
                  /> : <></>}
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    hiddenLabel
                  >
                    {availableLanguages.map((language) => (
                      <MenuItem key={language.id} value={language.id}>
                        {language.label}
                      </MenuItem>
                    ))}
                  </Select>               
                </FormControl>              
              </div>
            </Stack>
            <Typography
              fontFamily="Vesper Libre"
              fontSize="18px"
              color="#BC4501"
              lineHeight="33px"
              whiteSpace="pre-line"
              // sx={{
              //   display: "-webkit-box",
              //   WebkitLineClamp: showFullSummary ? "unset" : "3",
              //   WebkitBoxOrient: "vertical",
              //   overflow: "hidden",
              //   textOverflow: "ellipsis",
              // }}
            >
              {Parser(
                BookClass?.getSummary(selectedTitle?.i)
                  ? BookClass?.getSummary(selectedTitle?.i)[selectedLanguage]
                  : ""
              )}
            </Typography>
            {/* {!showFullSummary && (
              <Typography
                fontFamily="poppins"
                fontSize="14px"
                fontWeight={400}
                lineHeight="23.94px"
                sx={{
                  textAlign: "right",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
                onClick={() => setShowFullSummary((prevState) => !prevState)}
              >
                {showFullSummary ? "Read Less" : "Read More"}
              </Typography>
            )} */}
          </Box>
          <Stack
            sx={{ mt: 4 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              {BookClass?.supportedCommentaries.map((commentary) => (
                <Link
                  // href={`#${commentary.key}`}
                  key={commentary.key}
                  onClick={() => handleCommentaryChange(commentary.key)}
                  sx={{ textDecoration: "none" }}
                >
                  <div
                    key={commentary.name}
                    role="tab"
                    // aria-selected={selectedCommentary?.name === commentary.name}
                    className={`commentary-tab`}
                    tabIndex={0}
                  >
                    {commentary.name}
                  </div>
                </Link>
              ))}
            </Stack>
            {/* {!isMobile && (
          <div className="search-box-wrapper">
            <SearchBox onSearch={handleSearch} placeholder={""} />
          </div>
        )} */}
          </Stack>
          {BookClass?.supportedCommentaries.map((commentary: Commentary) => (
            <DetailsContent
              selectedCommentary={commentary}
              selectedTitle={selectedTitle}
              key={commentary.key}
              defaultExpanded={
                !commentary.hidden || selectedCommentary?.[commentary.key]
              }
              isMobile={isMobile}
              setShowPlayer={() => setShowPlayer((val) => !val)}
            />
          ))}
        </>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <DrawerMenu
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        bookName={bookName}
        selectedTitle={selectedTitle}
        titles={BookClass?.allTitles}
      />
    </Box>
  );
};

export default DetailPage;
