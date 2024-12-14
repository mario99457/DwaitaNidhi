type Title = {
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

export type Chapters = {
  n: string;
  name: string;
  sub: {
    n: string;
    name: string;
  }[];
};

export type Book = {
  name: string;
  title: string;
  chapters: Chapters[];
  data: Title[];
  commentaries: Commentaries[];
  searchable: boolean,
  audio: boolean
};

export interface AppState {
  selectedBook: Book | null;
  showLoader: boolean;
}

export type AppAction =
  | { type: "setBooks"; books: Book[] }
  | { type: "added"; id: number; text: string }
  | { type: "deleted"; id: number }
  | { type: "setSelectedBook"; book: Book | null }
  | { type: "setLoader"; showLoader: boolean };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
