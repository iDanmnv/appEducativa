import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js';

// Views
import Auth from '../views/Auth.vue'
import Dashboard from '../views/Dashboard.vue'

// Components
import Home from '../components/dashboard/Home.vue'
import Courses from '../components/dashboard/Courses.vue'
import Account from '../components/dashboard/Account.vue'
import Login from '../components/Auth/Login.vue'
import Register from '../components/Auth/Register.vue'
import Chat from '../components/dashboard/Chat.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
        component: Dashboard,
		children: [
			{
                path: '',
                name: 'Home',
                component: Home
            },
            {
                path: 'courses',
                name: 'Courses',
                component: Courses
            },
            {
                path: 'profile',
                name: 'Account',
                component: Account
            },
            {
                path: 'chat',
                name: 'Chat',
                component: Chat
            }
        ],
        meta: { auth: true },
	},
	{
        path: '/auth',
        component: Auth,
        children: [
            {
                path: '/login',
                name: 'Login',
                component: Login,
                props: true
            },
            {
                path: '/register',
                name: 'Register',
                component: Register
            }
        ],
        meta: { auth: false },
        beforeEnter: (to, from, next) => { // Guard para redirigir usuarios logueados.
            // Usuario logueado, se manda a home.
            if (store.getters.isAuth)  {
                next({ name: 'Home' });
            }
            else {
                next();
            }
        }
    }
]

const router = new VueRouter({
	routes
})

// Auth Guard
router.beforeEach((to, from, next) => {
    // Rutas que requieren autenticación
    if (to.matched.some(record => record.meta.auth)) {
        // Usuario logueado
        if (store.getters.isAuth) {
            next()
        }
        // Usuario no logueado.
        else {
            next({ name: 'Login' });
        }
    }
    // Rutas que no requieren autenticación
    else {
        next();
    }
});

export default router
