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
import saveEdit from "../../assets/save_edit.svg";
import cancelEdit from "../../assets/cancel_edit.svg";
import ToC_Icon from "../../assets/toc.svg";
import prevButton from "../../assets/prev_button.svg";
import nextButton from "../../assets/next_button.svg";
import playButton from "../../assets/Play_no_track.svg";
import pauseButton from "../../assets/pauseButton.svg";
import Divider from "@mui/material/Divider";
// import SearchBox from "../../Components/SearchBox";
import DetailsContent from "./DetailsContent";
import DrawerMenu from "./DrawerMenu";
import CachedData, {
  ApiEndpoints,
  GenericBook,
} from "../../Services/Common/GlobalServices";
import { Title } from "../../types/GlobalType.type";
import Formatter from "../../Services/Common/Formatter";
import Parser from "html-react-parser";
// import { Howl, Howler } from "howler";
import ReactHowler from "react-howler";
import AudioPlayer from "./AudioPlayer";
import useToken from "../../Services/Auth/useToken";
import React, { lazy } from "react";
import ContentEditable from "react-contenteditable";
import { useAppData } from "../../Store/AppContext";
import { Prefetch } from "../../Services/Common/GlobalServices";
import { ContentEditableEvent } from "react-contenteditable";
import Sanscript from '@indic-transliteration/sanscript';

interface Commentary {
  name: string;
  author: string;
  key: string;
  lang: string;
  number: string;
  hidden: boolean;
  audio: boolean;
}
const commentaryScriptOptions = [
  { value: 'devanagari', label: 'Devanagari (Sanskrit)' },
  { value: 'iast', label: 'English (IAST)' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
];

const DetailPage = () => {
  const { titleNumber, bookName, commentary } = useParams();
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<Title | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedKey = useRef("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { creds } = useToken();
  const [playAudio, setPlayAudio] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  const [editable, setEditable] = React.useState(false);
  const [editedText, setEditedText] = React.useState("");
  const [hideSummary, setHideSummary] = React.useState(false);
  const { state } = useAppData();
  const titleBoxRef = useRef<HTMLDivElement>(null);
  const [titleBoxHeight, setTitleBoxHeight] = useState(0);

  const availableLanguages = [
    {
      id: "k",
      label: "ಕನ್ನಡ",
    },
    {
      id: "e",
      label: "English",
    },
  ];
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(
    availableLanguages[0].id
  );
  const [selectedCommentary, setSelectedCommentary] = useState<{
    [key: string]: any;
  }>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  // Add state to track commentary loading
  const [commentariesLoading, setCommentariesLoading] = useState(true);
  // Track previous bookName to detect book changes
  const prevBookNameRef = useRef<string | undefined>();
  const [commentaryScript, setCommentaryScript] = useState('kannada');

  useEffect(() => {
    const loadBookData = async () => {
      if (!bookName) return;

      setIsLoading(true);
      // Only reload commentaries if bookName changes
      const isBookChanged = prevBookNameRef.current !== bookName;
      if (isBookChanged) setCommentariesLoading(true);

      // Check if book data is already loaded
      const bookIndexKey = bookName + "index";
      const bookSummaryKey = bookName + "summary";
      
      console.log(`Loading book data for ${bookName}`);
      console.log(`Index key: ${bookIndexKey}, exists: ${!!CachedData.data[bookIndexKey]}`);
      console.log(`Summary key: ${bookSummaryKey}, exists: ${!!CachedData.data[bookSummaryKey]}`);
      
      if (!CachedData.data[bookIndexKey] || !CachedData.data[bookSummaryKey]) {
        // Load book data lazily if not already loaded
        try {
          console.log(`Book data not found, loading from server...`);
          await Prefetch.loadBookData(bookName, async () => {
            CachedData.selectedBook = bookName;
            GenericBook.populateIndexList();
            GenericBook.populateCommenatries();
            //add a delay of 2 seconds
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (isBookChanged) setCommentariesLoading(false); // Only set to false if book changed
            
            console.log(`All titles loaded: ${GenericBook.allTitles?.length}`);
            console.log(`Commentaries loaded: ${GenericBook.supportedCommentaries?.length}`);
            
            // Find the title after data is loaded
            const title = GenericBook.allTitles?.find(
              (title: Title) => title.i == titleNumber
            );
            if (title) {
              console.log(`Found title: ${title.i}`);
              setSelectedTitle(title);
            } else {
              console.warn(`Title ${titleNumber} not found in book ${bookName}`);
            }
            setIsLoading(false);
          });
        } catch (error) {
          console.error("Error loading book data:", error);
          setIsLoading(false);
          if (isBookChanged) setCommentariesLoading(false);
          // Handle error - could show an error message to user
        }
      } else {
        // Book data already loaded, just initialize
        console.log(`Book data already loaded for ${bookName}`);
        CachedData.selectedBook = bookName;
        GenericBook.populateIndexList();
        if (isBookChanged) {
          GenericBook.populateCommenatries();
          setCommentariesLoading(true); // Force spinner
        }
        
        console.log(`All titles loaded: ${GenericBook.allTitles?.length}`);
        console.log(`Commentaries loaded: ${GenericBook.supportedCommentaries?.length}`);
        
        // Find the title
        const title = GenericBook.allTitles?.find(
          (title: Title) => title.i == titleNumber
        );
        if (title) {
          console.log(`Found title: ${title.i}`);
          setSelectedTitle(title);
        } else {
          console.warn(`Title ${titleNumber} not found in book ${bookName}`);
        }
        setIsLoading(false);
        // Add a short delay before hiding spinner for UX, only if book changed
        if (isBookChanged) setTimeout(() => setCommentariesLoading(false), 300);
      }
      // Update previous bookName
      prevBookNameRef.current = bookName;
    };

    loadBookData();
  }, [titleNumber, bookName]);

  // Load audio after selectedTitle is set
  useEffect(() => {
    if (selectedTitle && selectedTitle.i) {
      console.log(`Loading audio for title: ${selectedTitle.i}`);
      const BASE_URL = ApiEndpoints.availableGithubServerUrls.githubusercontent;
      const EXTENSION = ".txt";
      const audioUrl = `${BASE_URL}sutraani/audio/${selectedTitle.i}${EXTENSION}`;

      fetch(audioUrl).then((r) => {
        r.text().then((d) => {
          console.log(`Audio loaded for title: ${selectedTitle.i}`);
          setSelectedAudio(d as any);
        });
      }).catch((e) => {
        console.log("Error fetching audio file:", e); 
      });
    }
  }, [selectedTitle]);

  useEffect(() => {
    if (!selectedTitle || !selectedTitle.i) return;
    const summary = GenericBook.getSummary(selectedTitle.i);
    setEditedText(summary ? summary[selectedLanguage] : "");
    if (
      !summary ||
      Object.values(summary).length <= 0 ||
      Object.values(summary).filter((e) => e).length <= 0
    ) {
      setHideSummary(true);
    } else {
      setHideSummary(false);
    }
  }, [selectedTitle]);

  // Fix 1: Add types to all function parameters
  const handleChange = (evt: ContentEditableEvent) => {
    setEditedText(evt.target.value);
  };

  const handleSave = (id: string) => {
    GenericBook.updateSummary(
      CachedData.selectedBook + "Summary",
      selectedLanguage,
      selectedTitle?.i,
      editedText
    );
    //TODO:
    //create json object with title number, commentary name
    //preprocess text
    //call service to update text to GitHub
    setEditable(!editable);
    setShowFullSummary(false);
  };

  const handleCancel = (id: string) => {
    //TODO:
    //create json object with title number, commentary name
    //preprocess text
    //call service to update text to GitHub
    setEditable(!editable);
    setShowFullSummary(false);
  };

  const toggleEditable = () => {
    setEditable(!editable);
    setShowFullSummary(true);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);

    setEditedText(
      GenericBook.getSummary(selectedTitle?.i)
        ? GenericBook.getSummary(selectedTitle?.i)[event.target.value]
        : ""
    );

    // Re-check overflow after DOM update
    setTimeout(() => {
      if (summaryRef.current) {
        const isOverflowing =
          summaryRef.current.scrollHeight > summaryRef.current.clientHeight;
        setIsOverflowing(isOverflowing);
      }
    }, 1000);
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

  useEffect(() => {
    const checkOverflow = () => {
      if (summaryRef.current) {
        const isOverflowing =
          summaryRef.current.scrollHeight > summaryRef.current.clientHeight;
        setIsOverflowing(isOverflowing);
      }
    };
    if (titleBoxRef.current) {
      setTitleBoxHeight(titleBoxRef.current.clientHeight);
    }

    const timeoutId = setTimeout(() => {
      checkOverflow();
    }, 100);

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [selectedTitle, selectedLanguage]);

  const handleNavigateTitle = (navigation: string) => {
    if (navigation == "next" && selectedTitle && selectedTitle.srno) {
      const nextTitle: any = GenericBook.getRightArrow(selectedTitle);
      navigate(`/${bookName}/${nextTitle?.i}`);
    }
    if (navigation == "prev" && selectedTitle && selectedTitle.srno) {
      const prevTitle: any = GenericBook.getLeftArrow(selectedTitle);
      navigate(`/${bookName}/${prevTitle?.i}`);
    }
  };

  const handlePlayPause = () => {
    setPlayAudio((prevState) => !prevState);
  };

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
      {/* Commentary Language Selection Dropdown */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 16, color: '#A74600' }}>
          Commentary Language:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 140, background: '#FCF4CD', borderRadius: 1 }}>
          <Select
            value={commentaryScript}
            onChange={e => setCommentaryScript(e.target.value)}
          >
            {commentaryScriptOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {showPlayer && (
        <AudioPlayer
          selectedTitle={selectedTitle as Title}
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
              <img src={ToC_Icon} width={`18px`} height={`18px`} alt="Table of Contents" />
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "20px",
                  fontWeight: "400",
                  marginLeft: "10px",
                }}
              >
                {
                  CachedData.data.books?.find(
                    (b: any) => b.name == state.selectedBook?.name
                  )?.index
                }
              </Typography>
            </div>
          </Box>
          <Box
            ref={titleBoxRef}
            className="title-box-wrapper"
            sx={{
              pt: 2,
              position: "sticky",
              background: "white",
              top: 0,
              zIndex: 3,
            }}
          >
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
                  minHeight: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "pre-line",
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
                    GenericBook.allTitles &&
                    selectedTitle &&
                    typeof selectedTitle.srno !== 'undefined' &&
                    selectedTitle.srno <= GenericBook.allTitles.length
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
            sx={{ mt: 2, mb: 2 }}
          >
            <Typography fontSize="24px" fontWeight="400" color="#969696">
              {
                CachedData.data.books?.find(
                  (b: any) => b.name == state.selectedBook?.name
                )?.abbrev
              }
              {Formatter.toDevanagariNumeral(
                `${
                  selectedTitle?.a && selectedTitle?.a !== ""
                    ? selectedTitle?.a + "."
                    : ""
                }${
                  selectedTitle?.p && selectedTitle?.p !== ""
                    ? selectedTitle?.p + "."
                    : ""
                }${selectedTitle?.n}`
              )}
            </Typography>
            <ReactHowler
              preload={true}
              src={[selectedAudio]}
              playing={playAudio}
              onEnd={() => setPlayAudio(false)}
            />
            {state.selectedBook?.audio && (
              <img
                src={playAudio ? pauseButton : playButton} // Conditionally render play/pause icon
                alt={playAudio ? "pause" : "play"}
                style={{ cursor: "pointer" }}
                onClick={handlePlayPause} // Use a single handler for both play and pause
              />
            )}
          </Stack>
          <Divider sx={{ borderBottom: "1px solid #BDBDBD" }} />
          <Box
            sx={{
              display: hideSummary ? "none" : "block",
              mt: 2,
              background: "#FCF4CD",
              borderRadius: "6px",
              minHeight: "100px",
              padding: { lg: "10px 36px 10px 20px", xs: "10px 10px 10px 10px" },
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
                {creds?.token ? (
                  !editable ? (
                    <img
                      src={pencilEdit}
                      alt="edit"
                      style={{ marginLeft: "3rem" }}
                      onClick={() => toggleEditable()}
                    />
                  ) : (
                    <div>
                      <img
                        src={saveEdit}
                        alt="save"
                        style={{ marginLeft: "3rem" }}
                        onClick={() =>
                          handleSave(
                            selectedTitle.i + "_" + selectedCommentary.key
                          )
                        }
                      />{" "}
                      <img
                        src={cancelEdit}
                        alt="save"
                        style={{ marginLeft: "3rem" }}
                        onClick={() =>
                          handleCancel(
                            selectedTitle.i + "_" + selectedCommentary.key
                          )
                        }
                      />
                    </div>
                  )
                ) : (
                  <></>
                )}
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
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
            <ContentEditable
              innerRef={summaryRef}
              id={selectedTitle.i + "_" + selectedCommentary.key}
              className={
                showFullSummary ? "editable_full_summary" : "editable_summary"
              }
              tagName="p"
              html={!editedText ? "<html></html>" : editedText} // innerHTML of the editable div
              disabled={!editable} // use true to disable edition
              onChange={handleChange} // handle innerHTML change
              //onBlur={sanitize}
            />
            {/* <Typography
              ref={summaryRef}
              fontFamily="Vesper Libre"
              contentEditable={editable}
              onChange={handleChange}
              fontSize="18px"
              color="#BC4501"
              lineHeight="33px"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: showFullSummary ? "unset" : 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {editedText}
            </Typography> */}
            {isOverflowing && (
              <Typography
                fontFamily="poppins"
                fontSize="14px"
                fontWeight={400}
                lineHeight="23.94px"
                sx={{
                  textAlign: "right",
                  cursor: "pointer",
                  marginTop: "8px",
                  color: "#A74600",
                }}
                onClick={() => setShowFullSummary((prevState) => !prevState)}
              >
                {showFullSummary ? "Read Less" : "Read More"}
              </Typography>
            )}
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
            sx={{
              mt: 4,
              position: "sticky",
              background: "white",
              top: titleBoxHeight,
              zIndex: 3,
            }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Commentary Tabs Section */}
            {commentariesLoading ? (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 48 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem />}
                role="tablist"
              >
                {GenericBook.supportedCommentaries?.map((commentary: any) => (
                  <div
                    key={commentary.key}
                    role="tab"
                    // aria-selected={selectedCommentary?.name === commentary.name}
                    className={`commentary-tab`}
                    tabIndex={0}
                    onClick={() => handleCommentaryChange(commentary.key)}
                  >
                    <Link sx={{ textDecoration: "none", color: "inherit" }}>
                      {commentary.name}
                    </Link>
                  </div>
                ))}
              </Stack>
            )}
            {/* {!isMobile && (
          <div className="search-box-wrapper">
            <SearchBox onSearch={handleSearch} placeholder={""} />
          </div>
        )} */}
          </Stack>
          {/* Commentary Content Section */}
          {commentariesLoading ? (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            Array.isArray(GenericBook.supportedCommentaries) &&
              GenericBook.supportedCommentaries.map((commentary: any) => (
                <DetailsContent
                  selectedCommentary={commentary}
                  selectedTitle={selectedTitle as Title}
                  key={commentary.key}
                  defaultExpanded={
                    !commentary.hidden || selectedCommentary?.[commentary.key]
                  }
                  isMobile={isMobile}
                  setShowPlayer={() => setShowPlayer((val) => !val)}
                  titleBoxHeight={String(titleBoxHeight)}
                  editContent={() => {}}
                  commentaryScript={commentaryScript}
                />
              ))
          )}
        </>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h6" color="text.secondary">
              Book not found or data not available.
            </Typography>
          )}
        </Box>
      )}
      <DrawerMenu
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        bookName={bookName}
        selectedTitle={selectedTitle as Title}
        titles={GenericBook.allTitles}
      />
    </Box>
  );
};

export default DetailPage;
