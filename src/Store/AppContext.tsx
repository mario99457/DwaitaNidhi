import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppContextType, AppAction, AppState } from "../types/Context.type";

const AppContext = createContext<AppContextType | null>(null);

export const AppDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appsReducer, initialState);

  useEffect(() => {
    fetch("/book.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((json) => {
        localStorage.setItem("books", JSON.stringify(json));
        dispatch({ type: "setBooks", books: json });
        console.log(json);
      })
      .catch(function () {});
  }, []);

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
    case "setBooks": {
      return {
        ...state,
        books: action.books.map((book) => ({
          ...book,
          chapters: [],
          commentaries: [],
          data: [],
        })),
      };
    }
    default: {
      throw Error("Unknown action: ");
    }
  }
}

const initialState: AppState = {
  books: [],
};
