import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Home from './Component/Home';
import Output from './Component/Detail/Output';
import { generateTimetable } from './Component/controlles/Generatetimetable';

function App() {
  const [timetableData, setTimetableData] = useState([]); // State to hold timetable data

  // Handle timetable generation
  const handleGenerateTimetable = (data) => {
    const timetable = generateTimetable(data);
    setTimetableData(timetable);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home onGenerate={handleGenerateTimetable} />} />
        <Route path="/detail" element={<Output timetableData={timetableData} />} />
      </Routes>
    </Router>
  );
}

export default App;