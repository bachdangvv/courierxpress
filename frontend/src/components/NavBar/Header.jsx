import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Truck, User, LogIn, Menu, X } from "lucide-react"; // thêm Menu & X
import "./Header.css";
import { useAuth } from "../../auth";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NEW

  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setOpenUserMenu(false), [location.pathname]);

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
    return "/";
  };

  const handleGotoDashboard = () => navigate(dashboardPath(user?.role));
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <header className={`rixetix-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <Truck className="logo-icon" />
            <div className="logo-text">
              Courier<span className="logo-highlight">Xpress</span>
            </div>
          </Link>

          {/* Hamburger Icon */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Nav Links */}
          <nav
            className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
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

              {/* SERVICES */}
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
                >
                  Services
                </span>

                <ul
                  className={`dropdown-menu absolute left-0 mt-2 w-44 rounded z-10 ${
                    showServices ? "dropdown-open" : "dropdown-closed"
                  }`}
                >
                  <li>
                    <Link to="/shipping-services/shipment-info">
                      Create Order
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-services">Shipping Services</Link>
                  </li>
                  <li>
                    <Link to="/shipping-services/tracking">Tracking Order</Link>
                  </li>
                </ul>
              </li>

              {/* MORE */}
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
                >
                  More
                </span>
                <ul
                  className={`dropdown-menu absolute left-0 mt-2 w-36 rounded z-10 ${
                    showMore ? "dropdown-open" : "dropdown-closed"
                  }`}
                >
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <Link to="/stories">Stories</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* Right side */}
          {!user ? (
            <button
              className="login-btn flex items-center gap-2"
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

      {/* LOGIN POPUP (giữ nguyên như cũ) */}
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
