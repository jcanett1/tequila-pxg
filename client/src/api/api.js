import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Reemplaza 'localhost' por '127.0.0.1' si es necesario
});

export const login = (username, password) => {
    return api.post('/login/', { username, password })
        .then(response => response.data)
        .catch(error => {
            if (error.response) {
                console.error("Error en la respuesta del servidor:", error.response.data);
            } else if (error.request) {
                console.error("No se recibió respuesta del servidor:", error.request);
            } else {
                console.error("Error al configurar la solicitud:", error.message);
            }
            throw error;
        });
};

