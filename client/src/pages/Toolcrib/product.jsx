import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ProductHead from './producthead';

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    precio: '',
    cantidad: '',
    proveedor: '',
    fecha_ingreso: '',
    numero_serie: '',
    moneda: '',
    unidad: '',
    comentarios: '',
    tipo_producto: '' // Añadido el campo tipo_producto
  });
  const [showModal, setShowModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos/')
      .then(response => {
        setProductos(response.data);
      
      })
      .catch(error => {
        console.error('Hubo un error al obtener los productos:', error);
      });
  }, []);

  useEffect(() => {
    const { descripcion, precio, cantidad, proveedor, fecha_ingreso, numero_serie, moneda, unidad, tipo_producto } = formData;
    setIsFormValid(!!(descripcion && precio && cantidad && proveedor && fecha_ingreso && numero_serie && moneda && unidad && tipo_producto));
  }, [formData]);

  const handleEditClick = (producto) => {
    setProductoSeleccionado(producto);
    setFormData(producto);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      axios.delete(`http://localhost:8000/api/productos/${id}/eliminar`)
        .then(() => {
          setProductos(productos.filter(p => p.id !== id));
          alert("Producto eliminado exitosamente");
        })
        .catch(error => {
          console.error("Error al eliminar el producto:", error);
          alert("Ocurrió un error al intentar eliminar el producto.");
        });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios.put(`http://localhost:8000/api/productos/${productoSeleccionado.id}/modificar/`, formData)
      .then(response => {
        alert('Producto modificado exitosamente');
        setProductos(productos.map(p => (p.id === response.data.id ? response.data : p)));
        setProductoSeleccionado(null);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error al modificar el producto:', error);
        setError('Ocurrió un error inesperado. Intenta de nuevo.');
      });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Descripción', key: 'descripcion', width: 30 },
      { header: 'Precio', key: 'precio', width: 10 },
      { header: 'Moneda', key: 'moneda', width: 10 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Unidad', key: 'unidad', width: 10 },
      { header: 'Proveedor', key: 'proveedor', width: 30 },
      { header: 'Fecha de Ingreso', key: 'fecha_ingreso', width: 15 },
      { header: 'Número de Serie', key: 'numero_serie', width: 15 },
      { header: 'Comentarios', key: 'comentarios', width: 30 },
      { header: 'Tipo de Producto', key: 'tipo_producto', width: 20 } // Nueva columna
    ];

    productos.forEach(producto => {
      worksheet.addRow(producto);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productos.xlsx';
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.autoTable({
      head: [['ID', 'Descripción', 'Precio', 'Moneda', 'Cantidad', 'Unidad', 'Proveedor', 'Fecha de Ingreso', 'Número de Serie', 'Comentarios', 'Tipo de Producto']],
      body: productos.map(producto => [
        producto.id,
        producto.descripcion,
        producto.precio,
        producto.moneda,
        producto.cantidad,
        producto.unidad,
        producto.proveedor,
        producto.fecha_ingreso,
        producto.numero_serie,
        producto.comentarios,
        producto.tipo_producto // Nuevo campo
      ]),
    });

    doc.save('productos.pdf');
  };

  const filteredProductos = productos.filter(producto => 
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
    producto.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    producto.id.toString().includes(searchTerm)
  );

  return (
    <div style={{ padding: '0px', textAlign: 'center' }}>
      <ProductHead />
      <div style={{ marginTop: '70px', fontSize: '15px', fontWeight: 'bold', color: '#333' }}>
        <h1 style={{
          fontSize: '28px',
          color: '#2c3e50',
          marginTop: '20px',
          marginBottom: '20px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Lista de Productos
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Buscar por ID, Descripción o Proveedor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '300px',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '7px',
              border: '2px solid #ccc'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={exportToExcel}
            style={{
              backgroundColor: 'blue',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Exportar a Excel
          </button>
          <button
            onClick={exportToPDF}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Exportar a PDF
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Moneda</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Proveedor</th>
              <th>Fecha de Ingreso</th>
              <th>Número de Serie</th>
              <th>Comentarios</th>
              <th>Tipo de Producto</th> {/* Nueva columna */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio}</td>
                <td>{producto.moneda}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.unidad}</td>
                <td>{producto.proveedor}</td>
                <td>{producto.fecha_ingreso}</td>
                <td>{producto.numero_serie}</td>
                <td>{producto.comentarios}</td>
                <td>{producto.tipo_producto}</td> {/* Nuevo campo */}
                <td>
                  <button
                    onClick={() => handleEditClick(producto)}
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(producto.id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    {/* Modal para editar productos */}
    {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.10)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '30px',
            width: '400px',
            boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2>Modificar Producto</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Descripción:
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                />
              </label>
              <label>
                Precio:
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                />
              </label>
              <label>
                Cantidad:
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                />
              </label>
              <label>
                Unidad:
                <select
                  name="unidad"
                  value={formData.unidad}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                >
                  <option value="">Selecciona una unidad</option>
                  <option value="PZA">Piezas</option>
                  <option value="litros">Litros</option>
                  <option value="metros">Metros</option>
                  <option value="cajas">Cajas</option>
                </select>
              </label>
              <label>
                Proveedor:
                <input
                  type="text"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                />
              </label>
              <label>
                Fecha de Ingreso:
                <input
                  type="date"
                  name="fecha_ingreso"
                  value={formData.fecha_ingreso}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                />
              </label>
              <label>
                Número de Serie:
                <input
                  type="text"
                  name="numero_serie"
                  value={formData.numero_serie}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                />
              </label>
              <label>
                Moneda:
                <select
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                >
                  <option value="">Selecciona una moneda</option>
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                </select>
              </label>
              <label>
                Comentarios:
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
              </label>
              <div>
                <label>Tipo de Producto:</label>
                <select
                  name="tipo_producto"
                  value={formData.tipo_producto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Existente">Existente</option>
                </select>
              </div>


              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button
                type="submit"
                disabled={!isFormValid}
                style={{
                  marginRight: '10px',
                  backgroundColor: 'green',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: 'gray',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaProductos;