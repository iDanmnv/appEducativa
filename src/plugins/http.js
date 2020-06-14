import Vue from 'vue'
import axios from 'axios';
import router from '../router/index';

const URL = 'http://localhost:3000/api';
const http =  axios.create({
    baseURL: URL,
    responseType: 'json',
});

// Interceptor para mandar el jwt por Autorization en cada petición.
http.interceptors.request.use(
    (config) => {
        // Se obtiene cookie y se almacenca en el encabezado.
        config.headers = { 'Authorization': `Bearer ${Vue.cookie.get('SSaeI')}` }
        // Retornamos la configuración.
        return config;
    },
    (err) =>  Promise.reject(err)
);

// Interceptor para detectar si el token enviado al servidor ya no es válido
http.interceptors.response.use(
    (response) => response, // Si no ocurrió ningún error en la petición, se prosigue con la petición
    (error) => {
        // Código 401 es único para usuario no autorizado.
        if (error.response.status == 401) {
            // Si se obtiene este código, eliminamos la cookie actual con el jwt inválido.
            Vue.cookie.delete('SSaeI');
            router.push({ name: 'Login', params: { showSnack: true, message: "Sesión expirada" }});
        }
        return Promise.reject(error);
    }
);

export { http, URL };
