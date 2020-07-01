<template>
    <div>
        <!-- Area de mensajes -->
        <v-responsive class="msgScreen" ref="chatBox">
            <v-row no-gutters ref="list_msgs">
                <v-col
                    cols="12"
                    v-for="msg in messages"
                    v-bind:key="msg.key"
                >
                    <v-card
                        :color="(isLogged(msg.IdAutor))? 'primary' : 'tertiary'"
                        :style="`float: ${isLogged(msg.IdAutor) ? 'right' : 'left'}`"
                        @click="confirmDelete(msg.IdAutor, msg._id)"
                        class="ma-2"
                        max-width="35vw"
                        flat
                        dark
                    >
                        <v-tooltip :right="!isLogged(msg.IdAutor)" :left="isLogged(msg.IdAutor)">
                            <template v-slot:activator="{ on, attrs }">
                                <v-card-text v-bind="attrs" v-on="on">{{msg.cuerpo}}</v-card-text>
                            </template>
                            <span>{{getDate(msg.fechaEnviado)}}</span>
                        </v-tooltip>
                    </v-card>
                </v-col>
            </v-row>
        </v-responsive>

        <!-- Textarea para mensaje -->
        <div class="d-flex flex-row">
            <v-textarea
                v-model="msgText"
                class="mx-2 pa-2"
                rows="1"
                label="Escribe tu mensaje"
                prepend-inner-icon="mdi-comment"
                :loading="sending"
                :disabled="sending"
                clearable
                no-resize
                filled
            ></v-textarea>
            <div class="pa-2">
                <v-btn class="mx-2" fab small color="primary" :disabled="emptyText" @click="sendMsg"><v-icon dark>mdi-send</v-icon></v-btn>
            </div>
        </div>

        <!-- Modal para eliminar mensaje -->
        <v-dialog
            v-model="dialogDel"
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Whoaa!</v-card-title>
                <v-card-text>¿Deseas eliminar el mensaje?</v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialogDel = false">No</v-btn>

                    <v-btn color="error" text @click="deleteMsg">Sí</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Messafe from deleted -->
        <v-snackbar v-model="deletedMsg">Mensaje eliminado!</v-snackbar>
    </div>
</template>

<script>
import { http } from '@/plugins/http.js'

export default {
    name: "Messages",
    props: {
        chatid: String
    },
    data: () => ({
        messages: [], // Chat messages
        msgText: '', // Text of new message
        sending: false, // Sending message to back
        dialogDel: false, // Var to open confirm dialog
        msgToDelete: '', // Message id to delete
        deletedMsg: false // Var to open snackbar when deleted message
    }),
    methods: {
        // Load chat messages
        loadMessages() {
            if (this.chatid != undefined && this.chatid != null) {
                http.get(`Conversacion/messages/${this.chatid}`)
                    .then(res => {
                        const data = res.data;
    
                        if (data.ok) this.messages = data.messages;
                    })
                    .catch(erro => console.log(erro.response.statusText));

            }
        },
        // Return if messare belong to logged user
        isLogged(uid) {
            return this.$store.state.user._id == uid;
        },
        // Convert date to string
        getDate(date) {
            return new Date(date).toLocaleString();
        },
        // Send message to back
        sendMsg() {
            if (!this.emptyText) {
                this.sending = true;
                http.put(`Conversacion/messages/${this.chatid}`, { autor: this.$store.state.user._id, msg: this.msgText })
                    .then(res => {
                        const data = res.data;

                        if (data.ok)  {
                            this.msgText = '';
                            this.messages.push(data.message);
                            this.scrollToEnd();
                        }
                    })
                    .catch(erro => console.log(erro.response.statusText))
                    .finally(() => this.sending = false);
            }
        },
        // Dialog to confirm delete
        confirmDelete(autor, msgid) {
            if (this.isLogged(autor)) {
                this.dialogDel = true;
                this.msgToDelete = msgid;
            }
        },
        // Delete message from back
        deleteMsg() {
            if (this.msgToDelete != '') {
                http.delete(`Conversacion/chat/${this.chatid}/message/${this.msgToDelete}`)
                    .then(res => {
                        const data = res.data;

                        if (data.ok) {
                            let index = this.messages.findIndex(msg => msg._id == data._mid)
                            this.messages.splice(index, 1);
                            this.deletedMsg = true;
                        }
                    })
                    .catch(erro => console.log(erro.response.statusText))
                    .finally(() => {
                        this.msgToDelete = '';
                        this.dialogDel = false;
                    })
            }
        },
        // Set messages area to bottom always
        scrollToEnd() {
            var chatBox = this.$el.querySelector(".msgScreen");
            chatBox.scrollTop = this.$refs.list_msgs.clientHeight;
        }
    },
    computed: {
        emptyText() {
            return this.msgText.length <= 0;
        }
    },
    mounted() {
        this.loadMessages();
    },
    updated() {
        this.$nextTick(() => this.scrollToEnd());
    }
};
</script>

<style>
.msgScreen {
    max-height: 73vh;
    overflow: auto;
}
</style>