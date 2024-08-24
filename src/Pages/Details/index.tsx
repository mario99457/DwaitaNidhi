import {
  Box,
  Breadcrumbs,
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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ToC_Icon from "../../assets/toc.svg";
import prevButton from "../../assets/prev_button.svg";
import nextButton from "../../assets/next_button.svg";
import playButton from "../../assets/PlayButton.svg";
import Divider from "@mui/material/Divider";
import SearchBox from "../../Components/SearchBox";
import DetailsContent from "./DetailsContent";
import DrawerMenu from "./DrawerMenu";
import { getBookClass } from "../../Services/Common/GlobalServices";
import { Sloga } from "../../types/GlobalType.type";
import Formatter from "../../Services/Common/Formatter";

interface Commentary {
  name: string;
  author: string;
  key: string;
  lang: string;
  number: string;
  hidden: boolean;
}
const DetailPage = () => {
  const { slogaNumber, bookName } = useParams();
  const [selectedSloga, setSelectedSloga] = useState<Sloga | null>(null);
  const selectedKey = useRef("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const BookClass = getBookClass(bookName || "");

  const availableLanguages = [
    {
      id: "ss",
      label: "संस्कृत",
    },
    {
      id: "te",
      label: "తెలుగు",
    },
    {
      id: "t",
      label: "தமிழ்",
    },
    {
      id: "k",
      label: "ಕನ್ನಡ",
    },
    {
      id: "m",
      label: "മലയാളം",
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

  useEffect(() => {
    const sloga = BookClass?.allSutras.find(
      (sloga: Sloga) => sloga.i == slogaNumber
    );
    if (sloga) {
      setSelectedSloga(sloga);
    }
  }, [slogaNumber]);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };

  const handleCommentaryChange = (data: Commentary) => {
    setSelectedCommentary((prevState) => ({
      ...prevState,
      [data.key]: { expanded: true },
    }));
    selectedKey.current = data.key;
  };

  useEffect(() => {
    if (selectedKey.current) {
      setTimeout(() => {
        const section = document.querySelector(`#${selectedKey.current}`);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [selectedCommentary]);

  const handleNavigateSloga = (navigation: string) => {
    if (navigation == "next" && selectedSloga && selectedSloga.srno) {
      const nextSloga: any = BookClass?.getRightArrow(selectedSloga);
      navigate(`/${bookName}/${nextSloga?.i}`);
    }
    if (navigation == "prev" && selectedSloga && selectedSloga.srno) {
      const prevSloga: any = BookClass?.getLeftArrow(selectedSloga);
      navigate(`/${bookName}/${prevSloga?.i}`);
    }
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href={`/${bookName}`}
      onClick={() => {}}
    >
      <Typography
        key="2"
        color="text.primary"
        fontFamily={"Tiro Devanagari Sanskrit"}
      >
        Home
      </Typography>
    </Link>,
    <Typography key="3" color="#A74600" fontFamily={"Tiro Devanagari Sanskrit"}>
      ब्र.सू. {Formatter.toDevanagariNumeral(selectedSloga?.i)}
    </Typography>,
  ];

  const handleSearch = (searchTerm: string) => {
    console.log("inside search", searchTerm);
  };

  if (!selectedSloga) {
    return <>No Sutras found</>;
  }

  return (
    <Box
      sx={{
        width: {
          lg: "80%",
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
      <Box
        sx={{
          display: "none",
          justifyContent: "space-between",
          px: 0,
          pb: 4,
          borderBottom: "1px solid #BDBDBD",
        }}
      >
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          {breadcrumbs}
        </Breadcrumbs>
        <div
          style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
          onClick={() => setOpenDrawer(true)}
          role="button"
        >
          <img src={ToC_Icon} width={`18px`} height={`18px`} />
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "Tiro Devanagari Hindi",
              fontSize: "16px",
              fontWeight: "400",
              marginLeft: "10px",
            }}
          >
            सूत्रावलि
          </Typography>
        </div>
      </Box>
      {isMobile && (
        <>
          <SearchBox
            onSearch={handleSearch}
            placeholder={"Type in English or Devanagari"}
            textFieldStyle={{
              width: "100%",
              borderRadius: "28px",
            }}
            isMobile={true}
          />
          <Divider sx={{ mt: 4 }} />
        </>
      )}
      <Box className="title-box-wrapper" sx={{ pt: 2 }}>
        <Box sx={{ display: "flex" }}>
          <img
            src={prevButton}
            alt="previous"
            style={{
              visibility: selectedSloga.srno == 1 ? "hidden" : "visible",
              cursor: "pointer",
            }}
            onClick={() => handleNavigateSloga("prev")}
          />
          <Container
            sx={{
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontFamily="Tiro Devanagari Hindi"
              fontSize="30px"
              lineHeight="39.9px"
              color="#BC4501"
            >
              {selectedSloga?.s}
            </Typography>
          </Container>
          <img
            src={nextButton}
            alt="next"
            style={{
              cursor: "pointer",
              visibility:
                BookClass?.allSutras &&
                selectedSloga &&
                selectedSloga?.srno <= BookClass?.allSutras.length
                  ? "visible"
                  : "hidden",
            }}
            onClick={() => handleNavigateSloga("next")}
          />
        </Box>
      </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 5, mb: 2 }}
      >
        <Typography
          fontFamily="Tiro Devanagari Sanskrit"
          fontSize="22px"
          fontWeight="400"
          color="#969696"
        >
          ब्र.सू. {Formatter.toDevanagariNumeral(selectedSloga?.i)}
        </Typography>
        <img src={playButton} />
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
            fontFamily="Tiro Devanagari Hindi"
            fontSize="24px"
            fontWeight="400"
            color="#A74600"
          >
            संक्षेप
          </Typography>
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
        </Stack>
        <Typography
          fontFamily="Tiro Devanagari Hindi"
          fontSize="18px"
          fontWeight={400}
          color="#BC4501"
          lineHeight="23.94px"
        >
          {BookClass?.getSummary(selectedSloga.i)
            ? BookClass?.getSummary(selectedSloga.i)[selectedLanguage]
            : ""}
        </Typography>
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
              onClick={() => handleCommentaryChange(commentary)}
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
        {!isMobile && (
          <div className="search-box-wrapper">
            <SearchBox onSearch={handleSearch} placeholder={""} />
          </div>
        )}
      </Stack>
      {BookClass?.supportedCommentaries.map((commentary: Commentary) => (
        <DetailsContent
          selectedCommentary={commentary}
          selectedSloga={selectedSloga}
          key={commentary.key}
          defaultExpanded={
            !commentary.hidden || selectedCommentary?.[commentary.key]
          }
        />
      ))}

      <DrawerMenu
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        bookName={bookName}
        selectedSloga={selectedSloga}
        slogas={BookClass?.allSutras}
      />
    </Box>
  );
};

export default DetailPage;
