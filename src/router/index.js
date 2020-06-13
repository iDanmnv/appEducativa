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
		name: 'Dashboard',
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

export default router
