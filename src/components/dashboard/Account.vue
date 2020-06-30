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

                        <span class="overline">CONFIGURACION</span>
                        <v-switch v-model="editing" class="mx-2" label="Editar"></v-switch>
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            :value="user.perfil.username"
                                            label="Nombre de usuario"
                                            outlined
                                            :disabled="!editing"
                                        ></v-text-field>
                                    </v-col>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                        type="password"
                                        label="Contraseña"
                                        :disabled="!editing"
                                        loading
                                        outlined
                                        >
                                        <template v-slot:progress>
                                            <v-progress-linear
                                            :value="progress"
                                            :color="color"
                                            absolute
                                            height="7"
                                            ></v-progress-linear>
                                        </template>
                                        </v-text-field>
                                    </v-col>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            :value="user.nombre"
                                            label="Nombre"
                                            outlined
                                            :disabled="!editing"
                                        ></v-text-field>
                                    </v-col>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            :value="user.email"
                                            label="Email"
                                            outlined
                                            :disabled="!editing"
                                        ></v-text-field>
                                    </v-col>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>


                    </v-card-text>
                    <v-card-actions v-if="editing">
                        <v-btn class="mx-5" outlined color="primary" @click="editData">Guardar</v-btn>
                        <v-btn class="mx-5" outlined color="red">Cancelar</v-btn>
                    </v-card-actions>
                
                </v-card>
                </v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
//import { http } from '@/plugins/http.js'

export default {
    name: "Account",
    data: () => ({
        user: {},
        editing: false,
        username: '',
        password_one: '',
        name: '',
        email: '',
        successAlert: false,
        value: '',
        loading: true

    }),
    methods: {
        loadData () {
            this.user = this.$store.state.user;
            console.log(this.user);
            this.loading = false;
        },
        editData () {
            
            
            this.successAlert = true;
            this.editing = false;
            window.scrollTo(0,0); 
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
    mounted(){
        this.loadData();
    }
}
</script>