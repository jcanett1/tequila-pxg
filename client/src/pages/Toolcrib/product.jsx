import React, { useState, useEffect } from 'react'; 
import ProductHead from './producthead';
import axios from 'axios';
import './product.css';

const ListaProductos = () => {
  const [productos, setProductos] = useState([]); // Lista de productos
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

  useEffect(() => {
    // Asumiendo que tienes una API que obtiene las categorías
    axios.get('http://localhost:8000/api/categoria/')
      .then(response => {
        setCategorias(response.data); // Almacenas las categorías en el estado
      })
      .catch(error => {
        console.error("Error al cargar las categorías", error);
      });
  }, []);

  
  // Cargar productos desde el backend cuando se monta el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/productos/');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  

  
  // Manejo de los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Funciones para abrir y cerrar popups
  const handleOpenPopupProduct = () => setShowPopupProduct(true);
  const handleClosePopupProduct = () => setShowPopupProduct(false);

  const handleOpenPopupCategory = () => setShowPopupCategory(true);
  const handleClosePopupCategory = () => setShowPopupCategory(false);

  const handleOpenPopupProvider = () => setShowPopupProvider(true);
  const handleClosePopupProvider = () => setShowPopupProvider(false);

  // Función para agregar un producto
  const handleAddProduct = async () => {
    try {
      const newproduct = {
        nombre_producto: formData.nombre_producto,
        descripcion: formData.descripcion,
        nombre_categoria: formData.nombre_categoria,
      };
      const response = await axios.post('http://localhost:8000/api/productos/agregar/', newproduct);
      setProductos((prev) => [...prev, response.data]);
      handleClosePopupProduct();
      setMessage('Producto agregado con éxito'); // Muestra el mensaje de éxito
      handleClosePopupProduct(); // Cierra el popup de agregar producto
      // Elimina el mensaje después de 3 segundos
      setTimeout(() => {
        setMessage('');
      }, 3000); // 3000 ms = 3 segundos
    } catch (error) {
      console.error('Error al agregar el producto:', error.response?.data || error);
      setMessage('Error al agregar el producto'); // Muestra un mensaje de error
      setTimeout(() => {
        setMessage('');
      }, 3000); // Elimina el mensaje después de 3 segundos
    }
  };

  // Función para eliminar un producto por su nombre
  const handleDeleteProduct = async (id) => {
    // Mostrar mensaje de confirmación
    const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
  
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/productos/${id}/eliminar/`);
        setProductos(productos.filter(producto => producto.id !== id)); // Elimina el producto de la lista
        setMessage('Producto eliminado con éxito');
        setTimeout(() => setMessage(''), 3000); // Elimina el mensaje después de 3 segundos
      } catch (error) {
        console.error('Error al eliminar el producto:', error.response?.data || error);
        setMessage('Error al eliminar el producto');
        setTimeout(() => setMessage(''), 3000); // Elimina el mensaje después de 3 segundos
      }
    } else {
      setMessage('Eliminación cancelada');
      setTimeout(() => setMessage(''), 3000); // Elimina el mensaje después de 3 segundos
    }
  };


  const handleAddCategory = async (nuevaCategoria) => {
    try {
        const response = await axios.post('http://localhost:8000/api/productos/categoria/', {
            nombre_categoria: nuevaCategoria,
        });
        setCategorias((prev) => [...prev, response.data]);
        handleClosePopupCategory();
        setMessage('Categoria agregado con éxito'); // Muestra el mensaje de éxito
    handleClosePopupProduct(); // Cierra el popup de agregar producto
    // Elimina el mensaje después de 3 segundos
    setTimeout(() => {
      setMessage('');
    }, 3000); // 3000 ms = 3 segundos
  } catch (error) {
    console.error('Error al cargarel categoria:', error.response?.data || error);
    setMessage('Error al cargar el categoria'); // Muestra un mensaje de error
    setTimeout(() => {
      setMessage('');
    }, 3000); // Elimina el mensaje después de 3 segundos
  }
};


  // Función para seleccionar un producto para editar
  const handleEditProduct = (producto) => {
    setIsEditing(true);
    setFormData({
      id: producto.id,
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion,
      nombre_categoria: producto.nombre_categoria,
    });
  };

  // Función para guardar cambios al editar un producto
  const handleUpdateProduct = async () => {
    try {
      const { id, ...updatedProduct } = formData;
      const response = await axios.put(`http://localhost:8000/api/productos/${id}/editar/`, updatedProduct);
      setProductos(
        productos.map((prod) => (prod.id === id ? response.data : prod))
      );
      setIsEditing(false);
      setMessage('Producto actualizado con éxito'); // Muestra el mensaje de éxito
      handleClosePopupProduct(); // Cierra el popup de agregar producto
      // Elimina el mensaje después de 3 segundos
      setTimeout(() => {
        setMessage('');
      }, 3000); // 3000 ms = 3 segundos
    } catch (error) {
      console.error('Error al actualizar el producto:', error.response?.data || error);
      setMessage('Error al actulizar el producto'); // Muestra un mensaje de error
      setTimeout(() => {
        setMessage('');
      }, 3000); // Elimina el mensaje después de 3 segundos
    }
  };




 // Función para obtener categorías
 const fetchCategorias = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/categoria/');
    setCategorias(response.data);
    setMessage('Categorías cargadas con éxito');
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => setMessage(''), 3000); // Después de 3 segundos, limpiar el mensaje
  } catch (error) {
    setMessage('Error al cargar categorías');
    console.error(error);
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => setMessage(''), 3000); // Después de 3 segundos, limpiar el mensaje
  }
};

// Manejo de la apertura y cierre del contenedor de categorías
const handleToggleCategories = () => {
  setShowCategories(!showCategories); // Alterna la visibilidad
  if (!showCategories) {
    fetchCategorias(); // Carga las categorías si el contenedor se abre
  }
};



  return (
    <div className="container">
      <ProductHead />
      <h1>Gestión de Productos</h1>

      {/* Mensaje de éxito o error */}
      {message && <div className="message">{message}</div>}

      {/* Lista de Productos */}
      <div className="product-list">
        <h2>Lista de Productos</h2>
        <ul>
          {productos.length > 0 ? (
            productos.map((prod) => (
              <li key={prod.id} className="product-item">
                <strong>{prod.nombre_producto}</strong> - {prod.descripcion} ({prod.nombre_categoria})
                <div className="item-buttons">
                  <button className="button-editar" onClick={() => handleEditProduct(prod)}>Editar</button>
                  <button className="button-eliminar" onClick={() => handleDeleteProduct(prod.id)}>Eliminar</button>
                </div>
              </li>
            ))
          ) : (
            <p>No hay Productos disponibles.</p>
          )}
        </ul>
      </div>

      {/* Botones para abrir los popups */}
      <div className="button-container">
        <button className="agregar-producto-btn" onClick={handleOpenPopupProduct}>Agregar Producto</button>
        <button className="agregar-categoria-btn" onClick={handleOpenPopupCategory}>Agregar Categoría</button>
       
      </div>

      <div>
      {/* Botón para abrir y cerrar el contenedor de categorías */}
      <div className="button-container-outside">
          <button className="ver-categorias-btn" onClick={handleToggleCategories}>
          {showCategories ? 'Cerrar Categorías' : 'Ver Categorías'}
        </button>
      </div>

      {/* Contenedor de categorías visible cuando 'showCategories' es true */}
      {showCategories && (
        <div className="categorias-container">
          
          <h3>Categorías</h3>
          <div>
            {categorias.length === 0 ? (
              <p>No hay categorías disponibles.</p>
            ) : (
              categorias.map((categoria) => (
                <div key={categoria.id}>{categoria.nombre_categoria}</div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mensaje de éxito o error */}
      {message && <p>{message}</p>}
    </div>

     

      {/* Popup para agregar producto */}
      {showPopupProduct && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Agregar Producto</h2>
            <form>
              <input
                type="text"
                name="nombre_producto"
                placeholder="Nombre del producto"
                value={formData.nombre_producto}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
              {/* Formulario */}
      
        {/* Select para seleccionar CATEGORIA */}
        <div>
  <label>Categoría:</label>
  <select
    name="nombre_categoria" // Asegúrate de que el nombre coincida con el campo en formData
    value={formData.nombre_categoria} // Aquí se está utilizando el estado de formData
    onChange={handleInputChange}
    required
  >
    <option value="">Seleccione una categoría</option>
    {categorias.map((categoria) => (
      <option key={categoria.id} value={categoria.nombre_categoria}>
        {categoria.nombre_categoria}
      </option>
    ))}
  </select>
</div>
              <div className="popup-buttons">
                <button type="button" onClick={handleAddProduct}>
                  Guardar 
                </button>
                <button type="button" onClick={handleClosePopupProduct}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup para agregar categoría */}
      {showPopupCategory && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Agregar Categoría</h2>
            <form>
              <input
                type="text"
                name="nueva_categoria"
                placeholder="Nueva Categoría"
              />
              <div className="popup-buttons">
              <button
  type="button"
  onClick={() => {
    const nuevaCategoria = document.querySelector('input[name="nueva_categoria"]').value;
    handleAddCategory(nuevaCategoria);
  }}
>
  Guardar
</button>
                <button type="button" onClick={handleClosePopupCategory}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
  


      {/* Formulario para editar producto */}
      {isEditing && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Editar Producto</h2>
            <form>
              <input
                type="text"
                name="nombre_producto"
                placeholder="Nombre del producto"
                value={formData.nombre_producto}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="nombre_categoria"
                placeholder="Categoría"
                value={formData.nombre_categoria}
                onChange={handleInputChange}
                required
              />
              <div className="popup-buttons">
                <button type="button" onClick={handleUpdateProduct}>
                  Guardar
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mostrar mensaje de éxito o error */}
      {message && <div className="message-popup">{message}</div>}
    </div>
  );
};

export default ListaProductos;
