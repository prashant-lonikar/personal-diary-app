import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function Login({ onLogin, hasPassword, darkMode }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasPassword) {
      onLogin(password);
    } else {
      if (password === confirmPassword) {
        onLogin(password, true);
      } else {
        alert("Passwords don't match. Please try again.");
      }
    }
  };

  return (
    <Container className={`d-flex align-items-center justify-content-center vh-100 ${darkMode ? 'dark-mode' : ''}`}>
      <Card className={`shadow-lg ${darkMode ? 'bg-dark text-light' : ''}`} style={{ width: '20rem' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <FontAwesomeIcon icon={faLock} size="3x" className="text-primary" />
          </div>
          <Card.Title className="text-center mb-4">{hasPassword ? 'Enter Password' : 'Create Password'}</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={hasPassword ? 'Enter password' : 'Create password'}
                required
                className={darkMode ? 'bg-dark text-light' : ''}
              />
            </Form.Group>
            {!hasPassword && (
              <Form.Group controlId="confirmPassword" className="mt-3">
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className={darkMode ? 'bg-dark text-light' : ''}
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" className="w-100 mt-4">
              {hasPassword ? 'Login' : 'Create Password'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;