import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Truck, User, LogIn } from "lucide-react";
import "./Header.css";

export default function Header() {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState("employee");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // 🔹 kiểm soát ẩn/hiện form

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/support", label: "Support" },
    { path: "/contact", label: "Contact" },
  ];
  const [showMore, setShowMore] = useState(false);
  const [showServices, setShowServices] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert(
      `${
        activeTab === "employee" ? "Employee" : "Customer"
      } logged in successfully!`
    );
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
                      "/shipping-services",
                      "/shipping-services/tracking",
                      "/shipping-services/tracking/:trackingCode",
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
                  <li>
                    <Link
                      to="/shipping-services/tracking/123456"
                      className="dropdown-link block px-4 py-2 hover:bg-blue-100 text-gray-700 focus:bg-blue-100"
                      tabIndex={0}
                      onFocus={() => setShowServices(true)}
                    >
                      Tracking Detail
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

          <button
            className="login-btn, login-btn flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            onClick={() => setShowLogin(true)}
          >
            <LogIn size={18} />
            Login
          </button>
        </div>
      </header>

      {/* LOGIN / REGISTER POPUP */}
      {showLogin && (
        <div className="login-overlay">
          <div className="login-box">
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ×
            </button>

            <h3>Chọn loại tài khoản</h3>
            <p>Vui lòng chọn vai trò của bạn để đăng nhập hoặc đăng ký:</p>

            <div className="login-options">
              <button
                className="option-btn agent-btn"
                onClick={() => {
                  setShowLogin(false);
                  window.location.href = "/agent/login"; // hoặc dùng navigate('/agent/login')
                }}
              >
                Đăng nhập / Đăng ký Agent
              </button>

              <button
                className="option-btn customer-btn"
                onClick={() => {
                  setShowLogin(false);
                  window.location.href = "/customer/login";
                }}
              >
                Đăng nhập / Đăng ký Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
