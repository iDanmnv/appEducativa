<template>
    <v-app>
        <v-navigation-drawer
            :mini-variant="mini"
            app
            :permanent="true"
            width="200"
            color="primary"
            dark
        >
            <v-layout column fill-height>
                <v-list dense>
                    <v-list-item class="px-2">
                        <v-list-item-avatar @click.stop="mini = !mini">
                            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-title>{{this.$store.state.user.nombre}}</v-list-item-title>

                        <v-btn icon @click.stop="mini = !mini">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item
                        v-for="item in items"
                        :key="item.text"
                        :hidden="!item.show"
                        link
                        class="py-3"
                        @click="go(item.page)"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

					<v-list-item link class="py-3" @click="changeTheme">
                        <v-list-item-icon>
                            <v-icon>mdi-invert-colors</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Tema</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-spacer></v-spacer>

                <v-list dense>
                    <v-list-item link class="py-3" @click.stop="dialogSess = true">
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Salir</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

				<v-dialog
					v-model="dialogSess"
					max-width="290"
				>
					<v-card>
						<v-card-title class="headline">Whoaa!</v-card-title>
						<v-card-text>¿Desea cerrar sesión?</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" text @click="dialogSess = false">No</v-btn>

							<v-btn color="primary" text @click="closeSession" >Sí</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
            </v-layout>
        </v-navigation-drawer>

        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: "Dashboard",

    data: () => ({
		mini: null,
		dialogSess: false,
        items: []
	}),
	methods: {
        go(pathRoute) {
            this.$router.push({ path: pathRoute });
        },
        changeTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
        },
        closeSession() {
            this.dialogSess = false;
            this.$store.dispatch('logout')
                .then(() => this.$router.push({ name: 'Login' }));
        }
    },
    mounted() {
        this.items = [
            { icon: "rss", text: "Mis cursos", page: "/", show: this.$store.state.user.rol != 'ADMIN' },
            { icon: "view-list", text: "Catálogo", page: "/courses", show: true },
            { icon: "forum", text: "Chat", page: "/chat", show: true },
            { icon: "account-box", text: "Perfil", page: "/profile", show: true }
        ]
    }
}
</script>