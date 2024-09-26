import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppContextType, AppAction, AppState } from "../types/Context.type";

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
    default: {
      throw Error("Unknown action: ");
    }
  }
}

const initialState: AppState = {
  selectedBook: null,
};
