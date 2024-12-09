import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductHead from './producthead';
import './listadeentradas.css';
import { jsPDF } from 'jspdf'; // Si estás usando un módulo de ES
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const ListaEntradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    id: '',  // Asegúrate de tener un campo 'id' en formData
    descripcion: '',
    proveedor: '',
    categoria: '',
    cantidad: '',
    fecha_ingreso: '',
    cantidad_minima: '',
    cantidad_maxima: '',
    comentarios: '',
    producto: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/primerasentradas/')
      .then(response => {
        const entradasData = response.data || [];
        setEntradas(entradasData);
  
        // Calcula el siguiente ID manualmente
        const maxId = Math.max(...entradasData.map(e => e.id), 0);
        const nextId = maxId + 1;
  
        // Establece el siguiente ID en el estado
        setFormData(prevFormData => ({ ...prevFormData, id: nextId }));
      })
      .catch(error => console.error('Error al obtener las entradas:', error));
  }, []);

  // Obtener productos
  useEffect(() => {
    axios.get('http://localhost:8000/api/productos/')
      .then(response => setProductos(response.data || []))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, []);

  // Obtener proveedores
  useEffect(() => {
    axios.get('http://localhost:8000/api/proveedor/')
      .then(response => setProveedores(response.data || []))
      .catch(error => console.error('Error al obtener los proveedores:', error));
  }, []);

  // Obtener categorías
  useEffect(() => {
    axios.get('http://localhost:8000/api/categoria/')
      .then(response => setCategorias(response.data || []))
      .catch(error => console.error('Error al obtener las categorías:', error));
  }, []);

  const handleEditClick = (entrada) => {
    setEntradaSeleccionada(entrada);
    setFormData(entrada);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      axios.delete(`http://localhost:8000/api/primerasentradas/${id}/eliminar/`)
        .then((response) => {
          console.log(response); // Verifica la respuesta del backend
          setEntradas(prevEntradas => prevEntradas.filter(entrada => entrada.id !== id));
          setMessage('Entrada eliminada con éxito.'); // Mostrar mensaje de éxito
        })
        .catch(error => {
          console.error('Error al eliminar la entrada:', error);
          setMessage('Hubo un error al eliminar la entrada.'); // Mostrar mensaje de error
        });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (entradaSeleccionada) {
      axios.put(`http://localhost:8000/api/primerasentradas/${entradaSeleccionada.id}/modificar/`, formData)
        .then((response) => {
          setEntradas(prevEntradas => prevEntradas.map(entrada =>
            entrada.id === entradaSeleccionada.id ? response.data : entrada
          ));
          setShowModal(false);
          setMessage('¡Actualización exitosa!');
        })
        .catch((error) => {
          console.error("Error al modificar la entrada:", error.response?.data);
          setMessage('Hubo un error al actualizar la entrada.');
        });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const exportToExcel = () => {
    // Convierte las entradas filtradas a una hoja de Excel
  const worksheet = XLSX.utils.json_to_sheet(filteredEntradas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Entradas');

  // Crea un buffer de Excel y lo guarda como archivo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'Lista_Entradas.xlsx');
};

const exportToPDF = () => {
  console.log("Exportando a PDF...");
  const doc = new jsPDF();

  doc.autoTable({
    head: [['ID', 'DESCRIPCION', 'PROVEEDOR', 'CANTIDAD', 'CATEGORIA', 'FECHA INGRESO', 'CANTIDAD MINIMA', 'CANTIDAD MAXIMA', 'PRODUCTO', 'COMENTARIOS']],
    body: entradas.map((entrada) => [
      entrada.id,
      entrada.descripcion,
      entrada.proveedor,
      entrada.cantidad,
      entrada.categoria,
      entrada.fecha_ingreso,
      entrada.cantidad_minima,
      entrada.cantidad_maxima,
      entrada.producto,
      entrada.comentarios
    ]),
  });

  doc.save('entradas.pdf');
};

  const filteredEntradas = entradas.filter(entrada =>
    entrada.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entrada.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entrada.id?.toString().includes(searchTerm)
  );

  return (
    <div>
      {message && <div className="message">{message}</div>}

      <div className="product-container">
        <input
          type="text"
          placeholder="Buscar por ID, Descripción o Proveedor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="product-search"
        />
        <ProductHead />
        <h1 className="product-title">Lista de Entradas</h1>
        <div className="export-buttons">
          <button onClick={exportToExcel} className="export-btn excel-btn">Exportar a Excel</button>
          <button onClick={exportToPDF} className="export-btn pdf-btn">Exportar a PDF</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th>Fecha de Ingreso</th>
            <th>Cantidad Mínima</th>
            <th>Cantidad Máxima</th>
            <th>Producto</th>
            <th>Comentarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntradas.map(entrada => (
            <tr key={entrada.id}>
              <td>{entrada.id}</td>
              <td>{entrada.descripcion}</td>
              <td>{entrada.proveedor}</td>
              <td>{entrada.cantidad}</td>
              <td>{entrada.categoria}</td>
              <td>{entrada.fecha_ingreso}</td>
              <td>{entrada.cantidad_minima}</td>
              <td>{entrada.cantidad_maxima}</td>
              <td>{entrada.producto}</td>
              <td>{entrada.comentarios}</td>
              <td>
               <button className="modificar-btn" onClick={() => handleEditClick(entrada)}>Modificar</button>
<button className="eliminar-btn" onClick={() => handleDeleteClick(entrada.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div>
         
          <form onSubmit={handleSubmit}>
          <h2 className="form-title3">Editar Entrada</h2>
            <input name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" />
            <select name="proveedor" value={formData.proveedor} onChange={handleChange}>
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre_proveedor}
                </option>
              ))}
            </select>
            <select name="categoria" value={formData.categoria} onChange={handleChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </select>
            <input name="cantidad" value={formData.cantidad} onChange={handleChange} placeholder="Cantidad" />
            <input name="fecha_ingreso" value={formData.fecha_ingreso} onChange={handleChange} placeholder="Fecha de Ingreso" />
            <input name="cantidad_minima" value={formData.cantidad_minima} onChange={handleChange} placeholder="Cantidad Mínima" />
            <input name="cantidad_maxima" value={formData.cantidad_maxima} onChange={handleChange} placeholder="Cantidad Máxima" />
            <select name="producto" value={formData.producto} onChange={handleChange}>
              <option value="">Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre_producto}
                </option>
              ))}
            </select>
            <textarea name="comentarios" value={formData.comentarios} onChange={handleChange} placeholder="Comentarios"></textarea>
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListaEntradas;
