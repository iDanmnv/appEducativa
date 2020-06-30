<template>
    <v-container fluid>
        <v-row
        class="mb-6"
        justify="center"
        no-gutters
        >
            <v-col lg="3">
                <v-card
                    min-height="640px"
                    class="mx-auto"
                >
                    <v-toolbar
                    color="deep-purple accent-4"
                    dark
                    >
                        <v-app-bar-nav-icon></v-app-bar-nav-icon>

                        <v-toolbar-title>Chat</v-toolbar-title>

                        <v-spacer></v-spacer>

                        <v-btn icon>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-list subheader>
                    <v-subheader>Conversaciones recientes</v-subheader>

                    <v-list-item>
                        <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>Daniel Molina</v-list-item-title>
                            <v-list-item-subtitle>- Hey! rola la tarea</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-icon>
                        <v-icon color="deep-purple accent-4"></v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                    </v-list>

                    <v-divider></v-divider>
                </v-card>
            </v-col>
            <v-col lg="9">
                    <v-toolbar
                    color="deep-purple accent-4"
                    dark
                    >
                    <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                    </v-list-item-avatar>

                    <v-toolbar-title>Daniel Molina</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon>
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    </v-toolbar>                
                  <v-responsive
                        class="overflow-y-auto"
                        height="450"
                    >
                    <v-row no-gutters v-for="n in 15" :key="n" justify="end">
                        <v-col class="pa-6" :offset-md="(n%2==0)? '7': ''">
                            <v-card max-width="320px" :color="(n%2!=0)? 'primary' : ''">
                                <v-card-subtitle class="text--white">
                                    Esto es un mensaje de prueba jajajaja prueba prueba mensaje
                                </v-card-subtitle>
                            </v-card>
                        </v-col>
                    </v-row>
                  </v-responsive>
                  <v-textarea
                    class="mx-2 py-2"
                    label="Escribe tu mensaje"
                    rows="4"
                    prepend-icon="mdi-comment"
                    outlined
                    ></v-textarea>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "Chat",
    data: () => {

    },
    methods: {
        loadConversations(){

        }
    },
    mounted(){
        this.loadConversations();
    }
}
</script>
