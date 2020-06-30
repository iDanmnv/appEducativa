<template>
    <div>
        <v-responsive class="msgScreen">
            <v-row no-gutters v-for="msg in messages" v-bind:key="msg.key" justify="end">
                <v-col class="pa-6" :offset-md="(msg.key%2==0)? '7': ''">
                    <v-card max-width="320px" :color="(msg.key%2!=0)? 'primary' : ''">
                        <v-card-subtitle
                            class="text--white"
                        >{{msg.cuerpo}}</v-card-subtitle>
                    </v-card>
                </v-col>
            </v-row>
        </v-responsive>
        <v-textarea
            class="mx-2 py-2 boxText"
            label="Escribe tu mensaje"
            rows="3"
            prepend-icon="mdi-comment"
            filled
            rounded
        ></v-textarea>
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
        messages: []
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
        }
    },
    mounted() {
        this.loadMessages();
    }
};
</script>

<style>
.msgScreen {
    max-height: 65vh;
    overflow: auto;
}
</style>