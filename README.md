# App Educativa

## Explicaciones
Todo el sistema se encuentra ya validado por sesiones, es decir, no se tienen que preocupar por saber si el usuario está logueado en cada componente, las rutas de vue ya están protegidas para las vistas que requieren autenticación o las que no. Por el momento todas las vistas de Dashboard pueden ser vistas por Usuario o Admin (Maestros), lo único que debería programarse es la información mostrada para cada tipo de usuario en cada componente. 
### Usuario almacenado
La información del usuario almacenado por defecto se encuentra en vuex, es un objeto que contiene los mismos campos que la estructura de mongo, a excepción de password (por seguridad) y cursos (irrelevante). Para acceder a él mediante los componentes:
```js
    this.$store.state.user
```
### Axios para peticiones
Se creó un objeto **axios** para el manejo de cada petición, ya viene configurado con lo necesario (baseUrl, encabezados, respuesta, etcétera). Este objeto envía una autorización tipo Bearer al servidor express, lo recolecta antes de cada petición. Para utilizarlo en los componentes de Vue:
```js
    // Importación
    import { http } from '@/plugins/http.js';

    // Dentro de cada función del componente:
        // ejemplo get
    http.get('/Categoria')
        .then(res => {
            // manejo
        })
        .catch(err => {
            // errores
        });

        // ejemplo post
    http.post('/Categoria', { var1: 'valor', var2: 100 })
        .then(res => {
            // manejo
        })
        .catch(err => {
            // errores
        });
```
### Themas Vue
En el archivo ***src/plugins/vuetify.js*** se encuentran dos temas, **dark** y **light**, ambos comparten colores como de información y otros colores son únicos en cada tema, por el momento son colores provisionales, por si los quieren cambiar o agregar más propiedades (cada propiedad debe estar en ambos temas).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
