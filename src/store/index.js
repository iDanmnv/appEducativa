import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'

import axios from 'axios';
import { http, URL } from '@/plugins/http.js';

Vue.use(Vuex)

export default new Vuex.Store({
	// Vars
	state: {
		status: '',
		token: VueCookie.get('SSaeI') || '', // Tratamos obtener la cookie si existe una sesión
		user: {}
	},
	// Mutaciones
	mutations: {
		jwt_request(state) {
			state.status = 'fetch';
		},
		jwt_success(state, data) {
			// Jwt devuelto correcamente, almacenamos cookie y la autenticidad Bearer.
			state.status = 'done';
			state.token = data.token;
			state.user = data.user;
			VueCookie.set('SSaeI', data.token, { expires: '2D' });
			http.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
		},
		jwt_error(state) {
			state.status = 'error';
		},
		set_user(state, user) {
			state.user = user;
		},
		logout(state) {
			// Limpiamos variables, eliminamos cookie y autenticidad Bearer.
			state.status = '';
			state.token = '';
			VueCookie.delete('SSaeI');
			delete http.defaults.headers.common['Authorization'];
		},
	},
	// Functions
	actions: {
		login({ commit }, data) {
			// Promesa para setear usuario y token en el sistema
			return new Promise((resolve, reject) => {
				commit('jwt_request');
				// Solicitar jwt desde el servidor
				axios.post(`${URL}/auth/login`, { email: data.email, passwd: data.passwd })
					.then(res => {
						// Success
						if (res.data.ok) {
							// Constantes necesarias
							const token = res.data.jwt;
							const user = res.data.usuario;

							// Trigger
							commit('jwt_success', { token: token, user: user });
							resolve(res);
						}
						// Error
						else {
							commit('jwt_error');
							reject(res);
						}
					})
					// Error
					.catch(err => {
						commit('jwt_error');
						reject(err);
					});
			});
		},
		logout({ commit }) {
			// Promesa para eliminar usuario y token del sistema
			return new Promise((resolve) => {
				commit('logout');
				resolve();
			});
		},
		updateUser({ commit }, user) {
			return new Promise((resolve) => {
				commit('set_user', user);
				resolve();
			})
		}
	},
	// Obtener variables fuera de vuex
	getters : {
		isAuth: state => !!state.token,
		authStatus: state => state.status,
		jwt: state => state.token
	},
	modules: {
	}
})
