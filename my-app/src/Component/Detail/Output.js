import React from 'react';
import './Output.css'; // Import CSS file for styling

function Output({ timetableData = [] }) {
  // Define days of the week for the timetable
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Define the time slots for each lecture
  const timeSlots = [
    '07:30 to 8:25',
    '08:25 to 9:20',
    'BREAK (9:20 to 9:50)', // Break 1
    '09:50 to 10:45',
    '10:45 to 11:40',
    'BREAK (11:40 to 11:50)', // Break 2
    '11:50 to 12:45',
    '12:45 to 1:40',
  ];

  // Log timetable data for debugging
  console.log('Days of Week:', daysOfWeek);
  console.log('Time Slots:', timeSlots);
  console.log('Timetable Data:', timetableData);

  return (
    <div className="output-container">
      {/* Timetable heading */}
      <h2 className="text-center">Your Timetable</h2>

      {/* Timetable table with borders */}
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>Time</th>
            {/* Render day headers dynamically */}
            {daysOfWeek.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render timetable data here */}
          {timetableData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.time}</td>
              {daysOfWeek.map((day, i) => (
                <td key={i}>{entry.subjects[i] || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Export the Output component to be used in other parts of the application
export default Output;
