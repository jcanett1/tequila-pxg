
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = ({ setIsAuthenticated, userEmail }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleDropdown = (dropdownName) => {
    // Cambia el dropdown activo solo si el dropdown actual es diferente
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/public/tool_crib.jpg")', // Cambia esta ruta a la de tu imagen
        backgroundSize: 'cover', // Ajusta el tamaño de la imagen para cubrir todo el fondo
        backgroundPosition: 'center', // Centra la imagen en el contenedor
        minHeight: '100vh', // Asegúrate de que el contenedor cubra toda la altura de la pantalla
      }}
    >
      <header className="header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h1 className="h1-with-image">
            <img
              src="/public/PXG_logo.png"
              alt="PXG"
              onClick={handleRefresh}
              style={{ cursor: 'pointer' }}
            />
          </h1>
          <h1
            style={{
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontSize: 14,
              color: 'black',
              marginLeft: 14,
              marginTop: 6,
            }}
          >
            Inventarios Tequila
          </h1>
        </div>
        <nav className="nav d-flex flex-column align-items-start">
      
     {/* Botón de Inicio */}
<div className="dropdown">
  <button
    className="nav-link btn btn-primary menu-button"
    onClick={() => navigate('/menu')}
  >
    Inicio
  </button>
</div>

          {/* Dropdown para Clientes */}
          <div
            className={`dropdown ${activeDropdown === 'clientes' ? 'show' : ''}`}
            onClick={() => toggleDropdown('clientes')}
          >




            
            <button className="nav-link btn btn-primary menu-button">Empleados</button>
            {activeDropdown === 'clientes' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/customer')}>
                  CELDAS
                </a>
                <a className="dropdown-item" onClick={() => navigate('/customer/tecnicos')}>
                  TECNICOS
                </a>
                <a className="dropdown-item" onClick={() => navigate('/customer/oficinas')}>
                  OFICINAS
                </a>
                <a className="dropdown-item" onClick={() => navigate('/customer/supervisores')}>
                  SUPERVISORES
                </a>
              </div>
            )}
          </div>
      
          <div
            className={`dropdown ${activeDropdown === 'Entradas' ? 'show' : ''}`}
            onClick={() => toggleDropdown('Entradas')}
          >

            <button className="nav-link btn btn-primary menu-button">Primeras Entradas</button>
            {activeDropdown === 'Entradas' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/primerasentradas')}>
                  Nueva Entradas
                </a>
                <a className="dropdown-item" onClick={() => navigate('/listadeentradas')}>
                 Lista de Entradas
                </a>

              </div>
            )}

          </div>


          <div
            className={`dropdown ${activeDropdown === 'Salidas' ? 'show' : ''}`}
            onClick={() => toggleDropdown('Salidas')}
          >
 
            <button className="nav-link btn btn-primary menu-button">Salidas</button>
            {activeDropdown === 'Salidas' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/customer')}>
                  Salidas producto
                </a>
              
              </div>
            )}

          </div>

          <div
            className={`dropdown ${activeDropdown === 'Inventarios' ? 'show' : ''}`}
            onClick={() => toggleDropdown('Inventarios')}
          >




            
            <button className="nav-link btn btn-primary menu-button">Inventarios</button>
            {activeDropdown === 'Inventarios' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/customer')}>
                  Stock
                </a>
              
              </div>
            )}
          </div>













          

          {/* Dropdown para Categorías */}
          

          {/* Dropdown para Marcas */}
        

          {/* Dropdown para Proveedores */}
          <div
            className={`dropdown ${activeDropdown === 'proveedores' ? 'show' : ''}`}
            onClick={() => toggleDropdown('proveedores')}
          >
            <button className="nav-link btn btn-primary menu-button">Proveedores</button>
            {activeDropdown === 'proveedores' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/supplier')}>
                  Lista de Proveedores
                </a>
                
              </div>
            )}
          </div>

          {/* Dropdown para Productos */}
          <div
            className={`dropdown ${activeDropdown === 'productos' ? 'show' : ''}`}
            onClick={() => toggleDropdown('productos')}
          >
            <button className="nav-link btn btn-primary menu-button">Productos</button>
            {activeDropdown === 'productos' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/product')}>
                  Lista de Productos
                </a>
                <a className="dropdown-item" onClick={() => navigate('/newproduct')}>
                  NUEVO PRODUCTO
                </a>
              </div>
            )}
          </div>

          {/* Dropdown para Compras */}
          <div
            className={`dropdown ${activeDropdown === 'compras' ? 'show' : ''}`}
            onClick={() => toggleDropdown('compras')}
          >
            <button className="nav-link btn btn-primary menu-button">Compras</button>
            {activeDropdown === 'compras' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/purchase')}>
                  Nueva Compra
                </a>
                <a className="dropdown-item" onClick={() => navigate('/purchase')}>
                  LISTA DE COMPRAS
                </a>
              </div>
            )}
          </div>

          {/* Dropdown para Órdenes */}
          <div
            className={`dropdown ${activeDropdown === 'ordenes' ? 'show' : ''}`}
            onClick={() => toggleDropdown('ordenes')}
          >
            <button className="nav-link btn btn-primary menu-button">Órdenes</button>
            {activeDropdown === 'ordenes' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/order')}>
                  Lista de Órdenes
                </a>
                <a className="dropdown-item" onClick={() => navigate('/order')}>
                  NUEVA ORDEN
                </a>
              </div>
            )}
          </div>

          

          {/* Muestra el correo o el nombre del usuario */}
          <div
            className={`dropdown ${activeDropdown === 'usuario' ? 'show' : ''}`}
            onClick={() => toggleDropdown('usuario')}
          >


         {/* Muestra el botón de Cerrar Sesión sin el dropdown */}
<button className="dropdown-item" onClick={handleLogout}>
  Cerrar Sesión
</button>

          </div>
        </nav>
      </header>
    </div>
  );
};

export default Menu;