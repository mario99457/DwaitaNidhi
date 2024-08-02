import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../../Pages/Landing";
import TitlePage from "../../Pages/Title";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:bookName" element={<TitlePage />} />
    </Routes>
  );
};

export default Router;
