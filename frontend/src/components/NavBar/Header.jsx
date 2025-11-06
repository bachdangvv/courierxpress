import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Truck, User, LogIn } from "lucide-react";
import "./Header.css";
import { useAuth } from "../../auth";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState("employee");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showServices, setShowServices] = useState(false);

  // user dropdown
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown on route change
  useEffect(() => {
    setOpenUserMenu(false);
  }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }
    if (openUserMenu) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openUserMenu]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/support", label: "Support" },
    { path: "/contact", label: "Contact" },
  ];

  const dashboardPath = (role) => {
    if (role === "customer") return "/customer/dashboard";
    if (role === "agent") return "/agent/dashboard";
    if (role === "admin") return "/admin/dashboard";
    return "/"; // fallback
  };

  const handleGotoDashboard = () => {
    navigate(dashboardPath(user?.role));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className={`rixetix-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Link to="/" className="logo">
            <Truck className="logo-icon" />
            <div className="logo-text">
              Courier
              <span className="logo-highlight">Xpress</span>
            </div>
          </Link>

          <nav className="nav-links">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li
                  key={item.path}
                  className={`nav-item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}

              <li
                className="nav-item relative"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <span
                  className={`cursor-pointer ${
                    [
                      "/shipping-services/shipment-info",
                      "/shipping-services/create-shipment",
                      "/shipping-services",
                      "/shipping-services/tracking",
                    ].includes(location.pathname)
                      ? "active"
                      : ""
                  }`}
                  tabIndex={0}
                  onFocus={() => setShowServices(true)}
                  onBlur={() => setShowServices(false)}
                >
                  Services
                </span>

                <ul
                  className={`dropdown-menu absolute left-0 mt-2 w-44 rounded z-10 ${
                    showServices ? "dropdown-open" : "dropdown-closed"
                  }`}
                  onMouseEnter={() => setShowServices(true)}
                  onMouseLeave={() => setShowServices(false)}
                >
                  <li>
                    <Link
                      to="/shipping-services/shipment-info"
                      className="dropdown-link block px-4 py-2 hover:bg-blue-100 text-gray-700 focus:bg-blue-100"
                      tabIndex={0}
                      onFocus={() => setShowServices(true)}
                    >
                      Create Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping-services"
                      className="dropdown-link block px-4 py-2 hover:bg-blue-100 text-gray-700 focus:bg-blue-100"
                      tabIndex={0}
                      onFocus={() => setShowServices(true)}
                    >
                      Shipping Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping-services/tracking"
                      className="dropdown-link block px-4 py-2 hover:bg-blue-100 text-gray-700 focus:bg-blue-100"
                      tabIndex={0}
                      onFocus={() => setShowServices(true)}
                    >
                      Tracking Order
                    </Link>
                  </li>
                </ul>
              </li>

              <li
                className="nav-item relative"
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => setShowMore(false)}
              >
                <span
                  className={`cursor-pointer ${
                    location.pathname === "/about" ||
                    location.pathname === "/stories"
                      ? "active"
                      : ""
                  }`}
                  tabIndex={0}
                  onFocus={() => setShowMore(true)}
                  onBlur={() => setShowMore(false)}
                >
                  More
                </span>
                <ul
                  className={`dropdown-menu absolute left-0 mt-2 w-36 rounded z-10 ${
                    showMore ? "dropdown-open" : "dropdown-closed"
                  }`}
                  onMouseEnter={() => setShowMore(true)}
                  onMouseLeave={() => setShowMore(false)}
                >
                  <li>
                    <Link
                      to="/about"
                      className="dropdown-link block px-4 py-2 hover:bg-blue-100 text-gray-700 focus:bg-blue-100"
                      tabIndex={0}
                      onFocus={() => setShowMore(true)}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/stories"
                      className="dropdown-link block px-4 py-2 hover:bg-blue-100 text-gray-700 focus:bg-blue-100"
                      tabIndex={0}
                      onFocus={() => setShowMore(true)}
                    >
                      Stories
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* Right side: Login or User menu */}
          {!user ? (
            <button
              className="login-btn flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              onClick={() => setShowLogin(true)}
            >
              <LogIn size={18} />
              Login
            </button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition"
                onClick={() => setOpenUserMenu((v) => !v)}
              >
                <User size={18} />
                <span className="hidden sm:inline">
                  {user.name || user.email || "Account"}
                </span>
              </button>

              {/* User dropdown */}
              <ul
                className={`dropdown-menu absolute right-0 mt-2 w-48 rounded z-20 ${
                  openUserMenu ? "dropdown-open" : "dropdown-closed"
                }`}
              >
                <li>
                  <button
                    className="dropdown-link w-full text-left px-4 py-2 hover:bg-blue-100 text-gray-700"
                    onClick={handleGotoDashboard}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-link w-full text-left px-4 py-2 hover:bg-blue-100 text-gray-700"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* LOGIN / REGISTER POPUP */}
      {showLogin && !user && (
        <div className="login-overlay">
          <div className="login-box">
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ×
            </button>

            <h3>Choose Account to Connect</h3>
            <p>Please choose type of account for signing in:</p>

            <div className="login-options">
              <button
                className="option-btn agent-btn"
                onClick={() => {
                  setShowLogin(false);
                  navigate("/agent/login");
                }}
              >
                Sign in as Agent
              </button>

              <button
                className="option-btn customer-btn"
                onClick={() => {
                  setShowLogin(false);
                  navigate("/customer/login");
                }}
              >
                Sign in / Register as Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
