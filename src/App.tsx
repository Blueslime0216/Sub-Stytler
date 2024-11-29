import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [a, setA] = useState('Hello Worldddd');
  
  return (
    <div className="App">
      <h1>{ a }</h1>
    </div>
  );
}

export default App;
