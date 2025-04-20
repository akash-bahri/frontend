// Full Netflix-style frontend (React + Tailwind + Axios)
// Assumes backend routes are already available

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import MyList from './pages/MyList';
import Login from './pages/Login';

function App() {
  const [userId, setUserId] = useState(null);

  if (!userId) return <Login setUserId={setUserId} />;

  return (
    <Router>
      <div className="bg-black text-white min-h-screen">
        <nav className="flex justify-between items-center px-8 py-4 bg-zinc-900 shadow-md">
          <h1 className="text-2xl font-bold">MyFlix</h1>
          <div className="space-x-6">
            <Link to="/">Home</Link>
            <Link to="/recommendations">Recommendations</Link>
            <Link to="/my-list">My List</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home userId={userId} />} />
          <Route path="/recommendations" element={<Recommendations userId={userId} />} />
          <Route path="/my-list" element={<MyList userId={userId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
