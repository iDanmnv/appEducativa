<template>
    <v-app>
        <v-main>
            <v-container fluid>
                <v-card
                    class="mx-auto mt-7"
                    max-width="654"
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
                            <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">Iniciar sesión</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import http from "@/plugins/http.js";

export default {
    name: "Login",

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
    }
};
</script>