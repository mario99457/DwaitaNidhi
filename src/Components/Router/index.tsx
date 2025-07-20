import { Navigate, Routes, Route } from "react-router-dom";
import Landing from "../../Pages/Landing";
import TitlePage from "../../Pages/Title";
import DetailPage from "../../Pages/Details";
import SearchPage from "../../Pages/Search";
import LoginPage from "../../Pages/Login";
import SettingsPage from "../../Pages/Settings";
import WithoutNav from "../../Layout/WithoutNav";
import WithNav from "../../Layout/WithNav";
import { PrivateRoute } from "../Router/PrivateRoute";
import useToken from "../../Services/Auth/useToken";
import ComingSoon from "../../Pages/ComingSoon";

const Router = () => {
  const { creds } = useToken();

  return (
    <Routes>
      <Route element={<WithNav />}>
        <Route>
          <Route path="/" element={<Landing />} />
          <Route path="/:bookName" element={<TitlePage />} />
          <Route path="/:bookName/:titleNumber" element={<DetailPage />} />
          <Route
            path="/:bookName/:titleNumber/:commentary"
            element={<DetailPage />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Route>
      </Route>
      <Route element={<WithoutNav />}>
        <Route
          path="/login"
          element={creds?.token ? <Navigate to="/" /> : <LoginPage />}
        />
      </Route>
    </Routes>
  );
};

export default Router;
