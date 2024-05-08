import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login({ handleLogin, handleRegister }) {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');

  const backgroundImageUrl = 'https://architectureforlondon.com/wp-content/uploads/2021/02/feasibility-study-building-massing.jpg';

  const formStyle = {
    width: '80%', // Adjusted width for responsiveness
    maxWidth: '800px',
    padding: '40px', // Reduced padding for smaller screens
    backgroundColor: '#141b2d',
    borderRadius: '20px',
    border: '5px solid #43ce9e',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    marginBottom: '15px',
    borderRadius: '10px',
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#43ce9e',
    color: 'white',
    cursor: 'pointer',
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      handleLogin(username, password);
    } else {
      handleRegister({ username, email, phone, organization, password });
    }
  };

  return (
    <Grid container style={{ height: '100%' }}>
      <Grid item xs={12} sm={6} style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></Grid>
      <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper style={formStyle} elevation={3}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Button variant={activeTab === 'login' ? 'contained' : 'outlined'} onClick={() => setActiveTab('login')} style={{ marginRight: '20px', backgroundColor: activeTab === 'login' ? '#43ce9e' : 'transparent', color: activeTab === 'login' ? 'white' : '#43ce9e', borderRadius: '5px' }}>
              Login
            </Button>
            <Button variant={activeTab === 'register' ? 'contained' : 'outlined'} onClick={() => setActiveTab('register')} style={{ backgroundColor: activeTab === 'register' ? '#43ce9e' : 'transparent', color: activeTab === 'register' ? 'white' : '#43ce9e', borderRadius: '5px' }}>
              Register
            </Button>
          </div>
          <form onSubmit={handleFormSubmit}>
            {(activeTab === 'login' || activeTab === 'register') && (
              <>
                <TextField type="text" label="Username" style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} required />
                {activeTab === 'register' && (
                  <>
                    <TextField type="email" label="Email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextField type="tel" label="Phone" style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <TextField type="text" label="Organization" style={inputStyle} value={organization} onChange={(e) => setOrganization(e.target.value)} required />
                  </>
                )}
                <TextField type="password" label="Password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" variant="contained" style={submitButtonStyle}>{activeTab === 'login' ? 'Login' : 'Register'}</Button>
              </>
            )}
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
