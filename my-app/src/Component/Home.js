import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from './Home/Input'; // Correct the path
import './CSS/Home.css'; // Import your CSS for styling

function Home() {
  const [courses, setCourses] = useState([]); // Correctly destructure useState

  return (
    <div className="home-container">
      <Input setCourses={setCourses} /> {/* Use the Input component */}
      <Link to="/detail" className="btn btn-primary mt-3">View Timetable</Link>
    </div>
  );
}

export default Home;