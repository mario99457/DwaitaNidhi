import { Routes, Route } from "react-router-dom";
import Landing from "../../Pages/Landing";
import TitlePage from "../../Pages/Title";
import DetailPage from "../../Pages/Details";
import SearchPage from "../../Pages/Search";
import LoginPage from "../../Pages/Login";
import WithoutNav from "../../Layout/WithoutNav";
import WithNav from "../../Layout/WithNav";
import { PrivateRoute } from "../Router/PrivateRoute";

const Router = () => {

  return (
    <Routes>
      <Route element={<WithNav />}>
        <Route element={<PrivateRoute />}> 
          <Route path="/" element={<Landing />} />
          <Route path="/:bookName" element={<TitlePage />} />
          <Route path="/:bookName/:titleNumber" element={<DetailPage />} />
          <Route
            path="/:bookName/:titleNumber/:commentary"
            element={<DetailPage />}
          />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Route>
      <Route element={<WithoutNav />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
