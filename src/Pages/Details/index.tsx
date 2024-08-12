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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { useAppData } from "../../Store/AppContext";

interface Commentary {
  name: string;
  author: string;
  data: string;
}
const DetailPage = () => {
  const { slogaNumber, bookName } = useParams();
  const BookClass = getBookClass(bookName || "");
  const selectedSloga: any =
    BookClass?.allSutras.find((sloga: Sloga) => sloga.i == slogaNumber) || {};

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
  const { state } = useAppData();
  const [selectedCommentary, setSelectedCommentary] = useState<Commentary>(
    BookClass?.supportedCommentaries[0]
  );
  const [openDrawer, setOpenDrawer] = useState(false);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };

  const handleCommentaryChange = (data: Commentary) => {
    setSelectedCommentary(data);
  };

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

  if (!selectedSloga) {
    return <>No Sutras found</>;
  }

  return (
    <Box
      sx={{
        width: "80%",
        background: "#FFFFFF",
        margin: "auto",
        minHeight: "100%",
        padding: "16px 38px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
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
                selectedSloga.srno <= BookClass?.allSutras.length
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
      <Container
        sx={{
          mt: 2,
          background: "#FCF4CD",
          borderRadius: "6px",
          minHeight: "100px",
          padding: "10px 36px 10px 20px",
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
      </Container>
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
            <div
              key={commentary.name}
              onClick={() => handleCommentaryChange(commentary)}
              role="tab"
              aria-selected={selectedCommentary.name === commentary.name}
              className={`commentary-tab ${
                commentary.name == selectedCommentary.name
                  ? "commentary-tab-active"
                  : ""
              }`}
              tabIndex={0}
            >
              {commentary.name}
            </div>
          ))}
        </Stack>
        <div className="search-box-wrapper">
          <SearchBox onSearch={() => {}} placeholder={""} />
        </div>
      </Stack>
      <DetailsContent selectedCommentary={selectedCommentary} selectedSloga={selectedSloga} />
      <DrawerMenu open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </Box>
  );
};

export default DetailPage;
