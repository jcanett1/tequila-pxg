import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Loginpage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Enviar solicitud de inicio de sesión al backend
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { 
        username, 
        password 
      });

      // Almacenar el token recibido en el localStorage (si lo usas)
      localStorage.setItem('token', response.data.token);

      // Redirigir a la página principal (o la que definas)
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al comunicarse con el servidor');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: '1.8', position: 'relative' }}>
        <img src="/loginfondo.webp" alt="loginfondo" className='fondologin'/>
      </div>
      <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
        <form style={{ marginTop: 100 }} className='form' onSubmit={handleLogin}>
          <label className='title'>
            Enter Credentials
          </label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            style={{ marginTop: 30 }}
            placeholder='Username'
            type="text"
            className='input-user'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            placeholder='Password'
            type="password"
            className='input-user'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className='button-login' type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
