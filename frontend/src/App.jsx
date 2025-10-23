import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importing Components
import Header from './components/NavBar/Header.jsx';

// Importing pages
import Home from './pages/Home/Home.jsx';
import User from './pages/User/User.jsx';
import Help from './pages/About/About.jsx';
import About from './pages/About/About.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
    </main>
  );
}

export default App;