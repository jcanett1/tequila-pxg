import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ setIsAuthenticated, userEmail }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
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
              marginLeft: 0,
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
          <div className={`dropdown ${activeDropdown === 'clientes' ? 'show' : ''}`}>
            <button
              className="nav-link btn btn-primary menu-button"
              onClick={() => toggleDropdown('clientes')}
            >
              Clientes
            </button>
            {activeDropdown === 'clientes' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/customer')}>
                  CELDAS
                </a>
                <a className="dropdown-item" onClick={() => navigate('/customer/sub2')}>
                  TECNICOS
                </a>
                <a className="dropdown-item" onClick={() => navigate('/customer/sub2')}>
                  OFICINAS
                </a>
                <a className="dropdown-item" onClick={() => navigate('/customer/sub2')}>
                  SUPERVISORES
                </a>
              </div>
            )}
          </div>

          {/* Dropdown para Categorías */}
          <div className={`dropdown ${activeDropdown === 'categorias' ? 'show' : ''}`}>
            <button
              className="nav-link btn btn-primary menu-button"
              onClick={() => toggleDropdown('categorias')}
            >
              Categorías
            </button>
            {activeDropdown === 'categorias' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/category/electronics')}>
                  ELECTRONICO
                </a>
                <a className="dropdown-item" onClick={() => navigate('/category/furniture')}>
                  MUEBLES
                </a>
                <a className="dropdown-item" onClick={() => navigate('/category/clothing')}>
                  ROPA
                </a>
                <a className="dropdown-item" onClick={() => navigate('/category/clothing')}>
                  PEGAMENTOS
                </a>
                <a className="dropdown-item" onClick={() => navigate('/category/clothing')}>
                  ABAROTES
                </a>
              </div>
            )}
          </div>

          {/* Dropdown para Marcas */}
          <div className={`dropdown ${activeDropdown === 'marcas' ? 'show' : ''}`}>
            <button
              className="nav-link btn btn-primary menu-button"
              onClick={() => toggleDropdown('marcas')}
            >
              Marcas
            </button>
            {activeDropdown === 'marcas' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/brand/local')}>
                  Local
                </a>
                <a className="dropdown-item" onClick={() => navigate('/brand/international')}>
                  Internacional
                </a>
              </div>
            )}
          </div>

          {/* Dropdown para Proveedores */}
          <div className={`dropdown ${activeDropdown === 'proveedores' ? 'show' : ''}`}>
            <button
              className="nav-link btn btn-primary menu-button"
              onClick={() => toggleDropdown('proveedores')}
            >
              Proveedores
            </button>
            {activeDropdown === 'proveedores' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/supplier')}>
                  Lista de Proveedores
                </a>
                <a className="dropdown-item" onClick={() => navigate('/supplier')}>
                  NUEVO PROVEDOR
                </a>
              </div>
            )}
          </div>

          {/* Dropdown para Productos */}
          <div className={`dropdown ${activeDropdown === 'productos' ? 'show' : ''}`}>
            <button
              className="nav-link btn btn-primary menu-button"
              onClick={() => toggleDropdown('productos')}
            >
              Productos
            </button>
            {activeDropdown === 'productos' && (
              <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => navigate('/newproduct')}>
                  NUEVO PRODUCTO
                </a>
              </div>
            )}
          </div>

          {/* Dropdown para Compras */}
          <div className={`dropdown ${activeDropdown === 'compras' ? 'show' : ''}`}>
            <button
              className="nav-link btn btn-primary menu-button"
              onClick={() => toggleDropdown('compras')}
            >
              Compras
            </button>
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
          <div className={`dropdown ${activeDropdown === 'ordenes' ? 'show' : ''}`}>
            <button
              className="nav-link btn btn-primary menu-button"
              onClick={() => toggleDropdown('ordenes')}
            >
              Órdenes
            </button>
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

          {/* Muestra el botón de Cerrar Sesión sin el dropdown */}
          <button className="dropdown-item" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </nav>
      </header>
    </div>
  );
};

export default Header;

