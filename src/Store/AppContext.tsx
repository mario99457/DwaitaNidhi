import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  AppContextType,
  AppAction,
  AppState,
  Book,
} from "../types/Context.type";

const AppContext = createContext<AppContextType | null>(null);
import CachedData, {
  Prefetch,
} from "../Services/Common/GlobalServices";

export const AppDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appsReducer, initialState);

  useEffect(() => {
    const requiredData = [
      "sutraani",
      "bhashyam",
      "sutradipika",
      "books",
      "sutraaniSummary",
    ];
    Prefetch.prefetchRequiredServerData(requiredData, () => {
      console.log("inside callback method");
    })
      .then((res) => {
        console.log("inside then method", res, CachedData.data);
      })
      .catch((err) => {
        console.log("inside promise reject method------", err);
      });
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
        books: action.books.map((book: Book) => ({
          ...book,
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
