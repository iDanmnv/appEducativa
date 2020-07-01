<template>
    <v-container>
        <v-card class="mx-auto fitScreen">
            <v-toolbar color="secondary" dark flat>

                <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-row class="rowFitScreen" justify="center" no-gutters>
                <!-- Chat List -->
                <v-col cols="4" md="3">
                    <v-list subheader dense rounded class="mt-1">
                        <!-- New chat -->
                        <v-list-item @click="dialog = true">
                            <v-list-item-icon>
                                <v-icon left>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Iniciar chat</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <!-- Chats -->
                        <v-subheader>Conversaciones</v-subheader>
                        <v-list-item-group color="primary" v-model="selectChat">
                            <v-list-item
                                v-for="(chat, index) in chats"
                                v-bind:key="index"
                                @click="viewChat(index)"
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
                <v-col cols="8" md="9">
                    <Messages v-bind:key="chatid" :chatid="chatid" />
                </v-col>
            </v-row>
        </v-card>

        <!-- User list -->
        <v-dialog v-model="dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>Usuarios</v-card-title>
                <v-divider></v-divider>

                <v-card-text style="height: 300px;">
                    <v-radio-group v-model="dialogSelect" column>
                        <v-radio
                            v-for="(user, index) in users"
                            v-bind:key="index"
                            :label="`${user.nombre} (${user.perfil.username})`"
                            :value="user._id"
                            color="secondary"
                        ></v-radio>
                    </v-radio-group>
                    <p v-if="users.length <= 0">No existen usuarios para iniciar una conversación.</p>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="dialog = false">Cerrar</v-btn>
                    <v-btn color="primary" text @click="sheet = true" :disabled="dialogSelect == ''">Seleccionar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Sheet bottom to send message -->
        <v-dialog v-model="sheet" max-width="350px">
            <v-card>
            <v-card-title>
                Mensaje
            </v-card-title>
            <v-card-text>
                <v-textarea
                    v-model="msgText"
                    class="mx-2 pa-2"
                    rows="1"
                    label="Escribe tu mensaje"
                    prepend-inner-icon="mdi-comment"
                    :loading="sending"
                    :disabled="sending"
                    clearable
                    auto-grow
                    dense
                    filled
                ></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="sheet = false">Cerrar</v-btn>
                <v-btn color="primary" text @click="sendMsg" :disabled="emptyText">Enviar</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { http } from '@/plugins/http.js'
import Messages from '@/components/dashboard/Messages.vue';

export default {
    name: "Chat",
    components: { Messages },
    data: () => ({
        uid: '', // User id
        chats : [], // User chats
        title: 'Chat', // Receiver name of chat
        chatid: null, // Id of current chat
        selectChat: 0, // Index of selected chat in lst
        dialogSelect: '', // Select user in new chat
        dialog: false, // Var to open user list
        sheet: false, // Var to open create chat
        msgText: '', // Message of new chat
        sending: false, // Sending msg to server
        users: [], // Users to show in new chat
    }),
    methods: {
        // Load user chats
        loadConversations() {
            this.uid = this.$store.state.user._id;
            http.get(`Conversacion/user/${this.uid}`)
                .then(res => {
                    const data = res.data;

                    if (data.ok) {
                        this.chats = data.chats;
                        this.chatid = this.chats[0]._id;
                        this.title = this.chats[0].miembros[0].nombre;
                        
                        this.loadUsers(this.chats.map(chat => chat.miembros[0]._id));
                    }
                })
                .catch(err => {
                    console.log(err.response.statusText);
                });
        },
        // View one chat
        viewChat(key) {
            this.chatid = this.chats[key]._id;
            this.title = this.chats[key].miembros[0].nombre;
        },
        // Load users for new chat
        loadUsers(uuids) {
            uuids.push(this.uid);
            http.put(`Usuario/all`, { uuids: uuids })
                .then(res => {
                    const data = res.data;

                    if (data.ok) this.users = data.users;
                })
                .catch(erro => console.log(erro.response.statusText));
        },
        // Create new chat
        sendMsg() {
            if (!this.emptyText) {
                this.sending = true;
                http.post(`Conversacion/init/${this.$store.state.user._id}`, { receiver: this.dialogSelect, msg: this.msgText })
                    .then(res => {
                        const data = res.data;

                        if (data.ok) {
                            this.chats.push(data.chat);
                            this.chatid = data.chat._id;
                            this.selectChat = this.chats.length - 1;

                            this.loadUsers(this.chats.map(chat => chat.miembros[0]._id));
                        }
                    })
                    .catch(erro => console.log(erro.response.statusText))
                    .finally(() => {
                        this.sending = false;
                        this.sheet = false;
                        this.dialog = false;
                        this.msgText = '';
                        this.dialogSelect = '';
                    });
            }
        }
    },
    computed: {
        emptyText() {
            return this.msgText.length <= 0;
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