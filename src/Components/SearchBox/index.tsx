import React, { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleSearch();
        }
      }}
      className="search-box"
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            onClick={handleSearch}
            sx={{
              cursor: "pointer",
              width: "24px",
              height: "24px",
              background: "#E4E4E4",
              borderRadius: "7px",
            }}
          >
            <SearchIcon sx={{}} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: "400px",
      }}
    />
  );
};

export default SearchBox;
