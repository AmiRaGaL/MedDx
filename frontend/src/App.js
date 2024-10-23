import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Make sure your paths are correct
import Register from './components/Register';
import Patients from './components/Patients';
import Community from './components/Community';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/community" element={<Community />} />
          <Route path="/" element={<h1>Welcome to the Healthcare System</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
