import React from 'react';
import '../CSS/TimetableView.css';

const TimetableView = ({ timetableData }) => {
  if (!timetableData) return <div>No timetable data available</div>;

  const { schedule, stats } = timetableData;

  return (
    <div className="timetable-view">
      <h2>Generated Timetable</h2>
      
      <div className="timetable-container">
        <table className="timetable">
          <thead>
            <tr>
              <th>Time</th>
              <th>MON</th>
              <th>TUE</th>
              <th>WED</th>
              <th>THU</th>
              <th>FRI</th>
              <th>SAT</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <tr key={index} className={row.time.includes('BREAK') ? 'break-row' : ''}>
                <td>{row.time}</td>
                <td>{row.MON}</td>
                <td>{row.TUE}</td>
                <td>{row.WED}</td>
                <td>{row.THU}</td>
                <td>{row.FRI}</td>
                <td>{row.SAT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="stats-section">
        <h3>Statistics</h3>
        
        <div className="stats-container">
          <div className="stats-card">
            <h4>Overall Stats</h4>
            <ul>
              <li>Total Slots: {stats.overallStats.totalSlots}</li>
              <li>Used Slots: {stats.overallStats.usedSlots}</li>
              <li>Free Slots: {stats.overallStats.freeSlots}</li>
              <li>Break Slots: {stats.overallStats.breakSlots}</li>
            </ul>
          </div>
          
          <div className="stats-card">
            <h4>Faculty Stats</h4>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Lectures</th>
                  <th>Labs</th>
                  <th>Subjects</th>
                </tr>
              </thead>
              <tbody>
                {stats.facultyStats.map((faculty, index) => (
                  <tr key={index}>
                    <td>{faculty.name}</td>
                    <td>{faculty.lectures}</td>
                    <td>{faculty.labs}</td>
                    <td>{faculty.subjects.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="stats-card">
            <h4>Subject Stats</h4>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Lectures</th>
                  <th>Labs</th>
                </tr>
              </thead>
              <tbody>
                {stats.subjectStats.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.name}</td>
                    <td>{subject.lectures}</td>
                    <td>{subject.labs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableView; 