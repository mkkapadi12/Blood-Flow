import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ tokenKey, redirectTo, children }) => {
  const token = localStorage.getItem(tokenKey);
  return token ? children : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
