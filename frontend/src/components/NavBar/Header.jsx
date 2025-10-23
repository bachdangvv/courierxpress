import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Truck, User, LogIn } from "lucide-react";
import './Header.css';

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
    { path: "/services", label: "Services" },
    { path: "/fleet", label: "Fleet" },
    { path: "/contact", label: "Contact" },
    { path: "/more", label: "More" },
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert(
      `${
        activeTab === "employee" ? "Employee" : "Customer"
      } logged in successfully!`
    );
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert(
      `${
        activeTab === "employee" ? "Agent" : "Customer"
      } registered successfully!`
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

            {/* Tabs cho Agent / Customer */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === "employee" ? "active" : ""}`}
                onClick={() => setActiveTab("employee")}
              >
                Agent
              </button>
              <button
                className={`tab ${activeTab === "customer" ? "active" : ""}`}
                onClick={() => setActiveTab("customer")}
              >
                Customer
              </button>
            </div>

            {/* FORM LOGIN */}
            {!isRegister && (
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <h3>Login</h3>
                <input type="text" placeholder="Username" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" className="submit-btn">
                  {activeTab === "employee"
                    ? "Login as Employee"
                    : "Login as Customer"}
                </button>
                <p className="switch-text">
                  Chưa có tài khoản?{" "}
                  <span
                    className="switch-link"
                    onClick={() => setIsRegister(true)}
                  >
                    Đăng ký tại đây
                  </span>
                </p>
              </form>
            )}

            {/* FORM REGISTER */}
            {isRegister && (
              <form className="register-form" onSubmit={handleRegisterSubmit}>
                <h3>Register</h3>
                <input type="text" placeholder="Full Name" required />
                <input type="text" placeholder="Username" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" className="submit-btn register-btn">
                  {activeTab === "employee"
                    ? "Register as Agent"
                    : "Register as Customer"}
                </button>
                <p className="switch-text">
                  Đã có tài khoản?{" "}
                  <span
                    className="switch-link"
                    onClick={() => setIsRegister(false)}
                  >
                    Đăng nhập tại đây
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
