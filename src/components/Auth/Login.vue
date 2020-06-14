<template>
    <v-app>
        <v-card
            class="mx-auto"
            min-width="630"
            outlined
        >
            <v-form ref="form" v-model="valid" lazy-validation>
                <div class="pa-7">
                    <v-text-field v-model="email" :rules="emailRules" label="Correo" required></v-text-field>

                    <v-text-field v-model="password" :rules="passwordRules" label="Contraseña" type="password" required></v-text-field>
                </div>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="error" class="mr-4" @click="reset">Limpiar</v-btn>
                    <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">Iniciar</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

        <v-snackbar v-model="prevRegistered">Usuario registrado!</v-snackbar>
    </v-app>
</template>

<script>
import http from "@/plugins/http.js";

export default {
    name: "Login",

    props: {
        registered: Boolean
    },

    data: () => ({
        valid: false,
        password: "",
        passwordRules: [
            v => !!v || "Campo obligatorio",
        ],
        email: "",
        emailRules: [
            v => !!v || "Campo obligatorio",
            v => /.+@.+\..+/.test(v) || "Formato incorrecto"
        ],
    }),

    methods: {
        validate() {
            // Submit
            if (this.$refs.form.validate()) {
                // Solicitar jwt
                http.post('/auth/login', { email: this.email, passwd: this.password })
                    .then(res => {
                        // Success
                        if (res.data.ok) {
                            // Guardar jwt en cookie
                            this.$cookie.set('SSaeI', res.data.jwt, 2);
                            this.$router.push({ name: 'Home' });
                        }
                    })
                    .catch(err => console.log(err) );
            }
        },
        reset() {
            this.$refs.form.reset();
        }
    },

    computed: {
        prevRegistered: {
            get() { return this.registered; },
            set(fadeSnack) { return fadeSnack }
        }
    }
};
</script>