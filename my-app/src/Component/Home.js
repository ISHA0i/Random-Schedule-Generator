import React, { useState } from 'react';
import SubjectForm from './controlles/SubjectForm';
import { generateTimetable } from './controlles/Generatetimetable';
import TimetableView from './Home/TimetableView';
import './CSS/Home.css';

function Home() {
  const [timetableData, setTimetableData] = useState(null);
  const [showForm, setShowForm] = useState(true);
  
  const handleFormSubmit = (formData) => {
    const timetable = generateTimetable(formData);
    setTimetableData(timetable);
    setShowForm(false);
  };
  
  const handleReset = () => {
    setTimetableData(null);
    setShowForm(true);
  };

  return (
    <div className="home-container">
      <h1>Timetable Generator</h1>
      
      {showForm ? (
        <SubjectForm onSubmit={handleFormSubmit} />
      ) : (
        <div className="timetable-section">
          <TimetableView timetableData={timetableData} />
          <button className="reset-btn" onClick={handleReset}>
            Reset & Create New Timetable
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;