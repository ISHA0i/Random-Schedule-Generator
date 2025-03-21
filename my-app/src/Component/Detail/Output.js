import React from 'react';
import './Output.css'; // Import the CSS file

function Output({ courses = [] }) { // Provide a default value for courses
  return (
    <div className="output-container">
      <h2 className="text-center">Your Timetable</h2>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>Course</th>
            <th>Days</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <tr key={index}>
                <td>{course.courseName}</td>
                <td>{course.days}</td>
                <td>{`${course.startTime} - ${course.endTime}`}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No courses added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Output;