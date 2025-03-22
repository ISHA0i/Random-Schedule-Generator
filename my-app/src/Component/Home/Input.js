import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Input.css'; // Import the CSS file
import { generateTimetable } from '../controlles/Generatetimetable'; // Import the generateTimetable function

function Input({ onGenerate }) {
  const navigate = useNavigate(); // Add navigation hook
  // State variables to hold user input
  const [subjects, setSubjects] = useState(['', '', '', '', '']);
  const [facultyCounts, setFacultyCounts] = useState(Array(5).fill(1)); // Number of faculty for each subject
  const [facultyNames, setFacultyNames] = useState(Array.from({ length: 5 }, () => [])); // Fixed faculty names initialization
  const [hasLab, setHasLab] = useState(Array(5).fill(false)); // Lab for each subject
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Handle change in subjects
  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  // Handle change in faculty count
  const handleFacultyCountChange = (index, value) => {
    const newFacultyCounts = [...facultyCounts];
    newFacultyCounts[index] = parseInt(value) || 1;
    setFacultyCounts(newFacultyCounts);

    // Adjust faculty names array based on the new count
    const newFacultyNames = [...facultyNames];
    const currentNames = newFacultyNames[index];
    newFacultyNames[index] = Array.from({ length: value }, (_, i) => currentNames[i] || '');
    setFacultyNames(newFacultyNames);
  };

  // Handle change in faculty names
  const handleFacultyNameChange = (subjectIndex, facultyIndex, value) => {
    const newFacultyNames = [...facultyNames];
    newFacultyNames[subjectIndex][facultyIndex] = value;
    setFacultyNames(newFacultyNames);
  };

  // Handle lab checkbox change
  const handleLabChange = (index) => {
    const newHasLab = [...hasLab];
    newHasLab[index] = !newHasLab[index];
    setHasLab(newHasLab);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure that the correct data is passed to generateTimetable
    const filteredSubjects = subjects.filter(subject => subject.trim() !== '');
    const filteredFacultyNames = facultyNames.filter((_, index) => subjects[index].trim() !== '');
    const filteredHasLab = hasLab.filter((_, index) => subjects[index].trim() !== '');
    
    if (filteredSubjects.length === 0) {
      alert('Please enter at least one subject');
      return;
    }
    
    const timetable = generateTimetable({ 
      subjects: filteredSubjects, 
      facultyNames: filteredFacultyNames.map(names => names.filter(name => name)), 
      hasLab: filteredHasLab 
    });
    
    console.log('Generated Timetable:', timetable);
    
    // Check if onGenerate is a function before calling it
    if (typeof onGenerate === 'function') {
      onGenerate(timetable);
    } else {
      console.warn('onGenerate is not a function');
      // Store in localStorage directly as a fallback
      localStorage.setItem('timetableData', JSON.stringify(timetable));
    }
    
    navigate('/output'); // Navigate to the output page
  };

  return (
    <div className="input-container">
      <h2>Enter Timetable Information</h2>
      <form onSubmit={handleSubmit} className="input-form">
        {/* Input fields for 5 main subjects */}
        <div className="subject-inputs">
          {subjects.map((subject, index) => (
            <div key={index} className="subject-card">
              <h3>Subject {index + 1}</h3>
              <label>
                Subject Name:
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  className="subject-field"
                />
              </label>
              <label>
                Number of Faculty:
                <input
                  type="number"
                  min="1"
                  value={facultyCounts[index]}
                  onChange={(e) => handleFacultyCountChange(index, e.target.value)}
                  className="faculty-count-field"
                />
              </label>
              {/* Faculty Names */}
              {Array.from({ length: facultyCounts[index] }, (_, facultyIndex) => (
                <label key={facultyIndex}>
                  Faculty Name {facultyIndex + 1}:
                  <input
                    type="text"
                    value={facultyNames[index][facultyIndex] || ''}
                    onChange={(e) => handleFacultyNameChange(index, facultyIndex, e.target.value)}
                    className="faculty-field"
                  />
                </label>
              ))}
              <label className="lab-checkbox">
                <input
                  type="checkbox"
                  checked={hasLab[index]}
                  onChange={() => handleLabChange(index)}
                />
                Lab Included
              </label>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="additional-info">
          <label>
            Additional Information:
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="info-textarea"
            />
          </label>
        </div>

        <button type="submit" className="submit-button">Generate Timetable</button>
      </form>
    </div>
  );
}

export default Input;
