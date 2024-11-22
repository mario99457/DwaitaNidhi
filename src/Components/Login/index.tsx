import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { authenticate } from "../../Services/Auth/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppData } from "../../Store/AppContext";
const LoginBox = ({ setToken }) => {
  //const [selectedOption, setSelectedOption] = useState("all");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useAppData();

  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleLogin = async (user = username, pass = password) => {
    dispatch({ type: "setLoader", showLoader: true });
    const from = location.state?.from?.pathname || "/";
    try {
      const creds = await authenticate({
        username: user,
        password: pass,
      });

      if (creds?.token != null) {
        setToken(creds);
        navigate(from, { replace: true });
      }
      dispatch({ type: "setLoader", showLoader: false });
    } catch (error) {
      console.log("inside catch", error);
      dispatch({ type: "setLoader", showLoader: false });
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "75%",
        display: "flex",
        justifyContent: "center",
        alignItems: {
          lg: "center",
          xs: "start",
        },
      }}
    >
      <Box
        sx={{
          width: {
            lg: "30%",
            xs: "90%",
          },
          // border: "1px solid #dddddd",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <Typography
          fontFamily="Poppins"
          fontSize="26px"
          fontWeight={600}
          color="#BC4501"
        >
          Login
        </Typography>
        <Stack direction="column" mt={3} spacing={3}>
          <TextField
            id="username"
            variant="outlined"
            hiddenLabel
            placeholder="Username"
            size="small"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            autoFocus
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment
            //       position="end"
            //       sx={{
            //         cursor: "pointer",
            //         display: username ? "flex" : "none",
            //       }}
            //       onClick={() => {
            //         setUsername("");
            //       }}
            //     >
            //       <CloseIcon sx={{ color: "#BB0E0E" }} />
            //     </InputAdornment>
            //   ),
            // }}
          />
          <TextField
            id="password"
            variant="outlined"
            hiddenLabel
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            size="small"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    cursor: "pointer",
                    display: password ? "flex" : "none",
                  }}
                >
                  <IconButton
                    onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Button
          variant="contained"
          sx={{
            color: "#FFFFFF",
            background: "#BC4501",
            "&:hover": {
              bgcolor: "#BC4501",
            },
            marginTop: "1rem",
          }}
          onClick={() => handleLogin()}
          disabled={!username || !password}
        >
          GO
        </Button>
      </Box>
    </Box>
  );
};

export default LoginBox;
