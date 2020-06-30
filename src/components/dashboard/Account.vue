<template>
    <v-container fluid>
        <v-row
        class="mb-6"
        justify="center"
        no-gutters
        >
            <v-col lg="10">

                <v-skeleton-loader
                    :loading="loading"
                    height="500px"
                    transition="scale-transition"
                    type="list-item-four-line"
                >
                <v-card
                    class="mx-auto"
                    min-height="500px"
                    outlined
                >
                    <v-img
                    class="white--text align-end secondary"
                    height="200px"
                    >
                        <v-card-title>

                            <v-list-item three-line>
                                <v-list-item-avatar
                                    tile
                                    size="80"
                                >
                                    <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <div class="overline mb-4 white--text" >{{user.rol}} - {{user._id}}</div>
                                    <v-list-item-title class="headline mb-1 white--text">{{user.nombre}}</v-list-item-title>
                                    <v-list-item-subtitle class="white--text"><v-icon>mdi-email</v-icon>{{user.email}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                        </v-card-title>
                    </v-img>

                    <!-- Edit: { general, password } -->
                    <v-tabs
                        v-model="tab"
                        background-color="secondary"
                        dark
                        grow
                    >
                        <v-tab>General</v-tab>
                        <v-tab>Seguridad</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                        <!-- General tab -->
                        <v-tab-item>
                            <v-card-text>
                                <v-alert
                                    dense
                                    text
                                    type="success"
                                    v-model="successAlert"
                                    dismissible
                                >
                                    Tu información ha sido <strong>correctamente</strong> actualizada.
                                </v-alert>

                                <span class="overline">GENERAL</span>
                                <v-switch v-model="editing" class="mx-2" label="Editar"></v-switch>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="perfil.username"
                                            label="Nombre de usuario"
                                            outlined
                                            :loading="updating"
                                            :disabled="!editing"
                                        ></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="user.nombre"
                                            label="Nombre"
                                            outlined
                                            :loading="updating"
                                            :disabled="!editing"
                                        ></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="user.email"
                                            label="Email"
                                            outlined
                                            :loading="updating"
                                            :disabled="!editing"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions v-if="editing">
                                <v-spacer></v-spacer>
                                <v-btn class="mx-5" outlined color="primary" @click="editData">Guardar</v-btn>
                                <v-btn class="mx-5" outlined color="red" @click="editing = false">Cancelar</v-btn>
                            </v-card-actions>
                        </v-tab-item>

                        <!-- Password tab -->
                        <v-tab-item>
                            <v-card-text>
                                <v-alert
                                    dense
                                    text
                                    type="success"
                                    v-model="successPasswd"
                                    dismissible
                                >
                                    Tu contraseña ha sido <strong>correctamente</strong> actualizada.
                                </v-alert>

                                <span class="overline">SEGURIDAD</span>
                                <v-switch v-model="editing" class="mx-2" label="Editar"></v-switch>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="password_one"
                                            type="password"
                                            label="Contraseña"
                                            :disabled="!editing"
                                            :loading="updating"
                                            outlined
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions v-if="editing">
                                <v-spacer></v-spacer>
                                <v-btn class="mx-5" outlined color="primary" @click="editPasswd">Guardar</v-btn>
                                <v-btn class="mx-5" outlined color="red" @click="editing = false">Cancelar</v-btn>
                            </v-card-actions>
                        </v-tab-item>
                    </v-tabs-items>

                </v-card>
                </v-skeleton-loader>
            </v-col>
        </v-row>

        <v-snackbar v-model="errorUpdate">{{snackText}}</v-snackbar>
    </v-container>
</template>

<script>
import { http } from '@/plugins/http.js'

export default {
    name: "Account",
    data: () => ({
        tab: null,
        user: {},
        perfil: {},
        editing: false,
        password_one: '',
        successAlert: false,
        successPasswd: false,
        loading: true,
        updating: false,
        snackText: '',
        errorUpdate: false
    }),
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.loadData();
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.loadData();
        next();
    },
    methods: {
        loadData () {
            this.user = this.$store.state.user;
            this.perfil = this.$store.state.user.perfil;
            this.loading = false;
        },
        editData () {
            this.editing = false;
            this.updating = true;
            http.patch(`/Usuario/${this.user._id}`, { 
                nombre: this.user.nombre,
                email: this.user.email,
                perfil: { username: this.perfil.username }
            })
                .then(res => {
                    const data = res.data;
                    if (data.ok)
                        this.$store.dispatch('updateUser', data.usuario).then(() => this.successAlert = true);
                    else this.restoreUser();
                })
                .catch(() => this.restoreUser())
                .finally(() => {
                    this.updating = false;
                    window.scrollTo(0,0); 
                });
        },
        editPasswd() {
            this.editing = false;
            this.updating = true;
            console.log(this.password_one);
            http.post(`Usuario/passwd/${this.user._id}`, { passwd: this.password_one })
                .then(res => {
                    if (res.data.ok) this.successPasswd = true;
                })
                .catch(() => this.restoreUser())
                .finally(() => this.updating = false);
        },
        restoreUser() {
            this.errorUpdate = true;
            this.snackText = "Error al actualizar los datos!";
            this.user.nombre = this.$store.state.user.nombre;
            this.user.email = this.$store.state.user.email;
            this.perfil.username = this.$store.state.user.perfil.username;
        }
    },
    computed: {
        progress () {
            return Math.min(100, this.password_one.length * 10)
        },
        color () {
            return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
        },
    },
}
</script>