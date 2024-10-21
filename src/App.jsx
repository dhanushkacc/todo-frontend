import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "@pages/AuthPage";
import DashboardPage from "@pages/DashboardPage";
import ProfilePage from "@pages/ProfilePage";
import VerifyEmailPage from "@pages/VerifyEmailPage";

const App = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/" element={<AuthPage />} />
    </Routes>
  );
};

export default App;
