import { Box, useMediaQuery, useTheme } from "@mui/material";
// import React from "react";
// import card1Img from "../../assets/LandingPageCards/image 10.png";
import card1Img from "../../assets/LandingPageCards/Variant1.png";
import card2Img from "../../assets/LandingPageCards/Variant2.png";
import card3Img from "../../assets/LandingPageCards/Variant3.png";
import card4Img from "../../assets/LandingPageCards/Variant4.png";
import card5Img from "../../assets/LandingPageCards/Variant5.png";
import card6Img from "../../assets/LandingPageCards/Variant6.png";
import card7Img from "../../assets/LandingPageCards/Variant7.png";

// import card2Img from "../../assets/LandingPageCards/image 6.png";
// import card3Img from "../../assets/LandingPageCards/image 7.png";
// import card4Img from "../../assets/LandingPageCards/image 8.png";
// import card5Img from "../../assets/LandingPageCards/image 9.png";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import 'swiper/css/effect-coverflow';
import "./landing.scss";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import HomePageCard from "../../Components/HomePageCard";
import HomePageCardSmall from "../../Components/HomePageCard/HomePageCardSmall";
import { Height } from "@mui/icons-material";

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cards = [
    {
      image: isMobile ? card1Img : card1Img,
      title: "Card 1",
      quote: isMobile ? "" :
        "ज्ञानानन्दं देव निर्मलस्फटिकाकृतिं ।\nआधारं सर्वविद्यानां हयग्रीवनुपास्महे ॥",
      author: isMobile ? "" : "-श्रीमद्वादिराजतीर्थाः",
      style: {
        background: "#4D0301", 
        Height: "70vw"
      },
    },
    {
      image: isMobile ? card2Img : card2Img,
      title: "Card 2",
      quote: isMobile ? "" :
        "वेदव्यास! गुणावास! विद्याधीश! सतां वश।\nमां निराशं गतक्लेशं कुर्वनाशं हरेsनिशम् ॥",
      author: isMobile ? "" : "-श्रीमद्वादिराजतीर्थाः",
      style: {
        background: "#4D0301",
        Height: "70vw"
      },
    },
    {
      image: isMobile ? card3Img : card3Img,
      title: "Card 3",
      quote: isMobile ? "" :
        "अभ्रमं भङ्गरहितं अजडं विमलं सदा |\nआनन्दतीर्थमतुलं भजे तापत्रयापहम् || ",
      author: isMobile ? "" : "-श्रीव्यासराजतीर्थाः",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #417F1B 0%, #284E03 100%)",
      },
    },
    {
      image: isMobile ? card4Img : card4Img,
      title: "Card 4",
      quote: isMobile ? "" :
        "यस्यवाक्कामधेनुर्नः कामितार्थान् प्रयच्छति ।\nसेवे तं जययोगीन्द्रं कामबाणच्छिदं सदा ॥",
      author: isMobile ? "" : "-श्रीविजयेन्द्रतीर्थाः ",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #531B7F 0%, #400D82 100%)",
      },
    },
    {
      image: isMobile ? card5Img : card5Img,
      title: "Card 5",
      quote: isMobile ? "" :
        "ज्ञानवैराग्यभक्त्यादि कल्याणगुणशालिनः ।\nलक्ष्मीनारायणमुनीन् वन्दे विद्यगुरून् मम ॥",
      author: isMobile ? "" : "-श्रीव्यासराजतीर्थाः ",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #531B7F 0%, #400D82 100%)",
      },
    },
    {
      image: isMobile ? card6Img : card6Img,
      title: "Card 6",
      quote: isMobile ? "" :
        "अर्थिकल्पितकल्पोsयं प्रत्यर्थिगजकेसरी।\nव्यासतीर्थगुरुर्भूयादस्मदिsर्थ सिद्धये।। ",
      author: isMobile ? "" : "-श्रीश्रीनिवासतीर्थाः",
      style: {
        background:
          " radial-gradient(92.71% 55.9% at 71.21% 40.48%, #B36101 0%, #905107 100%)",
      },
    },
    {
      image: isMobile ? card7Img : card7Img,
      title: "Card 7",
      quote: isMobile ? "" :
        "दुर्वादिध्वान्तरवये वैष्णवेन्दीवरेन्दवे।\nश्रीराघवेन्द्रगुरवे नमोsत्यन्त दयालवे।।  ",
      author: isMobile ? "" : "-श्रीअप्पण्णाचार्याः",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #7F1B63 0%, #820D45 100%)",
      },
    }
  ];
  return (
    <Box>
      <Swiper
        spaceBetween={8}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={4000}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        className="mySwiper"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.title}>
            {isMobile ? (
              <HomePageCardSmall
                key={card.title}
                image={card.image}
                quote={card.quote}
                author={card.author}
                style={card.style}
              />
            ) : (
              <HomePageCard
                key={card.title}
                image={card.image}
                quote={card.quote}
                author={card.author}
                style={card.style}
              />
            )}
          </SwiperSlide>
        ))}
        <div className="left-gradient"></div>
        <div className="right-gradient"></div>
      </Swiper>
      <div className={`swiper-button-group ${isMobile ? "swiper-mobile" : ""}`}>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </div>
    </Box>
  );
};

export default Landing;
