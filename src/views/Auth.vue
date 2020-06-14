<template>
    <v-app>
        <v-app-bar
            fixed
            color="primary"
            elevate-on-scroll
            dark
        >
            <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

            <v-toolbar-title>App Educativa</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="go('Login')"><v-icon>mdi-login</v-icon></v-btn>
                </template>
                <span>Identificarse</span>
            </v-tooltip>
            

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="go('Register')"><v-icon>mdi-account-plus</v-icon></v-btn>
                </template>
                <span>Registrarse</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="changeTheme"><v-icon>mdi-invert-colors</v-icon></v-btn>
                </template>
                <span>Cambiar tema</span>
            </v-tooltip>

            <!-- <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn> -->
        </v-app-bar>
        <v-content class="pt-12">
            <v-container>
                <router-view class="mt-5"></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: "Auth",

    data: () => ({
        //
    }),
    methods: {
        go(pathRoute) {
            this.$router.push({ name: pathRoute });
        },
        changeTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
        }
    }
};
</script>