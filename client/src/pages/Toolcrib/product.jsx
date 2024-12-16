import React, { useState, useEffect } from 'react';
import ProductHead from './producthead';
import axios from 'axios';
import './product.css';
import * as XLSX from 'xlsx';  // Librería para exportar a Excel
import jsPDF from 'jspdf';  // Librería para exportar a PDF

const ListaProductos = () => {
  const [productos, setProductos] = useState([]); // Lista de productos
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Lista filtrada de productos
  const [nuevaCategoria, setNuevaCategoria] = useState("");  // Estado para el campo de entrada de categoría
  const [categorias, setCategorias] = useState([]); // Lista de categorías
  const [showCategories, setShowCategories] = useState(false); // Estado para controlar la visibilidad de categorías
  const [showPopupProduct, setShowPopupProduct] = useState(false); // Estado para el popup de producto
  const [showPopupCategory, setShowPopupCategory] = useState(false); // Estado para el popup de categoría
  const [formData, setFormData] = useState({
    id: null,
    nombre_producto: "",
    descripcion: "",
    nombre_categoria: "",
  });
  
  const [isEditing, setIsEditing] = useState(false); // Indica si se está editando
  const [message, setMessage] = useState(''); // Mensajes de éxito o error
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  // Cargar categorías al inicio
  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);

  // Función para obtener categorías
  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categoria/');
      setCategorias(response.data);
      setMessage('Categorías cargadas con éxito');
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
    } catch (error) {
      setMessage('Error al cargar categorías');
      console.error(error);
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
    }
  };

  // Cargar productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/productos/');
      setProductos(response.data);
      setProductosFiltrados(response.data);  // Inicializamos la lista filtrada con todos los productos
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterProducts(e.target.value);
  };

  const filterProducts = (searchTerm) => {
    if (!searchTerm) {
      setProductosFiltrados(productos);  // Si no hay término de búsqueda, mostramos todos los productos
    } else {
      const filtered = productos.filter((prod) => 
        prod.id.toString().includes(searchTerm) || prod.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProductosFiltrados(filtered);
    }
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(productosFiltrados);
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos.xlsx');
  };

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Productos', 10, 10);
    productosFiltrados.forEach((prod, index) => {
      doc.text(`ID: ${prod.id}, Nombre: ${prod.nombre_producto}, Descripción: ${prod.descripcion}, Categoría: ${prod.nombre_categoria}`, 10, 20 + (index * 10));
    });
    doc.save('productos.pdf');
  };

  // Función para agregar un nuevo producto
  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:8000/api/productos/agregar/', formData);
      setMessage('Producto agregado con éxito');
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
      fetchProductos(); // Refrescar la lista de productos
      setShowPopupProduct(false); // Cerrar el popup
    } catch (error) {
      setMessage('Error al agregar el producto');
      console.error(error);
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
    }
  };

  // Función para editar un producto
  const handleEditProduct = async () => {
    try {
      await axios.put(`http://localhost:8000/api/productos/${formData.id}/editar/`, formData);
      setMessage('Producto actualizado con éxito');
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
      fetchProductos(); // Refrescar la lista de productos
      setShowPopupProduct(false); // Cerrar el popup
      setIsEditing(false); // Volver a estado de "Agregar"
    } catch (error) {
      setMessage('Error al actualizar el producto');
      console.error(error);
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:8000/api/productos/${id}/eliminar/`);
        setMessage('Producto eliminado con éxito');
        setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
        fetchProductos(); // Refrescar la lista de productos
      } catch (error) {
        setMessage('Error al eliminar el producto');
        console.error(error);
        setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
      }
    }
  };

  // Función para agregar una nueva categoría
  const handleAddCategory = async () => {
    if (!nuevaCategoria.trim()) {
      setMessage('El nombre de la categoría no puede estar vacío');
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/productos/categoria/', { nombre_categoria: nuevaCategoria });
      setMessage('Categoría agregada con éxito');
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
      fetchCategorias(); // Refrescar la lista de categorías
      setNuevaCategoria(''); // Limpiar el campo
      setShowPopupCategory(false); // Cerrar el popup
    } catch (error) {
      setMessage('Error al agregar la categoría');
      console.error(error);
      setTimeout(() => setMessage(''), 3000); // Eliminar mensaje después de 3 segundos
    }
  };

  // Funciones para abrir y cerrar los popups
  const handleOpenPopupProduct = () => setShowPopupProduct(true);
  const handleClosePopupProduct = () => setShowPopupProduct(false);
  const handleOpenPopupCategory = () => setShowPopupCategory(true);
  const handleClosePopupCategory = () => setShowPopupCategory(false);

  return (
    <>
      <ProductHead />
      <h1 className="titulo-gestion">Gestión de Productos</h1>

      {message && <div className="message">{message}</div>}

      <div className="button-container">
        <button className="agregar-producto-btn" onClick={handleOpenPopupProduct}>Agregar Producto</button>
        <button className="ver-categorias-btn" onClick={() => setShowCategories(!showCategories)}>
          {showCategories ? 'Ocultar Categorías' : 'Ver Categorías'}
        </button>
        <button className="agregar-categoria-btn" onClick={handleOpenPopupCategory}>Agregar Categoría</button>
        <button className="exportar-excel-btn" onClick={exportToExcel}>Exportar a Excel</button>
        <button className="exportar-pdf-btn" onClick={exportToPDF}>Exportar a PDF</button>
      </div>

      <input
        type="text"
        placeholder="Buscar producto por ID o nombre"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
 <p className="total-productos">Total de Productos: {productosFiltrados.length}</p>
      <h2 className="subtitulo-lista2">Tabla de Productos</h2>
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre_producto}</td>
                <td>{prod.descripcion}</td>
                <td>{prod.nombre_categoria}</td>
                <td>
                <button className="button-editar" onClick={() => { setFormData(prod); setIsEditing(true); handleOpenPopupProduct(); }}>Editar</button>
                <button className="button-eliminar" onClick={() => handleDeleteProduct(prod.id)}>Eliminar</button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup de Agregar Producto */}
      {showPopupProduct && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <input
              type="text"
              name="nombre_producto"
              placeholder="Nombre del Producto"
              value={formData.nombre_producto}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleInputChange}
            />
            <select
              name="nombre_categoria"
              value={formData.nombre_categoria}
              onChange={handleInputChange}
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre_categoria}>{cat.nombre_categoria}</option>
              ))}
            </select>
            <button className="button-agregar-producto" onClick={isEditing ? handleEditProduct : handleAddProduct}>
              {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            <button className="button-cancelar" onClick={handleClosePopupProduct}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Popup de Agregar Categoría */}
      {showPopupCategory && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Agregar Categoría</h3>
            <input
              type="text"
              placeholder="Nombre de la Categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button className="button-agregar-categoria" onClick={handleAddCategory}>Agregar Categoría</button>
            <button className="button-cancelar" onClick={handleClosePopupCategory}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Popup de Ver Categorías */}
      {showCategories && (
        <div className="popup-box">
          <h2 className="subtitulo-lista">Lista de Categorías</h2>
          <ul>
            {categorias.map((categoria) => (
              <li key={categoria.id}>{categoria.nombre_categoria}</li>
            ))}
          </ul>
          <button className="button-cancelar" onClick={() => setShowCategories(false)}>
            Cancelar
          </button>
        </div>
      )}
    </>
  );
};

export default ListaProductos;