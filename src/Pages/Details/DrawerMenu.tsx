import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import * as React from "react";
import listIcon from "../../assets/toc.svg";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TreeView from "../Title/Treeview";
interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}
const DrawerMenu: React.FC<DrawerMenuProps> = ({ open, onClose }) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{ sx: { marginTop: "130px" } }}
    >
      <Box sx={{ width: 410 }}>
        <Stack
          sx={{ padding: "20px 16px 14px", background: "#E8E8E8" }}
          direction="row"
          justifyContent="space-between"
        >
          <div className="d-flex">
            <img src={listIcon} />
            <Typography
              fontFamily={"Tiro Devanagari Hindi"}
              fontSize="22px"
              ml="8px"
            >
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
        <TreeView handleSlogaClick={() => {}} />
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
