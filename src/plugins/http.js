import axios from 'axios';
import router from '../router/index';
import store from '../store/index.js';

const URL = 'http://localhost:3000/api';
const http =  axios.create({
    baseURL: URL,
    responseType: 'json',
});

// Interceptor para detectar si el token enviado al servidor ya no es válido desde la respuesta del mismo
http.interceptors.response.use(
    (response) => response, // Si no ocurrió ningún error en la petición, se prosigue con la petición
    (error) => {
        // Código 401 es único para usuario no autorizado.
        if (error.response.status == 401) {
            // Si se obtiene este código, eliminamos la cookie actual con el jwt inválido.
            store.dispatch('logout');
            router.push({ name: 'Login', params: { showSnack: true, message: "Sesión expirada" }});
        }
        return Promise.reject(error);
    }
);

export { http, URL };
