import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/ProfileSetup";
import PublicProfile from "./pages/PublicProfile";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";

import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import ActivateCard from "./pages/ActivateCard";

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>

      {/* Every new route starts from the top */}
      <ScrollToTop />

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/update-password" element={<UpdatePassword />} />

        <Route path="/profile-setup" element={<ProfileSetup />} />

        <Route
          path="/activate/:cardCode"
          element={<ActivateCard />}
        />

        <Route
          path="/u/:username"
          element={<PublicProfile />}
        />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/edit-profile" element={<EditProfile />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;