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

                    <v-text-field v-model="name" :rules="nameRules" label="Nombre" required></v-text-field>

                    <v-text-field v-model="username" :rules="usernameRules" label="Username" required></v-text-field>
                </div>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="error" class="mr-4" @click="reset">Limpiar</v-btn>
                    <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">Registrar</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-app>
</template>

<script>
import axios from 'axios';

export default {
    name: "Register",

    data: () => ({
        valid: false,
        password: "",
        passwordRules: [ v => !!v || "Campo obligatorio" ],
        email: "",
        emailRules: [
            v => !!v || "Campo obligatorio",
            v => /.+@.+\..+/.test(v) || "Formato incorrecto"
        ],
        name: "",
        nameRules: [ v => !!v || "Campo obligatorio"],
        username: "",
        usernameRules: [ v => !!v || "Campo obligatorio" ],
    }),

    methods: {
        validate() {
            // Submit
            if (this.$refs.form.validate()) {
                // Registro
                axios.post('http://localhost:3000/api/auth/register', { email: this.email, passwd: this.password, nombre: this.name, username: this.username, rol: "USER" })
                    .then(res => {
                        // Success
                        if (res.data.ok) this.$router.push({ name: 'Login', params: { registered: true }});
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