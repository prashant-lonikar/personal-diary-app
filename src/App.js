import React, { useState, useEffect } from 'react';
import './App.css';
import DiaryEntry from './components/DiaryEntry';
import NewEntryForm from './components/NewEntryForm';
import Login from './components/Login';

function App() {
  const [entries, setEntries] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || {};
    setEntries(storedEntries);
  }, []);

  const addEntry = (newEntry) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const updatedEntries = { ...entries };
    if (!updatedEntries[date]) {
      updatedEntries[date] = [];
    }
    updatedEntries[date].unshift({ ...newEntry, time, id: Date.now() });
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
  };

  const editEntry = (date, newEntries) => {
    const updatedEntries = { ...entries };
    updatedEntries[date] = newEntries;
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
  };

  const deleteEntry = (date) => {
    const updatedEntries = { ...entries };
    delete updatedEntries[date];
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
  };

  const handleLogin = (password) => {
    const storedPassword = localStorage.getItem('diaryPassword');
    if (!storedPassword) {
      localStorage.setItem('diaryPassword', password);
      setIsLoggedIn(true);
    } else if (password === storedPassword) {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleChangePassword = () => {
    localStorage.setItem('diaryPassword', newPassword);
    setShowChangePassword(false);
    setNewPassword('');
    alert('Password changed successfully');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Personal Diary</h1>
        <button onClick={() => setShowChangePassword(!showChangePassword)}>
          Change Password
        </button>
      </header>
      <main>
        <NewEntryForm onAddEntry={addEntry} />
        {showChangePassword && (
          <div className="change-password">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button onClick={handleChangePassword}>Save New Password</button>
          </div>
        )}
        {Object.entries(entries).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, dayEntries]) => (
          <DiaryEntry 
            key={date}
            date={date}
            entries={dayEntries}
            onEdit={(newEntries) => editEntry(date, newEntries)}
            onDelete={() => deleteEntry(date)}
          />
        ))}
      </main>
    </div>
  );
}

export default App;