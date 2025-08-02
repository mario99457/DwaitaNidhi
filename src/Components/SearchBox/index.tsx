import React, { useCallback, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { debounce } from "lodash";

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  textFieldStyle?: React.CSSProperties;
  isMobile?: boolean;
  onClear: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder,
  textFieldStyle,
  isMobile,
  onClear,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(debounce(onSearch, 50), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setSearchTerm(event.target.value);
      debouncedSearch(event.target.value);
    } else {
      setSearchTerm("");
      onClear();
    }
  };

  const handleSearchClear = () => {
    if (searchTerm) {
      setSearchTerm("");
      onClear();
    }
  };

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      // onKeyDown={(event) => {
      //   if (event.key === "Enter") {
      //     handleSearch();
      //   }
      // }}
      className="search-box"
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            onClick={handleSearchClear}
            sx={{
              cursor: searchTerm ? "pointer" : "text",
              width: "24px",
              height: "24px",
              // background: isMobile ? "transparent" : "#E4E4E4",
              borderRadius: "7px",
            }}
          >
            {searchTerm ? <CloseIcon /> : <SearchIcon />}
          </InputAdornment>
        ),
        sx: {
          borderRadius: isMobile ? "28px" : "",
        },
      }}
      sx={{
        width: isMobile ? "100%" : "410px",
        maxWidth: "100%",
        ...textFieldStyle,
      }}
    />
  );
};

export default SearchBox;
