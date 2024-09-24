import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Assuming you have an authentication context
import useToken from '../../Services/Auth/useToken'; 

export const PrivateRoute = () => {
  const { creds } = useToken();
  const location = useLocation();

  return creds?.token != null ? (
    <Outlet /> // Render the protected route
  ) : (
    <Navigate to="/login" replace state={{ from: location }} /> // Redirect to login page
  );
};