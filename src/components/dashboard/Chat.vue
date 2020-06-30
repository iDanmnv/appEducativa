<template>
    <v-container fluid>
        <v-card class="mx-auto fitScreen">
            <v-toolbar color="secondary" dark flat>

                <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-row class="rowFitScreen" justify="center" no-gutters>
                <!-- Chat List -->
                <v-col lg="3">
                    <v-list subheader dense rounded>
                        <v-subheader>Conversaciones</v-subheader>
                        <v-list-item-group color="primary">
                            <v-list-item
                                v-for="chat in chats"
                                v-bind:key="chat.key"
                            >
                                <v-list-item-avatar>
                                    <v-img src="https://randomuser.me/api/portraits/men/84.jpg"></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{ chat.miembros[0].nombre }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ chat.miembros[0].perfil.username }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-col>
                <!-- Chat messages -->
                <v-col lg="9">
                    <Messages v-bind:key="chatid" :chatid="chatid" />
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { http } from '@/plugins/http.js'
import Messages from '@/components/dashboard/Messages.vue';

export default {
    name: "Chat",
    components: { Messages },
    data: () => ({
        uid: '',
        chats : [],
        title: 'Chat',
        chatid: null
    }),
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.loadConversations();
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.loadConversations();
        next();
    },
    methods: {
        loadConversations() {
            this.uid = this.$store.state.user._id;
            http.get(`Conversacion/user/${this.uid}`)
                .then(res => {
                    const data = res.data;

                    if (data.ok) {
                        this.chats = data.chats;
                        this.chatid = this.chats[0]._id;
                        this.title = this.chats[0].miembros[0].nombre;
                    }
                })
                .catch(err => {
                    console.log(err.response.statusText);
                });
        }
    },
    mounted() {
        this.loadConversations();
    }
};
</script>

<style scoped>
    .fitScreen {
        height: 95vh;
    }
    .rowFitScreen {
        max-height: 85vh;
        overflow: hidden;
    }
</style>