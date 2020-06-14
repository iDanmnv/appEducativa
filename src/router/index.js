import Vue from 'vue'
import VueRouter from 'vue-router'

// Views
import Auth from '../views/Auth.vue'
import Dashboard from '../views/Dashboard.vue'

// Components
import Home from '../components/dashboard/Home.vue'
import Courses from '../components/dashboard/Courses.vue'
import Account from '../components/dashboard/Account.vue'
import Login from '../components/Auth/Login.vue'
import Register from '../components/Auth/Register.vue'

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
            }
		]
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
        ]
    }
]

const router = new VueRouter({
	routes
})

// Auth Guard
router.beforeEach((to, from, next) => {
    let token = Vue.cookie.get('SSaeI'); // Cookie que contiene un jwt.

    // Usuario no logueado, se manda al login.
    if (to.matched[0].path !== '/auth' && token == null) {
        next({ name: 'Login' });
    }
    else next();
});

export default router
