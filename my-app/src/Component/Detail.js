import React from 'react';
import Output from './Detail/Output';

function Detail({ courses }) {
  return (
    <div>
      <Output courses={courses} /> {/* Pass courses as a prop */}
    </div>
  );
}

export default Detail;