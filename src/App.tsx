import "./App.css";
import Layout from "./Layout";
import { Outlet } from 'react-router';
import { BrowserRouter } from "react-router-dom";
import Router from "./Components/Router";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AppDataProvider } from "./Store/AppContext";

const theme = createTheme({
  typography: {
    fontFamily: "Adishila, Vesper Libre,Poppins, sans-serif",
  },
});

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppDataProvider>
        <ThemeProvider theme={theme}>
          <Layout>
            <Router />
          </Layout>
        </ThemeProvider>
      </AppDataProvider>
    </BrowserRouter>
  );
}

export default App;
