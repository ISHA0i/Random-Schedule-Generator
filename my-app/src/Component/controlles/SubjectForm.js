import React, { useState } from 'react';
import '../CSS/SubjectForm.css';

const SubjectForm = ({ onSubmit }) => {
  // Initial time slots to match the ones used in Generatetimetable.js
  const timeSlots = [
    '07:30 to 8:25',
    '08:25 to 9:20',
    '09:50 to 10:45',
    '10:45 to 11:40',
    '11:50 to 12:45',
    '12:45 to 1:40',
  ];

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [subjectCount, setSubjectCount] = useState(5);
  const [subjectData, setSubjectData] = useState(Array(5).fill().map(() => ({
    subjectName: '',
    facultyNames: [''],
    hasLab: false,
    lectureCount: 2,
    isVisiting: false,
    visitingDays: [],
    visitingSlots: []
  })));

  const [freeSlots, setFreeSlots] = useState({
    MON: [],
    TUE: [],
    WED: [],
    THU: [],
    FRI: [],
    SAT: []
  });

  // Add a new subject
  const addSubject = () => {
    setSubjectCount(prevCount => prevCount + 1);
    setSubjectData(prevData => [
      ...prevData, 
      {
        subjectName: '',
        facultyNames: [''],
        hasLab: false,
        lectureCount: 2,
        isVisiting: false,
        visitingDays: [],
        visitingSlots: []
      }
    ]);
  };

  // Remove a subject
  const removeSubject = (index) => {
    setSubjectCount(prevCount => prevCount - 1);
    setSubjectData(prevData => prevData.filter((_, i) => i !== index));
  };

  // Update subject data
  const handleSubjectChange = (index, field, value) => {
    const newSubjectData = [...subjectData];
    newSubjectData[index][field] = value;
    setSubjectData(newSubjectData);
  };

  // Add faculty for a subject
  const addFaculty = (subjectIndex) => {
    const newSubjectData = [...subjectData];
    newSubjectData[subjectIndex].facultyNames.push('');
    setSubjectData(newSubjectData);
  };

  // Remove faculty for a subject
  const removeFaculty = (subjectIndex, facultyIndex) => {
    const newSubjectData = [...subjectData];
    newSubjectData[subjectIndex].facultyNames.splice(facultyIndex, 1);
    setSubjectData(newSubjectData);
  };

  // Update faculty name
  const handleFacultyChange = (subjectIndex, facultyIndex, value) => {
    const newSubjectData = [...subjectData];
    newSubjectData[subjectIndex].facultyNames[facultyIndex] = value;
    setSubjectData(newSubjectData);
  };

  // Toggle day selection for visiting faculty
  const toggleVisitingDay = (subjectIndex, day) => {
    const newSubjectData = [...subjectData];
    const currentDays = newSubjectData[subjectIndex].visitingDays;
    
    if (currentDays.includes(day)) {
      newSubjectData[subjectIndex].visitingDays = currentDays.filter(d => d !== day);
    } else {
      newSubjectData[subjectIndex].visitingDays.push(day);
    }
    
    setSubjectData(newSubjectData);
  };

  // Toggle slot selection for visiting faculty
  const toggleVisitingSlot = (subjectIndex, slot) => {
    const newSubjectData = [...subjectData];
    const currentSlots = newSubjectData[subjectIndex].visitingSlots;
    
    if (currentSlots.includes(slot)) {
      newSubjectData[subjectIndex].visitingSlots = currentSlots.filter(s => s !== slot);
    } else {
      newSubjectData[subjectIndex].visitingSlots.push(slot);
    }
    
    setSubjectData(newSubjectData);
  };

  // Handle free slot selection
  const toggleFreeSlot = (day, slot) => {
    setFreeSlots(prev => {
      const currentSlots = prev[day];
      if (currentSlots.includes(slot)) {
        return { ...prev, [day]: currentSlots.filter(s => s !== slot) };
      } else {
        return { ...prev, [day]: [...currentSlots, slot] };
      }
    });
  };

  // Toggle all slots for a day
  const toggleAllSlotsForDay = (day) => {
    setFreeSlots(prev => {
      const currentSlots = prev[day];
      if (currentSlots.length === timeSlots.length) {
        return { ...prev, [day]: [] };
      } else {
        return { ...prev, [day]: [...timeSlots] };
      }
    });
  };

  // Format data and submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the data for timetable generation
    const formattedData = {
      subjects: subjectData.map(subject => subject.subjectName),
      facultyNames: subjectData.map(subject => subject.facultyNames),
      hasLab: subjectData.map(subject => subject.hasLab),
      lectureCount: subjectData.map(subject => subject.lectureCount),
      visitingFaculty: [],
      freeSlots: freeSlots // Make sure this is included
    };

    // Add visiting faculty information
    subjectData.forEach((subject, index) => {
      if (subject.isVisiting) {
        subject.visitingDays.forEach(day => {
          subject.visitingSlots.forEach(timeSlot => {
            formattedData.visitingFaculty.push({
              name: subject.facultyNames[0] || 'Visitor',
              subject: subject.subjectName,
              day: day,
              timeSlot: timeSlot
            });
          });
        });
      }
    });

    console.log("Formatted data:", formattedData); // Debug
    onSubmit(formattedData);
  };

  return (
    <div className="subject-form-container">
      <h2>Configure Subjects</h2>
      <form onSubmit={handleSubmit}>
        {subjectData.map((subject, subjectIndex) => (
          <div key={subjectIndex} className="subject-card">
            <h3>Subject {subjectIndex + 1}</h3>
            
            <div className="form-group">
              <label>Subject Name:</label>
              <input
                type="text"
                value={subject.subjectName}
                onChange={(e) => handleSubjectChange(subjectIndex, 'subjectName', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Lecture Count:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={subject.lectureCount}
                onChange={(e) => handleSubjectChange(subjectIndex, 'lectureCount', parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={subject.hasLab}
                  onChange={(e) => handleSubjectChange(subjectIndex, 'hasLab', e.target.checked)}
                />
                Has Lab
              </label>
            </div>
            
            <div className="faculty-section">
              <h4>Faculty</h4>
              {subject.facultyNames.map((faculty, facultyIndex) => (
                <div key={facultyIndex} className="faculty-input">
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => handleFacultyChange(subjectIndex, facultyIndex, e.target.value)}
                    placeholder="Faculty Name"
                    required
                  />
                  {subject.facultyNames.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removeFaculty(subjectIndex, facultyIndex)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                className="add-btn"
                onClick={() => addFaculty(subjectIndex)}
              >
                Add Faculty
              </button>
            </div>
            
            <div className="visitor-section">
              <div className="form-group radio">
                <label>
                  <input
                    type="radio"
                    name={`visiting-${subjectIndex}`}
                    checked={!subject.isVisiting}
                    onChange={() => handleSubjectChange(subjectIndex, 'isVisiting', false)}
                  />
                  Regular Faculty
                </label>
                <label>
                  <input
                    type="radio"
                    name={`visiting-${subjectIndex}`}
                    checked={subject.isVisiting}
                    onChange={() => handleSubjectChange(subjectIndex, 'isVisiting', true)}
                  />
                  Visiting Faculty
                </label>
              </div>
              
              {subject.isVisiting && (
                <>
                  <div className="days-selection">
                    <h4>Select Days for Visiting Faculty</h4>
                    <div className="checkbox-group">
                      {weekDays.map(day => (
                        <label key={day}>
                          <input
                            type="checkbox"
                            checked={subject.visitingDays.includes(day)}
                            onChange={() => toggleVisitingDay(subjectIndex, day)}
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="slots-selection">
                    <h4>Select Time Slots for Visiting Faculty</h4>
                    <div className="checkbox-group">
                      {timeSlots.map(slot => (
                        <label key={slot}>
                          <input
                            type="checkbox"
                            checked={subject.visitingSlots.includes(slot)}
                            onChange={() => toggleVisitingSlot(subjectIndex, slot)}
                          />
                          {slot}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {subjectIndex >= 5 && (
              <button 
                type="button" 
                className="remove-subject-btn"
                onClick={() => removeSubject(subjectIndex)}
              >
                Remove Subject
              </button>
            )}
          </div>
        ))}
        
        {/* Free Slots Section */}
        <div className="free-slots-section">
          <h3>Free Slots Configuration</h3>
          <p>Select the time slots that should remain free (not scheduled)</p>
          
          {Object.keys(freeSlots).map(day => (
            <div key={day} className="day-checkbox">
              <div className="day-header">
                <h4>{day}</h4>
                <button 
                  type="button" 
                  className="select-all-btn" 
                  onClick={() => toggleAllSlotsForDay(day)}
                >
                  {freeSlots[day].length === timeSlots.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="checkbox-group">
                {timeSlots.map(slot => (
                  <label key={slot}>
                    <input
                      type="checkbox"
                      checked={freeSlots[day].includes(slot)}
                      onChange={() => toggleFreeSlot(day, slot)}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="add-subject-btn" onClick={addSubject}>
            Add Subject
          </button>
          <button type="submit" className="generate-btn">
            Generate Timetable
          </button>
        </div>
      </form>
      <div className="subject-count">
        <p>Total subjects: {subjectCount}</p>
      </div>
    </div>
  );
};

export default SubjectForm; 