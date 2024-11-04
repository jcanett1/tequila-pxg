import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function Validationpage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [inventoryid, setInventoryid] = useState('');
    const [items, setItems] = useState([]);
    const [loadingexcel, setLoadingexcel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);

    const fetchItems = async () => {
      setLoading(true);
      setItems([]); // Limpiar los resultados anteriores
      try {
        const response = await axios.get('http://localhost:8000/tasks/data/inventory/', {
          params: {
            start_date: startDate,
            end_date: endDate,
            inventory_id: inventoryid,
          },
        });
        setItems(response.data.results);
      } catch (error) {
        console.error('Error fetching filtered items:', error);
      } finally {
        setLoading(false);
      }
    };


    const handleSearch = () => {
    
      setFiltersApplied(true); // Mark filters as applied
      fetchItems();
    };


    const handleDownloadExcel = async () => {
        setLoadingexcel(true);
        try {
          // Construir la URL de exportación con los filtros
          const url = `http://localhost:8000/tasks/inventory/?start_date=${startDate}&end_date=${endDate}&inventory_id=${inventoryid}`;
          
          // Realizar la solicitud para descargar el archivo
          const response = await axios.get(url, {
            responseType: 'blob', // Importante para manejar archivos binarios
          });
          
          // Crear un enlace y hacer clic en él para descargar el archivo
          const urlObject = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = urlObject;
          link.setAttribute('download', 'inventory_data.xlsx');
          document.body.appendChild(link);
          link.click();
          
          // Limpiar el enlace
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading Excel file:', error);
        } finally {
          setLoadingexcel(false);
        }
      };

    const LoadingSpinner = () => {
      return (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      );
    };

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: 40, marginRight: 40, marginBottom: 5}}>
        <div style={{marginTop:50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <p className='title' style={{marginBottom:10}}>BOM Validation</p>
        <div style={{display:'flex', alignItems:'center'}}>
        <label>
          Start Date:
          <input
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className='date-input'
            style={{marginLeft: 5}} 
          />
        </label>
        <label style={{marginLeft:15}}>
          End Date:
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className='date-input'
            style={{marginLeft:5}} 
          />
        </label>
        </div>
        <button 
        style={{marginTop:20}}
        className='filter-button-right' onClick={handleSearch} disabled={loading} >
          {loading ? <LoadingSpinner /> : 'Validation'}
        </button>
        <button 
        style={{marginTop:10}}
        className='filter-button-right' onClick={handleSearch} disabled={loading} >
          {loading ? <LoadingSpinner /> : 'Build Material'}
        </button>
        <button 
        style={{marginTop:10}}
        className='filter-button-right' onClick={handleSearch} disabled={loading} >
          {loading ? <LoadingSpinner /> : 'Export to Excel'}
        </button>
        <button 
        style={{marginTop:10}}
        className='filter-button-right' onClick={handleSearch} disabled={loading} >
          {loading ? <LoadingSpinner /> : 'Exported parts'}
        </button>
        <button 
        style={{marginTop:10}}
        className='filter-button-right' onClick={handleSearch} disabled={loading} >
          {loading ? <LoadingSpinner /> : 'Bss and No Bss errors'}
        </button>
        <div style={{ display:'flex', alignItems:'center', marginTop:20}}>
        <table className='table-container' style={{marginRight:20}}>
          <thead>
            <tr>
              <th>Import Invoices</th>
            </tr>
          </thead>
        </table>
        <table className='table-container'>
          <thead>
            <tr>
              <th>Export Invoices</th>
            </tr>
          </thead>
        </table>
        </div>
        </div>
        <div style={{marginTop:80}}>
        <ul style={{marginRight: 10}}>
          <table className='table-container'>
            <thead>
              <tr>
                <th scope='col' style={{width: '250px', textAlign:'left'}}> Part</th>
                <th scope='col'style={{width: '250px', textAlign:'left'}}> Inventory ID</th>
                <th scope='col'style={{width: '250px', textAlign:'left'}}> Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
              <tr key={item.INVENTORY_ID}>
                <td>{item.FECHAPXG}</td>
                <td>{item.INVENTORY_ID}</td>
                <td>{item.ON_HAND}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </ul>
        </div>        
      </div>
    
    );

  };