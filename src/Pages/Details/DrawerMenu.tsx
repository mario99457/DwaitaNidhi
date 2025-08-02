import { Box, Drawer, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import listIcon from "../../assets/toc.svg";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TreeView from "../Title/Treeview";
import CachedData from "../../Services/Common/GlobalServices";
import Sanscript from '@indic-transliteration/sanscript';
import { Book } from "../../types/Context.type";
import { Title } from "../../types/GlobalType.type";
import { useNavigate } from "react-router-dom";
interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  bookName: string | undefined;
  selectedTitle: Title;
  titles: Title[] | undefined;
  commentaryScript: string;
}
const DrawerMenu: React.FC<DrawerMenuProps> = ({
  open,
  onClose,
  bookName,
  selectedTitle,
  titles,
  commentaryScript,
}) => {
  const [selectedBook, setSlectedBook] = React.useState<Book | null>(null);
  const navigate = useNavigate();

  const handleTitleClick = (selectedTitle: Title) => {
    navigate(`/${bookName}/${selectedTitle.i}`);
    onClose();
  };

  useEffect(() => {
    const book = CachedData.data.books?.find(
      (book: Book) => book.name == bookName
    );
    if (book) {
      setSlectedBook(book);
    }
  }, []);

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Box
        sx={{
          width: {
            lg: 410,
            xs: "100vw",
          },
          overflowX: "hidden",
        }}
      >
        <Stack
          sx={{ padding: "20px 16px 14px", background: "#E8E8E8" }}
          direction="row"
          justifyContent="space-between"
          position="sticky"
          zIndex={1}
          top={0}
        >
          <div
            style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
          >
            <img src={listIcon} width={`18px`} height={`18px`} />
            {/* Fetch index label from book metadata and transliterate */}
            {(() => {
              const bookMeta = CachedData.data.books?.find((b: any) => b.name === bookName);
              const devLabel = bookMeta?.index || '';
              const indexLabel = Sanscript.t(devLabel, 'devanagari', commentaryScript || 'devanagari');
              return (
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "22px",
                    fontWeight: "300",
                    marginLeft: "10px",
                  }}
                >
                  {indexLabel}
                </Typography>
              );
            })()}
          </div>
          <div className="">
            <CloseIcon
              sx={{ color: "#757575", marginLeft: "35px", cursor: "pointer" }}
              onClick={onClose}
            />
          </div>
        </Stack>
        <TreeView
          toc={selectedBook?.chapters || []}
          handleTitleClick={handleTitleClick}
          selectedTitle={selectedTitle}
          titles={titles}
          commentaryScript={commentaryScript || 'devanagari'}
        />
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
