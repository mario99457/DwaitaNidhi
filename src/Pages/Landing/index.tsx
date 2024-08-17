import { Box, Container } from "@mui/material";
import React from "react";
import card1Img from "../../assets/LandingPageCards/image 10.png";
import card2Img from "../../assets/LandingPageCards/image 6.png";
import card3Img from "../../assets/LandingPageCards/image 7.png";
import card4Img from "../../assets/LandingPageCards/image 8.png";
import card5Img from "../../assets/LandingPageCards/image 9.png";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import HomePageCard from "../../Components/HomePageCard";

const Landing = () => {
  const cards = [
    {
      image: card1Img,
      title: "Card 1",
      quote:
        "वेदव्यास ! गुणावास ! विद्याधीश ! सतां वश । मां निराशं गतक्लेशं कुर्वनाशं हरेsनिशम् ॥",
      author: "-श्रीमद्वादिराजतीर्थाः",
      style: {
        background: "#4D0301",
      },
    },
    {
      image: card1Img,
      title: "Card 2",
      quote:
        "अभ्रमं भङ्गरहितं अजडं विमलं सदा | आनन्दतीर्थमतुलं भजे तापत्रयापहम् || ",
      author: "-श्रीव्यासराजतीर्थाः",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #417F1B 0%, #284E03 100%)",
      },
    },
    {
      image: card1Img,
      title: "Card 3",
      quote:
        "यस्यवाक्कामधेनुर्नः कामितार्थान् प्रयच्छति । सेवे तं जययोगीन्द्रं कामबाणच्छिदं सदा ॥",
      author: "-श्रीविजयेन्द्रतीर्थाः ",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #531B7F 0%, #400D82 100%)",
      },
    },
    {
      image: card1Img,
      title: "Card 4",
      quote:
        "अर्थिकल्पितकल्पोsयं प्रत्यर्थिगजकेसरी। व्यासतीर्थगुरुर्भूयादस्मदिsर्थ सिद्धये।। ",
      author: "-श्रीश्रीनिवासतीर्थाः",
      style: {
        background:
          " radial-gradient(92.71% 55.9% at 71.21% 40.48%, #B36101 0%, #905107 100%)",
      },
    },
    {
      image: card1Img,
      title: "Card 5",
      quote:
        "दुर्वादिध्वान्तरवये वैष्णवेन्दीवरेन्दवे। श्रीराघवेन्द्रगुरवे नमोsत्यन्त दयालवे।।  ",
      author: "-श्रीअप्पण्णाचार्याः",
      style: {
        background:
          "radial-gradient(92.71% 55.9% at 71.21% 40.48%, #7F1B63 0%, #820D45 100%)",
      },
    },
  ];
  return (
    <>
      <Swiper
        // spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.title}>
            <HomePageCard
              key={card.title}
              image={card.image}
              quote={card.quote}
              author={card.author}
              style={card.style}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-button-group">
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </div>
    </>
  );
};

export default Landing;
