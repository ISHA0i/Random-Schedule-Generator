import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectForm from '../controlles/SubjectForm';
import { generateTimetable } from '../controlles/Generatetimetable';
import './Input.css';

function Input({ onGenerate }) {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log("Input.js received form data:", formData);
    
    // Generate timetable with the form data
    const timetableData = generateTimetable(formData);
    console.log("Generated timetable data:", timetableData);
    
    // Pass the generated data up to App.js
    onGenerate(timetableData);
    
    // Navigate to the output page
    navigate('/output');
  };

  const handleGenerate = (data) => {
    console.log("Generating timetable with data:", data);
    // Make sure freeSlots is included in the data passed to onGenerate
    onGenerate(data);
  };

  return (
    <div className="input-container">
      <h2>Timetable Generator</h2>
      <SubjectForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Input;
