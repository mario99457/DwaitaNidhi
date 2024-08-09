type Sloga = {
  i: string;
  s: string;
  a: string;
  p: string;
  n: string;
  e: string;
  pc: string;
};

type Commentaries = {
  name: string;
  label: string;
  author: string;
  data: {
    [key: string]: string;
  };
};

type Book = {
  name: string;
  label: string;
  chapters: {
    n: string;
    name: string;
    sub: {
      n: string;
      name: string;
    }[];
  }[];
  data: Sloga[];
  commentaries: Commentaries[];
};

export interface AppState {
  books: Book[];
}

export type AppAction =
  | { type: "setBooks"; books: { name: string; label: string }[] }
  | { type: "added"; id: number; text: string }
  | { type: "deleted"; id: number };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
