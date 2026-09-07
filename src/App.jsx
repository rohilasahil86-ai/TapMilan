import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// =========================
// PUBLIC WEBSITE
// =========================

import Landing from "./pages/Landing";
import DigitalBusinessCard from "./pages/DigitalBusinessCard";
import NFCBusinessCard from "./pages/NFCBusinessCard";
import OrderCard from "./pages/OrderCard";

// =========================
// AUTHENTICATION
// =========================

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";

// =========================
// PROFILE / CARD
// =========================

import ProfileSetup from "./pages/ProfileSetup";
import PublicProfile from "./pages/PublicProfile";
import ActivateCard from "./pages/ActivateCard";

// =========================
// DASHBOARD
// =========================

import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";

// =========================
// UTILITY
// =========================

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>

      {/* Scroll to top on every route change */}
      <ScrollToTop />

      <Routes>

        {/* =========================
            PUBLIC WEBSITE
        ========================== */}

        {/* Home */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* Digital Business Card */}
        <Route
          path="/digital-business-card"
          element={<DigitalBusinessCard />}
        />

        {/* NFC Business Card */}
        <Route
          path="/nfc-business-card"
          element={<NFCBusinessCard />}
        />

        {/* Order Physical Card */}
        <Route
          path="/order"
          element={<OrderCard />}
        />


        {/* =========================
            AUTHENTICATION
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/update-password"
          element={<UpdatePassword />}
        />


        {/* =========================
            PROFILE / CARD
        ========================== */}

        <Route
          path="/profile-setup"
          element={<ProfileSetup />}
        />

        <Route
          path="/activate/:cardCode"
          element={<ActivateCard />}
        />

        <Route
          path="/u/:username"
          element={<PublicProfile />}
        />


        {/* =========================
            DASHBOARD
        ========================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/edit-profile"
          element={<EditProfile />}
        />


        {/* =========================
            404 FALLBACK
        ========================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;