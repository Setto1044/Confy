import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accessToken = localStorage.getItem("accessToken"); // ✅ localStorage 확인

  return isAuthenticated || accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
