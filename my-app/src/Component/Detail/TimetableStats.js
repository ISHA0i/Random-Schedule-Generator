import React from 'react';
import './TimetableStats.css';

function TimetableStats({ stats }) {
  if (!stats) {
    return <div className="stats-container">No statistics available</div>;
  }

  const { facultyStats, subjectStats, overallStats } = stats;

  return (
    <div className="stats-container">
      <h2>Timetable Statistics</h2>
      
      <div className="overall-stats">
        <h3>Overall Statistics</h3>
        <div className="stats-card">
          <p><strong>Total Slots:</strong> {overallStats.totalSlots}</p>
          <p><strong>Used Slots:</strong> {overallStats.usedSlots}</p>
          <p><strong>Free Slots:</strong> {overallStats.freeSlots}</p>
          <p><strong>Break Slots:</strong> {overallStats.breakSlots}</p>
          <p><strong>Utilization:</strong> {((overallStats.usedSlots / (overallStats.totalSlots - overallStats.breakSlots)) * 100).toFixed(2)}%</p>
        </div>
      </div>

      <div className="faculty-stats">
        <h3>Faculty Statistics</h3>
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Lectures</th>
                <th>Labs</th>
                <th>Total</th>
                <th>Subjects</th>
              </tr>
            </thead>
            <tbody>
              {facultyStats.map((faculty, index) => (
                <tr key={index}>
                  <td>{faculty.name}</td>
                  <td>{faculty.lectures}</td>
                  <td>{faculty.labs}</td>
                  <td>{faculty.lectures + faculty.labs}</td>
                  <td>{faculty.subjects.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="subject-stats">
        <h3>Subject Statistics</h3>
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Lectures</th>
                <th>Labs</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {subjectStats.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.name}</td>
                  <td>{subject.lectures}</td>
                  <td>{subject.labs}</td>
                  <td>{subject.lectures + subject.labs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TimetableStats; 