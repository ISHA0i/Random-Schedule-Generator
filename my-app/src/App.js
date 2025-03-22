import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Input from './Component/Home/Input';
import Output from './Component/Detail/Output';

function App() {
  const [timetableData, setTimetableData] = useState([]);

  // Load timetable data from localStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem('timetableData');
    if (savedData) {
      setTimetableData(JSON.parse(savedData));
    }
  }, []);

  // Handle timetable generation
  const handleGenerateTimetable = (data) => {
    console.log("Setting timetable data in App.js:", data);
    setTimetableData(data);
    localStorage.setItem('timetableData', JSON.stringify(data));
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/input" />} />
        <Route path="/input" element={<Input onGenerate={handleGenerateTimetable} />} />
        <Route path="/output" element={<Output timetableData={timetableData} />} />
      </Routes>
    </Router>
  );
}

export default App;