import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, redirectTo, component }) => {
  return isAuthenticated ? component : <Navigate to={redirectTo} />;
};

export default PrivateRoute;