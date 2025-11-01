import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider, { useAuth } from "./auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Importing Components
import Header from "./components/NavBar/Header.jsx";
import { useState } from "react";

// Importing pages
import Home from "./pages/Home/Home.jsx";
import User from "./pages/User/User.jsx";
import Support from "./pages/Support/Support.jsx";
import About from "./pages/About/About.jsx";
import ShippingServices from "./pages/ShippingServices/ShippingServices.jsx";
import CreateShipment from "./pages/CreateShipment/CreateShipment.jsx";
import AdditionalDetails from "./pages/CreateShipment/AdditionalDetails.jsx";
import Payment from "./pages/CreateShipment/Payment.jsx";
import Confirmation from "./pages/CreateShipment/Confirmation.jsx";
import Tracking from "./pages/Tracking/Tracking.jsx";
import TrackingDetail from "./pages/TrackingDetail/TrackingDetail.jsx";
import Stories from "./pages/Stories/Stories.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Customer from "./pages/Customer";
import XpressAdminDashboard from "../src/components/adminpage/XpressAdminDashboard.jsx";
import AgentLogin from "./components/agentspage/AgentLogin.jsx";
import AgentRegister from "./components/agentspage/AgentRegister.jsx";
import AgentDashboard from "./components/agentspage/AgentDashboard.jsx";
import DashboardHome from "./components/agentspage/DashboardHome.jsx";
import AgentOrders from "./components/agentspage/AgentOrders.jsx";
import AgentEarnings from "./components/agentspage/AgentEarnings.jsx";
import AgentProfile from "./components/agentspage/AgentProfile.jsx";

function Guard({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

// Guard for Agent routes (uses separate token storage)
// function AgentGuard({ children }) {
//   const agentToken = localStorage.getItem("agentToken");
//   const agentUser = localStorage.getItem("agentUser");

//   if (!agentToken || !agentUser) {
//     return <Navigate to="/agent/login" replace />;
//   }

//   try {
//     const user = JSON.parse(agentUser);
//     if (user.role !== "agent") {
//       return <Navigate to="/agent/login" replace />;
//     }
//   } catch (e) {
//     return <Navigate to="/agent/login" replace />;
//   }

  return children;
}
// Guard for Customer routes (uses separate token storage)
function CustomerGuard({ children }) {
  const customerToken = localStorage.getItem("customerToken");
  const customerUser = localStorage.getItem("customerUser");

  if (!customerToken || !customerUser) {
    return <Navigate to="/customer/login" replace />;
  }

  try {
    const user = JSON.parse(customerUser);
    if (user.role !== "customer") {
      return <Navigate to="/customer/login" replace />;
    }
  } catch (e) {
    return <Navigate to="/customer/login" replace />;
  }

  return children;
}

function App() {
  const { user } = useAuth();
  const [adminBg, setAdminBg] = useState(null);
  const [adminName, setAdminName] = useState("Xpress Admin");

  // Helper to handle background upload
  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAdminBg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Only show Header if not on admin dashboard, agent login/register, and not admin
  const path = window.location.pathname;
  const hideHeader =
    (path === "/admin-dashboard" && user?.role === "admin") ||
    path === "/agent/login" ||
    path === "/agent/register" ||
    path === "/customer/login" ||
    path === "/customer/register" ||
    path === "/customer/CustomerRegister" ||
    path === "/customer/dashboard" ||
    path.startsWith("/agent/dashboard") ||
    path.startsWith("/agent/orders") ||
    path.startsWith("/agent/earnings") ||
    path.startsWith("/agent/profile");

  return (
    <main>
      <Router>
        {!hideHeader && <Header />}
        <Routes>
          {/* ...existing routes... */}
          <Route
            path="/customer/dashboard"
            element={
              <CustomerGuard>
                <CustomerDashboard />
              </CustomerGuard>
            }
          />
          <Route
            path="/shipping-services/shipment-info"
            element={<CreateShipment />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/shipping-services" element={<ShippingServices />} />
          <Route
            path="/shipping-services/shipment-info"
            element={<CreateShipment />}
          />
          <Route
            path="/shipping-services/additional-details/:shipmentID"
            element={<AdditionalDetails />}
          />
          <Route
            path="/shipping-services/payment/:shipmentID"
            element={<Payment />}
          />
          <Route
            path="/shipping-services/confirmation/:shipmentID"
            element={<Confirmation />}
          />
          <Route path="/shipping-services/tracking" element={<Tracking />} />
          <Route
            path="/shipping-services/tracking/:trackingCode"
            element={<TrackingDetail />}
          />
          <Route path="/stories" element={<Stories />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <Guard role="admin">
                <Admin />
              </Guard>
            }
          />
          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route path="/agent/register" element={<AgentRegister />} />
          <Route
            path="/agent/dashboard"
            element={
              <AgentGuard role="agent">
                <AgentDashboard />
              </AgentGuard>
            }
          >
            <Route index element={<DashboardHome />} />
          </Route>
          <Route
            path="/agent/orders"
            element={
              <AgentGuard role="agent">
                <AgentDashboard />
              </AgentGuard>
            }
          >
            <Route index element={<AgentOrders />} />
          </Route>
          <Route
            path="/agent/earnings"
            element={
              <AgentGuard role="agent">
                <AgentDashboard />
              </AgentGuard>
            }
          >
            <Route index element={<AgentEarnings />} />
          </Route>
          <Route
            path="/agent/profile"
            element={
              <AgentGuard role="agent">
                <AgentDashboard />
              </AgentGuard>
            }
          >
            <Route index element={<AgentProfile />} />
          </Route>
          <Route
            path="/customer"
            element={
              <Guard role="customer">
                <Customer />
              </Guard>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <Guard role="admin">
                <XpressAdminDashboard />
              </Guard>
            }
          />

          {/* Customer Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route
            path="/customer/CustomerRegister"
            element={<CustomerRegister />}
          />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
