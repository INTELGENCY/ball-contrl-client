import { Routes, Route } from "react-router-dom";
import UserRegister from "../../../pages/Auth/Register/Register";


const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<UserRegister />} />
    </Routes>
  );
};

export default AuthRoutes;
