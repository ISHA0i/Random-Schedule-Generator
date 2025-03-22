import React from 'react';
import { Link } from 'react-router-dom';
import Input from './Home/Input';

function Home({ onGenerate }) {
  return (
    <div>
      <Input onGenerate={onGenerate} />
    </div>
  );
}

export default Home;