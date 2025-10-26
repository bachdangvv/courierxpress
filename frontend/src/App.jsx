import React from 'react';
import ReactDOM from "react-dom/client";
import AuthProvider, { useAuth } from "./auth";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importing Components
import Header from './components/NavBar/Header.jsx';

// Importing pages
import Home from './pages/Home/Home.jsx';
import User from './pages/User/User.jsx';
import Help from './pages/About/About.jsx';
import About from './pages/About/About.jsx';
import Tracking from './pages/Tracking/Tracking.jsx';
import TrackingDetail from './pages/TrackingDetail/TrackingDetail.jsx';
import Stories from './pages/Stories/Stories.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Login from "./pages/login.jsx";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Agent from "./pages/Agent";
import Customer from "./pages/Customer";

function Guard({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace/>;
  if (role && user.role !== role) return <Navigate to="/" replace/>;
  return children;
}

function App() {
  return (
    <main>
      <Router>
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path='/about' element={<About />} />
            <Route path='/help' element={<Help />} />
            <Route path='/tracking' element={<Tracking />} />
            <Route path='/tracking/:trackingCode' element={<TrackingDetail />} />
            <Route path='/stories' element={<Stories />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/admin" element={<Guard role="admin"><Admin/></Guard>}/>
          <Route path="/agent" element={<Guard role="agent"><Agent/></Guard>}/>
          <Route path="/customer" element={<Guard role="customer"><Customer/></Guard>}/>
          </Routes>
        </Router>
    </main>
  );
}



export default App;