import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductHead from './producthead'; // Importa el componente
import './newproduct.css';
import './primerasentradas.css';

const PrimeraEntrada = () => {
  const [formData, setFormData] = useState({
    producto: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    proveedor: '',
    categoria: '',
    fecha_ingreso: '',
    numero_serie: '',
    moneda: 'MXN',
    cantidad_minima: '', // Campo cantidad_minima
    cantidad_maxima: '', // Campo cantidad_maxima
    comentarios: '',
  });

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    // Obtener lista de productos
    axios.get('http://localhost:8000/api/productos/')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al cargar productos:', error));

    // Obtener lista de proveedores
    axios.get('http://localhost:8000/api/proveedor/')
      .then(response => setProveedores(response.data))
      .catch(error => console.error('Error al cargar proveedores:', error));

    // Obtener lista de categorías
    axios.get('http://localhost:8000/api/categoria/')
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error al cargar categorías:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Enviar el nombre del producto (y no el id) al backend
      const response = await axios.post('http://localhost:8000/api/primerasentradas/agregar/', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Reinicia el formulario
      setFormData({
        descripcion: '',
        proveedor: '',
        categoria: '',
        numero_serie:'',
        precio:'',
        cantidad: '',
        fecha_ingreso: '',
        cantidad_minima: '', // Reiniciar cantidad_minima
        cantidad_maxima: '', // Reiniciar cantidad_maxima
        comentarios: '',
        producto: '', // Reiniciar el producto seleccionado
      });
  
      // Mostrar mensaje de éxito
      alert('La entrada ha sido registrada exitosamente.');
  
      // Obtener las entradas nuevamente
      const entradasResponse = await axios.get('http://localhost:8000/api/primerasentradas/');
      setEntradas(entradasResponse.data);
  
     }catch (error) {
      console.error("Error al registrar la entrada:", error.response?.data || error.message);
      
    }
  };

  return (
    <div>
      <ProductHead title="Registrar Entrada" />

      <form className="form5" onSubmit={handleSubmit}>
        
        {/* Select para seleccionar el producto */}
        <div>
          <label>Producto:</label>
          <select
            name="producto"
            value={formData.producto}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre_producto}
              </option>
            ))}
          </select>
        </div>

        {/* Select para seleccionar el proveedor */}
        <div>
          <label>Proveedor:</label>
          <select
            name="proveedor"
            value={formData.proveedor}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre_proveedor}
              </option>
            ))}
          </select>
        </div>

        {/* Select para seleccionar la categoría */}
        <div>
          <label>Categoría:</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre_categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Campos adicionales */}
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Fecha de ingreso:</label>
          <input
            type="date"
            name="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Número de serie:</label>
          <input
            type="text"
            name="numero_serie"
            value={formData.numero_serie}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Moneda:</label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={handleInputChange}
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label>Cantidad Minima:</label>
          <input
            type="number"
            name="cantidad_minima"
            value={formData.cantidad_minima}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Cantidad Maxima:</label>
          <input
            type="number"
            name="cantidad_maxima"
            value={formData.cantidad_maxima}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Comentarios:</label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn-submit3">Registrar Entrada</button>
      </form>
    </div>
  );
};

export default PrimeraEntrada;
