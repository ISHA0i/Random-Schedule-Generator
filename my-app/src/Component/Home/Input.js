import React, { useState } from 'react';
import './Input.css'; // Import the CSS file
import { generateTimetable } from '../controlles/Generatetimetable'; // Import the generateTimetable function

function Input({ onGenerate }) {
  // State variables to hold user input
  const [subjects, setSubjects] = useState(['', '', '', '', '']);
  const [facultyCounts, setFacultyCounts] = useState(Array(5).fill(1)); // Number of faculty for each subject
  const [facultyNames, setFacultyNames] = useState(Array(5).fill([''])); // Faculty names for each subject
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
    newFacultyCounts[index] = value;
    setFacultyCounts(newFacultyCounts);

    // Adjust faculty names array based on the new count
    const newFacultyNames = Array.from({ length: 5 }, (_, i) => {
      if (i === index) {
        return Array(value).fill(''); // Reset faculty names for this subject
      }
      return facultyNames[i]; // Keep existing faculty names for other subjects
    });
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
    const timetable = generateTimetable({ subjects, facultyNames, hasLab, additionalInfo });
    onGenerate(timetable); // Pass the generated timetable to the parent component
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
