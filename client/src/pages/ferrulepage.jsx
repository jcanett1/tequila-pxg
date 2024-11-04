import React, { useRef, useState } from 'react';
import axios from 'axios';

export function Ferruleprogramgpage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleButtonClick = () => {
    // Simula el clic en el input de archivo
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  


    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/tasks/ferrule-program/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de usar el tipo de contenido adecuado
          'X-CSRFToken': getCookie('csrftoken'), // Incluye el token CSRF si es necesario
        },
        responseType: 'blob', // Importante para manejar archivos binarios
        withCredentials: true // Permite que se envíen cookies junto con la solicitud
      })

    
  
        // Verificar si la cabecera 'content-disposition' está presente
        let filename = 'Tequila_Shipments_Details_Ferrule.csv'; // Nombre por defecto

    // Verificar si la cabecera 'content-disposition' está presente

    // Crear un enlace de descarga para el archivo recibido
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    
    // Simular un clic en el enlace para iniciar la descarga
    document.body.appendChild(link);
    link.click();
    
    // Limpiar después de la descarga
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error uploading file:', error);
  } finally {
    // Asegúrate de que esta línea siempre se ejecute
    setLoading(false);
  }
};
  // Función para obtener el token CSRF del cookie
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
  
    <div style={{marginTop:60, marginLeft:30}}>
      <p className='title' style={{marginBottom:10}}>Ferrule Program</p>
      <p style={{fontSize:18, fontWeight:'bold'}}>Insert Tequila Shipments Details to add Ferrules </p>
      <p style={{fontSize:15}}>Note: Please remember that the file must be the one you downloaded from tableau today</p>
      <form style={{marginTop:10}} onSubmit={handleSubmit}>
        <input 
        type="file"
        ref = {fileInputRef} 
        onChange={handleFileChange}
        accept='.csv'
        style={{display: 'none'}} // Oculta el botón de archivo predeterminado
        />
        <button 
        type='button'
        className='filter-button-left' 
        onClick={handleButtonClick}>
        Select File
        </button>
        <span style={{marginLeft: 10}}>
          {file ? file.name : 'No file selected'}
        </span>
        <button 
      style={{marginTop:10, marginLeft:25}}
      className= 'filter-button-left' 
      type="submit" 
      disabled={loading}>
          {loading ? 'Processing...' : 'Upload'}
        </button>
      </form>
      
    </div>
  );
};