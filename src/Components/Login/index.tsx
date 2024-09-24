import {
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import CloseIcon from "@mui/icons-material/Close";
  import { authenticate } from '../../Services/Auth/auth'
  import { useNavigate, useLocation } from "react-router-dom";
  const LoginBox = ( { setToken }) => {
    //const [selectedOption, setSelectedOption] = useState("all");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setUsername("");
        setPassword("");    
    }, []);
    
    const handleLogin = async (user = username, pass = password) => {
        const from = location.state?.from?.pathname || '/';
        const creds = await authenticate({
          user,
          pass
        });

        if(creds?.token != null){
          setToken(creds);
          navigate(from, { replace: true }); 
        }       
    };
  
    return (
      <Box sx={{ padding: { lg: "22px 20%", xs: "22px 5%" } }}>
        <Typography
          fontFamily="Poppins"
          fontSize="26px"
          fontWeight={600}
          color="#BC4501"
        >
          Login
        </Typography>
        <Stack direction="row" mt={3} spacing={3}>
        <TextField
            id="username"
            variant="outlined"
            hiddenLabel
            placeholder="Username"
            size="small"
            sx={{ width: "50%" }}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    cursor: "pointer",
                    display: username ? "flex" : "none",
                  }}
                  onClick={() => {
                    setUsername("");
                  }}
                >
                  <CloseIcon sx={{ color: "#BB0E0E" }} />
                </InputAdornment>
              ),
            }}
          />
          </Stack>
          <Stack direction="row" mt={3} spacing={3}>
          <TextField
            id="password"
            variant="outlined"
            hiddenLabel
            type="password"
            placeholder="Password"
            size="small"
            sx={{ width: "50%" }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    cursor: "pointer",
                    display: password ? "flex" : "none",
                  }}
                  onClick={() => {
                    setPassword("");
                  }}
                >
                  <CloseIcon sx={{ color: "#BB0E0E" }} />
                </InputAdornment>
              ),
            }}
          />
         </Stack>
         <Stack direction="row" mt={3} spacing={3}> 
          <Button
            variant="contained"
            sx={{
              color: "#FFFFFF",
              background: "#BC4501",
              "&:hover": {
                bgcolor: "#BC4501",
              },
            }}
            onClick={() => handleLogin()}
          >
            GO
          </Button>
        </Stack>         
      </Box>
    );
  };

  export default LoginBox;
  