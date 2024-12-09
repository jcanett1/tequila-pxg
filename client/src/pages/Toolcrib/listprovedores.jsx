import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductHead from './producthead';
import './listproveedores.css'; // Importar el archivo de estilos
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ListProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre_proveedor: '',
    contacto_correo: '',
    moneda: '',
    direccion: '',
    telefono: '',
    credito_termino: '',
    giro_sector: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/proveedor/') // Ajusta la ruta para obtener proveedores
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los proveedores:', error);
      });
  }, []);

  const handleAddProvider = async () => {
    try {
      // Validar que el formulario tenga datos
      const { nombre_proveedor, contacto_correo, moneda, direccion, telefono, credito_termino, giro_sector } = formData;
  
      if (!nombre_proveedor) {
        setMessage('El nombre del proveedor es requerido');
        return;
      }
  
      // Enviar todos los datos al backend
      const response = await axios.post('http://localhost:8000/api/proveedor/agregar/', {
        nombre_proveedor,
        contacto_correo,
        moneda,
        direccion,
        telefono,
        credito_termino,
        giro_sector,
      });
  
      // Actualizar la lista de proveedores con el nuevo proveedor
      setProveedores((prev) => [...prev, response.data]);
      setShowAddProviderModal(false);
      setMessage('Proveedor agregado con éxito');
      
      setTimeout(() => setMessage(''), 3000); // Elimina el mensaje después de 3 segundos
      setFormData({
        nombre_proveedor: '',
        contacto_correo: '',
        moneda: '',
        direccion: '',
        telefono: '',
        credito_termino: '',
        giro_sector: '',
      }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al agregar el proveedor:', error.response?.data || error);
      setMessage('Error al agregar el proveedor');
      setTimeout(() => setMessage(''), 3000); // Elimina el mensaje después de 3 segundos
    }
  };
  

  
  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setFormData(proveedor);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      axios.delete(`http://localhost:8000/api/proveedor/${id}/eliminar/`) // Ajusta la ruta para eliminar proveedores
        .then(() => {
          setProveedores(proveedores.filter(p => p.id !== id));
          alert("Proveedor eliminado exitosamente");
        })
        .catch(error => {
          console.error("Error al eliminar el proveedor:", error);
          alert("Ocurrió un error al intentar eliminar el proveedor.");
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

    axios.put(`http://localhost:8000/api/proveedor/${proveedorSeleccionado.id}/modificar/`, formData) // Ajusta la ruta para modificar proveedores
      .then(response => {
        alert('Proveedor modificado exitosamente');
        setProveedores(proveedores.map(p => (p.id === response.data.id ? response.data : p)));
        setProveedorSeleccionado(null);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error al modificar el proveedor:', error);
        alert('Ocurrió un error inesperado. Intenta de nuevo.');
      });
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Proveedores');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre del Proveedor', key: 'nombre_proveedor', width: 30 },
      { header: 'Correo de Contacto', key: 'contacto_correo', width: 30 },
      { header: 'Moneda', key: 'moneda', width: 15 },
      { header: 'Dirección', key: 'direccion', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Crédito a Término', key: 'credito_termino', width: 20 },
      { header: 'Giro o Sector', key: 'giro_sector', width: 20 },
    ];

    proveedores.forEach(proveedor => {
      worksheet.addRow(proveedor);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'proveedores.xlsx';
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.autoTable({
      head: [['ID', 'Nombre del Proveedor', 'Correo de Contacto', 'Moneda', 'Dirección', 'Teléfono', 'Crédito a Término', 'Giro o Sector']],
      body: proveedores.map(proveedor => [
        proveedor.id,
        proveedor.nombre_proveedor,
        proveedor.contacto_correo,
        proveedor.moneda,
        proveedor.direccion,
        proveedor.telefono,
        proveedor.credito_termino,
        proveedor.giro_sector,
      ]),
    });

    doc.save('proveedores.pdf');
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre_proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto_correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.id.toString().includes(searchTerm)
  );

  return (
    <div className="container-header-title" >
  <ProductHead className="product-head" />
  <h1 className="header-title">Lista de Proveedores</h1>

      <input class="section-search"
        type="text"
        placeholder="Buscar por ID, Nombre o Correo"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className="button-exportar-excel" onClick={exportToExcel}>Exportar a Excel</button>
      <button className="button-exportar-pdf" onClick={exportToPDF}>Exportar a PDF</button>
      <button button className="button-agregar-proveedor" onClick={() => setShowAddProviderModal(true)}>Agregar Proveedor</button>
      <table  class="section-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Proveedor</th>
            <th>Correo de Contacto</th>
            <th>Moneda</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Crédito a Término</th>
            <th>Giro o Sector</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProveedores.map(proveedor => (
            <tr key={proveedor.id}>
              <td>{proveedor.id}</td>
              <td>{proveedor.nombre_proveedor}</td>
              <td>{proveedor.contacto_correo}</td>
              <td>{proveedor.moneda}</td>
              <td>{proveedor.direccion}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.credito_termino}</td>
              <td>{proveedor.giro_sector}</td>
              <td>
                <button className="button-modificar" onClick={() => handleEditClick(proveedor)}>Modificar</button>
                <button className="button-eliminar" onClick={() => handleDeleteClick(proveedor.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
{/* Modal para agregar proveedor */}
{showAddProviderModal && (
  <div className="modal">
    <div className="modal-content">
      <h2>Agregar Nuevo Proveedor</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddProvider();
      }}>
        <input
          type="text"
          name="nombre_proveedor"
          placeholder="Nombre del proveedor"
          value={formData.nombre_proveedor}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="contacto_correo"
          placeholder="Correo de Contacto"
          value={formData.contacto_correo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="moneda"
          placeholder="Moneda"
          value={formData.moneda}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <input
          type="text"
          name="credito_termino"
          placeholder="Crédito a Término"
          value={formData.credito_termino}
          onChange={handleChange}
        />
        <input
          type="text"
          name="giro_sector"
          placeholder="Giro o Sector"
          value={formData.giro_sector}
          onChange={handleChange}
        />
        <button type="submit">Agregar</button>
        <button type="button" onClick={() => setShowAddProviderModal(false)}>Cancelar</button>
      </form>
    </div>
  </div>
)}


      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Proveedor</h2>
            <form onSubmit={handleSubmit}>
              <input name="nombre_proveedor" value={formData.nombre_proveedor} onChange={handleChange} placeholder="Nombre del Proveedor" />
              <input name="contacto_correo" value={formData.contacto_correo} onChange={handleChange} placeholder="Correo de Contacto" />
              <input name="moneda" value={formData.moneda} onChange={handleChange} placeholder="Moneda" />
              <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" />
              <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
              <input name="credito_termino" value={formData.credito_termino} onChange={handleChange} placeholder="Crédito a Término" />
              <input name="giro_sector" value={formData.giro_sector} onChange={handleChange} placeholder="Giro o Sector" />
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProveedores;
