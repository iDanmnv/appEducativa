<template>
    <div>
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
        messages: [],
        msgText: '',
        sending: false
    }),
    methods: {
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
        isLogged(uid) {
            return this.$store.state.user._id == uid;
        },
        getDate(date) {
            return new Date(date).toLocaleString();
        },
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
    max-height: 65vh;
    overflow: auto;
}
</style>