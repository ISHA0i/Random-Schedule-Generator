import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Output.css';
import TimetableStats from './TimetableStats';

function Output() {
  const [timetableData, setTimetableData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve timetable data from localStorage
    const storedData = localStorage.getItem('timetableData');
    if (storedData) {
      setTimetableData(JSON.parse(storedData));
    } else {
      console.error('No timetable data found in localStorage');
    }
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!timetableData) {
    return <div className="loading">Loading timetable data...</div>;
  }

  const { schedule, stats } = timetableData;

  // Check if schedule is defined
  if (!schedule) {
    return <div className="error">No schedule data available.</div>;
  }

  // Prepare data for display with merged break rows
  const displayRows = [];
  
  schedule.forEach((row, index) => {
    if (row.time.includes('BREAK')) {
      // For break rows, create a special row with colspan for all days
      displayRows.push({
        time: row.time,
        isBreak: true
      });
    } else {
      // For regular rows, use the data as is
      displayRows.push(row);
    }
  });

  return (
    <div className="output-container">
      <h2>Generated Timetable</h2>
      
      <div className="timetable-wrapper">
        <table className="timetable">
          <thead>
            <tr>
              <th>Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, rowIndex) => (
              row.isBreak ? (
                // Render break row with colspan for all days
                <tr key={rowIndex} className="break-row">
                  <td colSpan="7" className="break-cell">{row.time}</td>
                </tr>
              ) : (
                // Render regular row
                <tr key={rowIndex}>
                  <td>{row.time}</td>
                  <td>{row.MON}</td>
                  <td>{row.TUE}</td>
                  <td>{row.WED}</td>
                  <td>{row.THU}</td>
                  <td>{row.FRI}</td>
                  <td>{row.SAT}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      
      {stats && <TimetableStats stats={stats} />}
      
      <div className="button-group">
        <button onClick={handleBack} className="back-button">Back to Input</button>
        <button onClick={handlePrint} className="print-button">Print Timetable</button>
      </div>
    </div>
  );
}

export default Output;
