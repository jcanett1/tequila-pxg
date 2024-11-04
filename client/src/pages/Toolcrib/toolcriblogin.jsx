import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Toolcrib/Footer';
import '../Toolcrib/Appinv.css';

const Toolcriblogin = ({ setIsAuthenticated, setUserEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Credenciales válidas (simulación)
  const validCredentials = {
    email: 'jcanett@pxg.com',
    password: 'Edel1ewy',
  };

  // Manejo del evento de inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault();

    // Verificar que la autenticación y la redirección están funcionando correctamente
    if (email === validCredentials.email && password === validCredentials.password) {
      setIsAuthenticated(true);
      console.log('Usuario autenticado, redirigiendo a /menu...');
      setUserEmail(email);
      console.log('Autenticación exitosa, redirigiendo a /menu');
      navigate('/menu'); // Asegúrate que la ruta coincida con lo definido en App.js
    } else {
      setLoginError('¡Correo o contraseña incorrectos!');
    }
  };

  return (
    <div className="login-background d-flex flex-column">
      {/* Encabezado con un Navbar básico */}
      <header className="navbar bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <nav>
          <ul className="nav">
            <li className="nav-item"></li>
          </ul>
        </nav>
      </header>

      {/* Contenido del formulario de inicio de sesión */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        <h1
          className="titulo-inventario"
          style={{
            fontFamily: 'Arial',
            color: '#000',
            fontSize: '45px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: '60px',
            marginBottom: '15px',
            marginLeft: '10px',
          }}
        >
          INVENTARIO PXG TEQUILA
        </h1>
        <div className="col-lg-4 col-md-5 col-sm-10 col-xs-12">
          <div className="card rounded-0 shadow">
            <div className="card-header">
              <div
                className="card-title h3 text-center mb-0 fw-bold"
                style={{ fontSize: '30px', color: '#fff', marginBottom: '10px' }}
              >
                INGRESAR CREDENCIALES
              </div>
            </div>
            <div className="card-body center-body">
              <form onSubmit={handleLogin}>
                {loginError && (
                  <div
                    className="alert alert-danger rounded-0 py-1"
                    style={{ fontSize: '17px' }}
                  >
                    {loginError}
                  </div>
                )}
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="control-label"
                    style={{ fontSize: '20px', color: '#fff' }}
                  >
                    Correo
                  </label>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    className="form-control rounded-0"
                    placeholder="Dirección de Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ fontSize: '17px', textAlign: 'center' }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="control-label"
                    style={{ fontSize: '20px', color: '#fff' }}
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-0"
                    id="password"
                    name="pwd"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ fontSize: '17px', textAlign: 'center' }}
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-0"
                    style={{
                      fontSize: '17px',
                      backgroundColor: '#000',
                      color: '#fff',
                      padding: '10px 20px',
                      textAlign: 'center',
                      border: '1px solid #fff',
                    }}
                  >
                    Acceder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Toolcriblogin;

