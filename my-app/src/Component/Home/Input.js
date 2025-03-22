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
  const [lectureCount, setLectureCount] = useState(Array(5).fill(2)); // Default 2 lectures per subject
  const [visitingFaculty, setVisitingFaculty] = useState([]);
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

  // Handle lecture count change
  const handleLectureCountChange = (index, value) => {
    const newLectureCount = [...lectureCount];
    newLectureCount[index] = parseInt(value) || 1;
    setLectureCount(newLectureCount);
  };

  // Add visiting faculty
  const addVisitingFaculty = () => {
    setVisitingFaculty([...visitingFaculty, { name: '', subject: '', day: 'MON', timeSlot: '09:50 to 10:45' }]);
  };

  // Remove visiting faculty
  const removeVisitingFaculty = (index) => {
    const newVisitingFaculty = [...visitingFaculty];
    newVisitingFaculty.splice(index, 1);
    setVisitingFaculty(newVisitingFaculty);
  };

  // Update visiting faculty info
  const updateVisitingFaculty = (index, field, value) => {
    const newVisitingFaculty = [...visitingFaculty];
    newVisitingFaculty[index] = { ...newVisitingFaculty[index], [field]: value };
    setVisitingFaculty(newVisitingFaculty);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure that the correct data is passed to generateTimetable
    const filteredSubjects = subjects.filter(subject => subject.trim() !== '');
    const filteredFacultyNames = facultyNames.filter((_, index) => subjects[index].trim() !== '');
    const filteredHasLab = hasLab.filter((_, index) => subjects[index].trim() !== '');
    const filteredLectureCount = lectureCount.filter((_, index) => subjects[index].trim() !== '');
    
    if (filteredSubjects.length === 0) {
      alert('Please enter at least one subject');
      return;
    }
    
    const timetable = generateTimetable({ 
      subjects: filteredSubjects, 
      facultyNames: filteredFacultyNames.map(names => names.filter(name => name)), 
      hasLab: filteredHasLab,
      lectureCount: filteredLectureCount,
      visitingFaculty: visitingFaculty
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
              <label>
                Lectures per week:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={lectureCount[index]}
                  onChange={(e) => handleLectureCountChange(index, e.target.value)}
                  className="lecture-count-field"
                />
              </label>
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

        {/* Visiting Faculty Section */}
        <div className="visiting-faculty-section">
          <h3>Visiting Faculty</h3>
          <button type="button" onClick={addVisitingFaculty} className="add-faculty-btn">
            Add Visiting Faculty
          </button>
          
          {visitingFaculty.map((faculty, index) => (
            <div key={index} className="visiting-faculty-card">
              <label>
                Name:
                <input
                  type="text"
                  value={faculty.name}
                  onChange={(e) => updateVisitingFaculty(index, 'name', e.target.value)}
                  className="faculty-field"
                />
              </label>
              <label>
                Subject:
                <input
                  type="text"
                  value={faculty.subject}
                  onChange={(e) => updateVisitingFaculty(index, 'subject', e.target.value)}
                  className="faculty-field"
                />
              </label>
              <label>
                Day:
                <select
                  value={faculty.day}
                  onChange={(e) => updateVisitingFaculty(index, 'day', e.target.value)}
                  className="day-select"
                >
                  <option value="MON">Monday</option>
                  <option value="TUE">Tuesday</option>
                  <option value="WED">Wednesday</option>
                  <option value="THU">Thursday</option>
                  <option value="FRI">Friday</option>
                  <option value="SAT">Saturday</option>
                </select>
              </label>
              <label>
                Time Slot:
                <select
                  value={faculty.timeSlot}
                  onChange={(e) => updateVisitingFaculty(index, 'timeSlot', e.target.value)}
                  className="time-select"
                >
                  <option value="07:30 to 8:25">07:30 to 8:25</option>
                  <option value="08:25 to 9:20">08:25 to 9:20</option>
                  <option value="09:50 to 10:45">09:50 to 10:45</option>
                  <option value="10:45 to 11:40">10:45 to 11:40</option>
                  <option value="11:50 to 12:45">11:50 to 12:45</option>
                  <option value="12:45 to 1:40">12:45 to 1:40</option>
                </select>
              </label>
              <button 
                type="button" 
                onClick={() => removeVisitingFaculty(index)}
                className="remove-faculty-btn"
              >
                Remove
              </button>
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
