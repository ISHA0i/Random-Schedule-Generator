import React, { useState } from 'react';
import './Input.css'; // Import the CSS file

function Input({ setCourses }) {
  const [courseName, setCourseName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [days, setDays] = useState('');

  const addCourse = () => {
    const newCourse = { courseName, startTime, endTime, days };
    setCourses((prevCourses) => [...prevCourses, newCourse]);
    // Clear input fields
    setCourseName('');
    setStartTime('');
    setEndTime('');
    setDays('');
  };

  return (
    <div className="input-container">
      <h1>Timetable Generator</h1>
      <input 
        type="text" 
        value={courseName} 
        onChange={(e) => setCourseName(e.target.value)} 
        placeholder="Course Name" 
        className="form-control" 
      />
      <input 
        type="time" 
        value={startTime} 
        onChange={(e) => setStartTime(e.target.value)} 
        className="form-control" 
      />
      <input 
        type="time" 
        value={endTime} 
        onChange={(e) => setEndTime(e.target.value)} 
        className="form-control" 
      />
      <input 
        type="text" 
        value={days} 
        onChange={(e) => setDays(e.target.value)} 
        placeholder="Days (e.g., Mon, Tue)" 
        className="form-control" 
      />
      <button onClick={addCourse} className="btn btn-primary">Add Course</button>
    </div>
  );
}

export default Input;
