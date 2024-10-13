import React, { useState, useEffect, useCallback } from 'react';
import NavbarComponent from './components/NavbarComponent';
import { Container, Navbar, Nav, Button, Form, FormControl, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faSearch } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import DiaryEntry from './components/DiaryEntry';
import NewEntryForm from './components/NewEntryForm';
import Login from './components/Login';
import Spinner from './components/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState({});
  const [visibleEntries, setVisibleEntries] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || {};
    setEntries(storedEntries);
    const storedPassword = localStorage.getItem('diaryPassword');
    setHasPassword(!!storedPassword);
  }, []);

  useEffect(() => {
    loadMoreEntries();
  }, [entries]);

  const loadMoreEntries = useCallback(() => {
    const sortedEntries = Object.entries(entries).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    const nextEntries = sortedEntries.slice(visibleEntries.length, visibleEntries.length + 10);
    setVisibleEntries(prevEntries => [...prevEntries, ...nextEntries]);
    setHasMore(visibleEntries.length + nextEntries.length < sortedEntries.length);
  }, [entries, visibleEntries]);

  const addEntry = (newEntry) => {
    const date = new Date().toLocaleDateString();
    const updatedEntries = { ...entries };
    if (!updatedEntries[date]) {
      updatedEntries[date] = [];
    }
    updatedEntries[date].unshift({ ...newEntry, id: Date.now() });
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setVisibleEntries([]); // Reset visible entries to trigger a re-render
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  const filterEntries = (entries, term) => {
    if (!term) return entries;
    return Object.fromEntries(
      Object.entries(entries).filter(([date, dayEntries]) =>
        dayEntries.some(entry => 
          entry.content.toLowerCase().includes(term.toLowerCase()) ||
          date.includes(term)
        )
      )
    );
  };

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const filteredEntries = filterEntries(entries, searchTerm);
    setVisibleEntries(Object.entries(filteredEntries).slice(0, 10));
    setHasMore(Object.keys(filteredEntries).length > 10);
  }, [entries, searchTerm]);

  const handleLogin = (password, isNewPassword = false) => {
    const storedPassword = localStorage.getItem('diaryPassword');
    if (!storedPassword && isNewPassword) {
      // First time setup
      localStorage.setItem('diaryPassword', password);
      setIsLoggedIn(true);
      setHasPassword(true);
    } else if (storedPassword && password === storedPassword) {
      // Correct password
      setIsLoggedIn(true);
    } else {
      // Incorrect password
      alert('Incorrect password');
    }
  };

  const handleChangePassword = (newPassword) => {
    const oldPassword = localStorage.getItem('diaryPassword');
    if (oldPassword === newPassword) {
      alert('New password must be different from the current password');
    } else {
      localStorage.setItem('diaryPassword', newPassword);
      alert('Password changed successfully');
    }
  };

  const editEntry = (date, newEntries) => {
    const updatedEntries = { ...entries, [date]: newEntries };
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setVisibleEntries([]);
    loadMoreEntries();
  };

  const deleteEntry = (date) => {
    const updatedEntries = { ...entries };
    delete updatedEntries[date];
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setVisibleEntries([]);
    loadMoreEntries();
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} hasPassword={hasPassword} darkMode={darkMode} />;
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {isLoggedIn ? (
        <>
          <NavbarComponent 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            handleChangePassword={handleChangePassword}
          />
      <Container className="mt-5 pt-3">
        <NewEntryForm onAddEntry={addEntry} darkMode={darkMode} />
        <InfiniteScroll
          dataLength={visibleEntries.length}
          next={loadMoreEntries}
          hasMore={hasMore}
          loader={<Spinner />}
          endMessage={<p className="text-center">You've reached the end of your diary!</p>}
        >
          {visibleEntries.map(([date, dayEntries]) => (
            <DiaryEntry 
              key={date}
              date={date}
              entries={dayEntries}
              onEdit={(newEntries) => editEntry(date, newEntries)}
              onDelete={() => deleteEntry(date)}
              darkMode={darkMode}
            />
          ))}
        </InfiniteScroll>
      </Container>
      </>
    ) : (
        <Login onLogin={handleLogin} hasPassword={hasPassword} darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;