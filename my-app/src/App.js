import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Home from './Component/Home';
import Detail from './Component/Detail';

function App() {
  const [courses, setCourses] = useState([]); // State to hold courses

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home setCourses={setCourses} />} />
        <Route path="/detail" element={<Detail courses={courses} />} />
      </Routes>
    </Router>
  );
}

export default App;