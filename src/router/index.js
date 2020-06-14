import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Home from '../views/dashboard/Home.vue'
import Courses from '../views/dashboard/Courses.vue'
import Account from '../views/dashboard/Account.vue'

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
		path: '/login',
		name: 'Login',
		component: Login
	}
]

const router = new VueRouter({
	routes
})

// Auth Guard
router.beforeEach((to, from, next) => {
    let token = Vue.cookie.get('SSaeI'); // Cookie que contiene un jwt.

    // Usuario no logueado, se manda al login.
    if (to.name !== 'Login' && token == null) {
        next({ name: 'Login' });
    }
    else next();
});

export default router
