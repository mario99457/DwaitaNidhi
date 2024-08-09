import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../../Pages/Landing";
import TitlePage from "../../Pages/Title";
import DetailPage from "../../Pages/Details";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:bookName" element={<TitlePage />} />
      <Route path="/:bookName/:slogaNumber" element={<DetailPage />} />
    </Routes>
  );
};

export default Router;
