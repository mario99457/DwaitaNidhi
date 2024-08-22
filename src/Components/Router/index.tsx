import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../../Pages/Landing";
import TitlePage from "../../Pages/Title";
import DetailPage from "../../Pages/Details";
import SearchPage from "../../Pages/Search";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:bookName" element={<TitlePage />} />
      <Route path="/:bookName/:slogaNumber" element={<DetailPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};

export default Router;
