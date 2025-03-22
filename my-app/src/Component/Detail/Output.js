import React from 'react';
import './Output.css'; // Import CSS file for styling

function Output({ timetableData = [] }) {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  console.log("Received timetable data in Output.js:", timetableData);

  return (
    <div className="output-container">
      <h2 className="text-center">Your Timetable</h2>
      {timetableData.length === 0 ? (
        <p>No timetable data available. Please generate a timetable first.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Time</th>
              {daysOfWeek.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetableData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.time}</td>
                {daysOfWeek.map((day) => (
                  <td key={day}>{entry[day] || '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Output;
