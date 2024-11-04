import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function Exportpage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [inventoryid, setInventoryid] = useState('');
    const [invoice, setInvoice] = useState('');
    const [items, setItems] = useState([]);
    const [loadingexcel, setLoadingexcel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [sumExport, setSumExport] = useState(0);
    const [filtersApplied, setFiltersApplied] = useState(false);

    const fetchItems = async (page=1) => {
      setLoading(true);
      setItems([]); // Limpiar los resultados anteriores
      try {
        const response = await axios.get('http://localhost:8000/tasks/data/export/', {
          params: {
            start_date: startDate,
            end_date: endDate,
            inventory_id: inventoryid,
            invoice_ : invoice,
            page: page,
          },
        });
        setItems(response.data.results);
        setPageCount(Math.ceil(response.data.count / 11));
        setTotalCount(response.data.count);
        setSumExport(response.data.sumExport); 
      } catch (error) {
        console.error('Error fetching filtered items:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (filtersApplied) {
        fetchItems(page);
      }
    }, [page, filtersApplied]);

    const handleSearch = () => {
      setPage(1); // Reset to page 1 when applying filters
      setFiltersApplied(true); // Mark filters as applied
      fetchItems(1)
    };

    const handleNextPage = () => {
      console.log('Next page button clicked');
      if (page < pageCount) {
        setPage(page + 1);
      }
    };
  
    const handlePreviousPage = () => {
      console.log('Previous page button clicked');
      if (page > 1) {
        setPage(page - 1);
      }
    };

    const handleDownloadExcel = async () => {
      setLoadingexcel(true);
      try {
        // Construir la URL de exportación con los filtros
        const url = `http://localhost:8000/tasks/export/?start_date=${startDate}&end_date=${endDate}&inventory_id=${inventoryid}&invoice_=${invoice}`;
        
        // Realizar la solicitud para descargar el archivo
        const response = await axios.get(url, {
          responseType: 'blob', // Importante para manejar archivos binarios
        });
        
        // Crear un enlace y hacer clic en él para descargar el archivo
        const urlObject = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = urlObject;
        link.setAttribute('download', 'export_data.xlsx');
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
      <div>
        <p className='title' style={{marginTop:50, marginBottom:5, marginLeft:20}}>Export Data</p>
        <div className='flex justify-between'style={{marginBottom:5, marginLeft:20, marginRight:20}}>
        <label>
          <input
            type="text" 
            value={inventoryid} 
            onChange={(e) => setInventoryid(e.target.value)}
            className='date-input'
            style={{marginLeft: '10px', color:'black', width:'220px'}} 
            placeholder="Inventory ID"
          />
        </label>
        <label>
          <input
            type="text" 
            value={invoice} 
            onChange={(e) => setInvoice(e.target.value)}
            className='date-input'
            style={{marginLeft: '10px', color:'black', width:'220px'}} 
            placeholder="Invoice"
          />
        </label>
        <label>
          Start Date:
          <input
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className='date-input'
            style={{marginLeft: '10px'}} 
          />
        </label>
        <label>
          End Date:
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className='date-input'
            style={{marginLeft:'10px'}} 
          />
        </label>
        <button className='filter-button-right' onClick={handleSearch} disabled={loading} >
          {loading ? <LoadingSpinner /> : 'Search'}
        </button>
        <button className='excel_button' onClick={handleDownloadExcel} disabled={loadingexcel}>
            {loadingexcel ? <LoadingSpinner /> : null}
        </button>
        </div>
        {/* Mostrar la cantidad de datos encontrados */}
        <div className='flex justify-between'style={{marginLeft:20, marginRight: 20}} >        
          <p>Pages: {pageCount}</p>
          <p>Data: {totalCount} lines</p>
        </div>

        <ul style={{marginLeft:20, marginRight: 20}}>
          <table className='table-container'>
            <thead>
              <tr>
                <th scope='col' style={{width: '250px', textAlign:'left'}}> Date</th>
                <th scope='col'style={{width: '250px', textAlign:'left'}}> Invoice</th>
                <th scope='col' style={{width: '250px', textAlign:'left'}}> Manifest</th>
                <th scope='col'style={{width: '250px', textAlign:'left'}}> Inventory ID</th>
                <th scope='col'style={{width: '250px', textAlign:'left'}}> Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
              <tr key={item.INVENTORY_ID}>
                <td>{item.FECHAPXG}</td>
                <td>{item.FACTURA}</td>
                <td>{item.MANIFIESTO}</td>
                <td>{item.INVENTORY_ID}</td>
                <td>{item.EXPORT}</td>
              </tr>
              ))}
            </tbody>
          </table>
          <div><p>Total Export: {sumExport}</p></div>
        </ul>
        <div className='flex justify-between'style={{marginTop:10, marginLeft:20, marginRight: 20}} >
            <button className='filter-button-left'
              onClick={handlePreviousPage} 
              disabled={page === 1 || loading}
            >
              Previus Page
            </button>
            <button className='filter-button-right'
              onClick={handleNextPage} 
              disabled={page === pageCount || pageCount === 0 || loading}
            >
              Next Page
            </button>
          </div>
          
        
      </div>
    
    );

  };