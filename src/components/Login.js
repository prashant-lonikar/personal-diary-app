import React, { useState } from 'react';

function Login({ onLogin, hasPassword }) {
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
    <div className="login">
      <h2>{hasPassword ? 'Enter Password' : 'Create Password'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={hasPassword ? 'Enter password' : 'Create password'}
          required
        />
        {!hasPassword && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
        )}
        <button type="submit">{hasPassword ? 'Login' : 'Create Password'}</button>
      </form>
    </div>
  );
}

export default Login;