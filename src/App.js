import React, { useState, useEffect } from 'react';
import './App.css';
import DiaryEntry from './components/DiaryEntry';
import NewEntryForm from './components/NewEntryForm';

function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    setEntries(storedEntries);
  }, []);

  const addEntry = (newEntry) => {
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Personal Diary</h1>
      </header>
      <main>
        <NewEntryForm onAddEntry={addEntry} />
        {entries.map((entry, index) => (
          <DiaryEntry key={index} {...entry} />
        ))}
      </main>
    </div>
  );
}

export default App;