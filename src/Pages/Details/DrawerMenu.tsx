import { Box, Drawer, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import listIcon from "../../assets/toc.svg";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TreeView from "../Title/Treeview";
import CachedData from "../../Services/Common/GlobalServices";
import { Book } from "../../types/Context.type";
import { Sloga } from "../../types/GlobalType.type";
import { useNavigate } from "react-router-dom";
interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  bookName: string | undefined;
  selectedSloga: Sloga;
  slogas: Sloga[] | undefined;
}
const DrawerMenu: React.FC<DrawerMenuProps> = ({
  open,
  onClose,
  bookName,
  selectedSloga,
  slogas,
}) => {
  const [selectedBook, setSlectedBook] = React.useState<Book | null>(null);
  const navigate = useNavigate();

  const handleSlogaClick = (selectedSloga: Sloga) => {
    navigate(`/${bookName}/${selectedSloga.i}`);
    onClose();
  };

  useEffect(() => {
    const book = CachedData.data.books.find(
      (book: Book) => book.name == bookName
    );
    if (book) {
      setSlectedBook(book);
    }
  }, []);

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Box sx={{ width: 410 }}>
        <Stack
          sx={{ padding: "20px 16px 14px", background: "#E8E8E8" }}
          direction="row"
          justifyContent="space-between"
        >
          <div className="d-flex">
            <img src={listIcon} />
            <Typography fontSize="22px" ml="8px">
              सूत्रावलि
            </Typography>
          </div>
          <div className="">
            <SearchIcon sx={{ color: "#757575" }} />
            <CloseIcon
              sx={{ color: "#757575", marginLeft: "35px", cursor: "pointer" }}
              onClick={onClose}
            />
          </div>
        </Stack>
        <TreeView
          toc={selectedBook?.chapters || []}
          handleSlogaClick={handleSlogaClick}
          selectedSloga={selectedSloga}
          slogas={slogas}
        />
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
