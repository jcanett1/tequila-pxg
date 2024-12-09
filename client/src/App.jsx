import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Principalpage } from './pages/PrincipalPage';
import { Navigation } from './components/navigation';
import { Toaster } from 'react-hot-toast';
import { Workingpage } from './pages/workingpage';
import { Exportpage } from './pages/exportpage';
import { Importpage } from './pages/importpage';
import { Ferruleprogramgpage } from './pages/ferrulepage';
import { Amazonprogramgpage } from './pages/amazon';
import { Loginpage } from './pages/login';
import { Balancepage } from './pages/balance';
import { Validationpage } from './pages/validation';
import PrivateRoute from './components/PrivateRoute';
import Toolcriblogin from './pages/Toolcrib/toolcriblogin';
import Menu from './pages/Toolcrib/Menu';
import Header from './pages/Toolcrib/Header';
import Productlist from './pages/Toolcrib/product';
import NewProduct from './pages/Toolcrib/newproduct';
import Entradas from './pages/Toolcrib/primrasentradas';
import ListaEntradas from './pages/Toolcrib/listadeentradas';
import ListProveedores from './pages/Toolcrib/listprovedores';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Recuperar el correo electrónico del usuario de localStorage si existe
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('userEmail'); // Elimina el correo de localStorage al cerrar sesión
  };

  return (
    <BrowserRouter>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        setUserEmail={setUserEmail}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

function AppContent({ isAuthenticated, setIsAuthenticated, setUserEmail, handleLogout }) {
  const location = useLocation();

  return (
    <div>
      {/* Solo muestra la barra de navegación si no estás en la página de login */}
      {!['/login','/toolcriblogin' ,'/product','/customer','/customer/tecnicos',
        'customer/oficinas','/customer/supervisores', '/supplier', '/newproduct',
        '/purchase', '/order', '/primerasentradas', '/listadeentradas', 
      ].includes(location.pathname) &&<Navigation />}
 
        
        
       
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <Loginpage
              setIsAuthenticated={setIsAuthenticated}
              setUserEmail={setUserEmail}
            />
          }
        />
        <Route path="/pxg" element={<Principalpage />} />
        <Route path="/validation" element={<Validationpage />} />
        <Route path="/exportdata" element={<Exportpage />} />
        <Route path="/importdata" element={<Importpage />} />
        <Route path="/npdata" element={<Balancepage />} />
        <Route path="/provision" element={<Workingpage />} />
        <Route path="/facturas" element={<Workingpage />} />
        <Route path="/ferrule" element={<Ferruleprogramgpage />} />
        <Route path="/amazon" element={<Amazonprogramgpage />} />
        <Route path="/receip" element={<Workingpage />} />
        <Route path="/locations" element={<Workingpage />} />
        <Route path="/product" element={<Productlist/>} />
        <Route path="/customer" element={<Workingpage/>} />
        <Route path="/customer/tecnicos" element={<Workingpage/>} />
        <Route path="/customer/oficinas" element={<Workingpage/>} />
        <Route path="/customer/supervisores" element={<Workingpage/>} />
        <Route path="/supplier" element={<ListProveedores/>} />
        <Route path="/newproduct" element={<NewProduct/>} />
        <Route path="/purchase" element={<Workingpage/>} />
        <Route path="/order" element={<Workingpage/>} />
        <Route path="/primerasentradas" element={<Entradas/>} />
        <Route path="/listadeentradas" element={<ListaEntradas/>} />
        <Route
          path="/toolcrib"
          element={
            <Toolcriblogin
              setIsAuthenticated={setIsAuthenticated}
              setUserEmail={setUserEmail}
            />
          }
        />
        <Route
          path="/menu"
          element={
            
              <Menu
                setIsAuthenticated={handleLogout}
                userEmail={setUserEmail}
              />
          }
        />
        <Route path="/production" element={<Workingpage />} />
        <Route path="/scrap" element={<Workingpage />} />
        <Route path="/tetakawi" element={<Workingpage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
