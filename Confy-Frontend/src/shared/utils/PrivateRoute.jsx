import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Redux에서 로그인 상태 가져오기

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
