import useToken from "../../Services/Auth/useToken"
import LoginBox from "../../Components/Settings";

const SettingsPage = () => {   
  const { setToken } = useToken();
  
  return (
    <LoginBox setToken={setToken}></LoginBox>
  );
};

export default SettingsPage;
