import useToken from "../../Services/Auth/useToken"
import LoginBox from "../../Components/Login";

const LoginPage = () => {   
  const { setToken } = useToken();
  
  return (
    <LoginBox setToken={setToken}></LoginBox>
  );
};

export default LoginPage;
