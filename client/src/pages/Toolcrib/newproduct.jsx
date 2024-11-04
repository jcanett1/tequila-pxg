import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductHead from './producthead';
import './newproduct.css';

const NewProduct = () => {
  const [tipoProducto, setTipoProducto] = useState('nuevo'); // Estado para el tipo de producto
  const [producto, setProducto] = useState({
    descripcion: '',
    precio: '',
    cantidad: '',
    unidad: '',
    proveedor: '',
    fecha_ingreso: '',
    numero_serie: '',
    moneda: 'MXN',
    comentarios: '',
    tipo_producto: 'nuevo' // Agregar tipo_producto al estado
  });
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/productos/');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar los productos', error);
      }
    };
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value ,
      tipo_producto: tipoProducto // Asegurarse de que tipo_producto se actualice
    });
  };

  const handleTipoProductoChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipoProducto(nuevoTipo);
    setProducto({
      descripcion: '',
      precio: '',
      cantidad: '',
      unidad: '',
      proveedor: '',
      fecha_ingreso: '',
      numero_serie: '',
      moneda: 'MXN',
      comentarios: '',
      tipo_producto: e.target.value // Actualiza el tipo_producto al cambiar
    });
  };

  const handleProductoExistenteChange = (e) => {
    const productoSeleccionado = productos.find(
      (prod) => prod.descripcion === e.target.value
    );
    setProducto(productoSeleccionado ? { ...productoSeleccionado, tipo_producto: 'existente' } : {});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposVacios = tipoProducto === 'nuevo' && Object.values(producto).some(x => x === '');
    if (camposVacios) {
      setError('Por favor, completa todos los campos para agregar un producto.');
      return;
    } else {
      setError('');
    }






    try {
      const response = await axios.post('http://localhost:8000/api/productos/agregar/', producto);
      alert('Producto agregado exitosamente');
      
      setProductos([...productos, response.data]);
      setProducto({
        descripcion: '',
        precio: '',
        cantidad: '',
        unidad: '',
        proveedor: '',
        fecha_ingreso: '',
        numero_serie: '',
        moneda: 'MXN',
        comentarios: '',
        tipo_producto: 'nuevo' // Reiniciar tipo_producto
      });
    } catch (error) {
      console.error('Error al agregar el producto', error);
    }
  };

  return (
    <div>
      <div className="product-head-container">
        <ProductHead />
      </div>
      <div className="new-product-container">
        <form className="new-product-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {/* Tipo de producto */}
          <div className="form-group">
            <label>Tipo de Producto:</label>
            <select value={tipoProducto} onChange={handleTipoProductoChange}>
              <option value="nuevo">Nuevo</option>
              <option value="existente">Existente</option>
            </select>
          </div>

          {/* Formulario para nuevo o existente */}
          {tipoProducto === 'nuevo' ? (
            <>
              <div className="form-group">
                <label>Descripción:</label>
                <input type="text" name="descripcion" value={producto.descripcion} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Precio:</label>
                <input type="number" name="precio" value={producto.precio} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Cantidad:</label>
                <input type="number" name="cantidad" value={producto.cantidad} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Unidad:</label>
                <select name="unidad" value={producto.unidad} onChange={handleChange}>
                  <option value="PZA">Piezas</option>
                  <option value="mts">Metros</option>
                  <option value="Lit">Litros</option>
                  <option value="caja">Cajas</option>
                </select>
              </div>
              <div className="form-group">
                <label>Proveedor:</label>
                <input type="text" name="proveedor" value={producto.proveedor} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Fecha de ingreso:</label>
                <input type="date" name="fecha_ingreso" value={producto.fecha_ingreso} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Número de serie:</label>
                <input type="text" name="numero_serie" value={producto.numero_serie} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Moneda:</label>
                <select name="moneda" value={producto.moneda} onChange={handleChange}>
                  <option value="MXN">Pesos Mexicanos</option>
                  <option value="USD">Dólares Americanos</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comentarios:</label>
                <textarea name="comentarios" value={producto.comentarios} onChange={handleChange}></textarea>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Buscar Producto Existente:</label>
                <select
                  name="descripcion"
                  value={producto.descripcion || ''}
                  onChange={handleProductoExistenteChange}
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.descripcion}>
                      {prod.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <input type="text" name="descripcion" value={producto.descripcion} readOnly />
              </div>
              <div className="form-group">
                <label>Precio:</label>
                <input type="number" name="precio" value={producto.precio} readOnly />
              </div>
              <div className="form-group">
                <label>Cantidad:</label>
                <input type="number" name="cantidad" value={producto.cantidad} readOnly />
              </div>
              <div className="form-group">
                <label>Unidad:</label>
                <input type="text" name="unidad" value={producto.unidad} readOnly />
              </div>
              <div className="form-group">
                <label>Proveedor:</label>
                <input type="text" name="proveedor" value={producto.proveedor} readOnly />
              </div>
              <div className="form-group">
                <label>Fecha de ingreso:</label>
                <input type="date" name="fecha_ingreso" value={producto.fecha_ingreso} readOnly />
              </div>
              <div className="form-group">
                <label>Número de serie:</label>
                <input type="text" name="numero_serie" value={producto.numero_serie} readOnly />
              </div>
              <div className="form-group">
                <label>Moneda:</label>
                <input type="text" name="moneda" value={producto.moneda} readOnly />
              </div>
              <div className="form-group">
                <label>Comentarios:</label>
                <textarea name="comentarios" value={producto.comentarios} readOnly></textarea>
              </div>
            </>
          )}

          <button type="submit" className="submit-btn">
            Agregar Producto
          </button>
        </form>
      </div>

      <div className="product-list-container">
        <h3>Lista de Productos</h3>
        <div className="product-list">
          <ul>
            {productos.map((prod) => (
              <li key={prod.id}>
                {prod.descripcion} - {prod.precio} {prod.moneda} - {prod.cantidad} - {prod.unidad} - {prod.comentarios} - {prod.tipo_producto} {/* Mostrar tipo de producto */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
