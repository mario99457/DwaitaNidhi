import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppContextType, AppAction, AppState } from "../types/Context.type";
import { Backdrop, CircularProgress } from "@mui/material";

const AppContext = createContext<AppContextType | null>(null);

export const AppDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appsReducer, initialState);

  useEffect(() => {}, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {state.showLoader && (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={state.showLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within a TasksProvider");
  }
  return context;
};

function appsReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "setSelectedBook": {
      return {
        ...state,
        selectedBook: action.book,
      };
    }
    case "setLoader": {
      return {
        ...state,
        showLoader: action.showLoader,
      };
    }
    case "setCurrentlyPlayingTitle": {
      return {
        ...state,
        currentlyPlayingTitle: action.title,
      };
    }
    case "setAudioCurrentTime": {
      return {
        ...state,
        audioCurrentTime: action.time,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialState: AppState = {
  selectedBook: null,
  showLoader: false,
  currentlyPlayingTitle: null,
  audioCurrentTime: 0,
};
