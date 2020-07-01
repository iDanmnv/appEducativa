<style>
    .header{
        width:"100%";
        padding: 20px;
        background: #e0e0e0;
        color: black;
    }
    .main-container{
        padding-top: 20px;
        display: flex;
        flex-wrap: nowrap;
    }
    .start-quiz-container{
        display:flex;
        justify-content: flex-end; 
        padding: 10px;
    }
    .video{
        display:flex;
        justify-content: center;
    }
</style>
<template>
   <v-container>
        <div class="header">
            <h3 class="header-text">MIS CURSOS</h3>
        </div>
        <v-row class="main-container">
        <v-card
        class="mx-auto"
        max-width="400"
        tile>
            <v-list
                :three-line="threeLine"
                :shaped="shaped"
                :nav="nav"
            >
                <v-subheader>MIS CURSOS</v-subheader>
                <v-list-item-group color="primary">
                <v-list-item
                    v-for="myCourse in myCourses"
                    :key="myCourse._id"
                >
                    <v-list-item-content @click="setSelectedCourse(myCourse)">
                    <v-list-item-title v-html="myCourse.nombre"></v-list-item-title>
                    <v-list-item-subtitle v-if="threeLine" v-html="myCourse.autor"></v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
        <div v-if="detailOpened" style="width: 70%; height: 400px; background: #F2F7F6; padding: 10px">
            <v-subheader>{{selectedCourse.nombre}}</v-subheader>
            <v-expansion-panels>
            <v-expansion-panel
                v-for="contenido in selectedCourse.contenidos"
                :key="contenido._id"
            >
                <v-expansion-panel-header>{{contenido.titulo}}</v-expansion-panel-header>
                <v-expansion-panel-content>
                    Explicacion del tema:
                    <youtube-media class="video" :video-id="contenido.video"></youtube-media>
                    <div class="start-quiz-container">
                        <v-btn @click="startQuiz(contenido, contenido._id)" color="success">Comenzar quiz</v-btn>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </v-row>
     <v-dialog
            v-model="dialog"
            width="70%"
        >
            <v-card>
            <v-card-title
                class="headline grey lighten-2"
                primary-title
            >
                Examen:  {{selectedQuiz.titulo}}!
            </v-card-title>
    
            <v-card-text>
               <div   v-for="(preguntaTmp, index) in selectedQuiz.preguntas" :key="preguntaTmp.pregunta">
                    Pregunta: {{preguntaTmp.pregunta}}
                    <v-col class="d-flex" >
                        <v-select
                        :items="preguntaTmp.respuestas.map((r) => r.respuesta)"
                        :label="respuestasExamen[index] != undefined ? 'Pregunta contestada': 'Respuestas'"
                        :disabled="respuestasExamen[index] != undefined ? true : false"
                        :item-value="respuestasExamen[index] == undefined ? '' : respuestasExamen[index]"
                         @change="agregarRespuestaArray($event, index)"
                        ></v-select>
                    </v-col>
               </div>
            </v-card-text>
            <v-divider></v-divider>
    
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="success"
                text
                @click="revisarTest()"
                >
                Revisar
                </v-btn>
                <v-btn
                color="primary"
                text
                @click="dialog = false"
                >
                Cancel
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
</v-container>
</template>

<script>
import { http } from '@/plugins/http.js';
export default {
    name: "home",
    data: () => ({
        threeLine: true,
        shaped:true,
        nav: true,
        myCourses: [{
            nombre: '',
            autor: '',
            contenidos: [],
        }],
        courses: [],
        selectedCourse: { nombre: '', autor: '', contenidos: []},
        detailOpened: false,
        dialog: false,
        selectedQuiz: [],
        selectedContent: {},
        respuestasUsuario: {},
        respuestasExamen: [],
        userContents : [],
    }), 
    mounted() {
    this.getCourses();
    this.getUserContents();
    },
    updated(){},
    methods:{
     agregarRespuestaArray(event, index){
          this.respuestasExamen[index] = event;
     }, 
      getCourses(){
        http.get("/Curso")
        .then((result) => {
            if(result.status == 200){
                this.courses = result.data;
                this.getMyCourses();
            }
        })
        .catch((error) => {
            console.log(error);
        });
      },
      getMyCourses(){
          const coursesIds = this.$store.state.user.cursos.map((e) => e.idCurso);
          this.myCourses = this.courses.filter((curso) => coursesIds.includes(curso._id) ? curso : null );
      },
      setSelectedCourse(myCourse){
        this.selectedCourse = myCourse;
        this.detailOpened = true;
        //   console.log(this.selectedCourse);
      },
      startQuiz(contenido, id){
          this.selectedContent = {...contenido, id};
          this.selectedQuiz = contenido.quiz;
          this.respuestasExamen = [];
          this.dialog = true;
      },
      revisarTest(){
        //   console.log(this.respuestasExamen);
        //   console.log(this.selectedQuiz);
          let puntuacion = 0;
          for(let i = 0; i < this.respuestasExamen.length; i++){
              for(let j = 0; j< this.selectedQuiz.preguntas[i].respuestas.length; j++){
                  if(this.selectedQuiz.preguntas[i].respuestas[j].respuesta == this.respuestasExamen[i] && this.selectedQuiz.preguntas[i].respuestas[j].correcta == true){
                    puntuacion++;
                  }
              }
          }
          const puntuacionMaxima = this.selectedQuiz.preguntas.length;
          const calificacion = (puntuacion * 10) / puntuacionMaxima;
        //   console.log('califiacion: ',calificacion);
        //   console.log('contenido: ', this.selectedContent);
        //   console.log('user: ',this.$store.state.user);
        const { _id = null } = this.selectedContent;
        const { _id: usuId = null } = this.$store.state.user;
        http.post('/UsuarioContenido', { idUsuario: usuId, idContenido: _id, calificacion }).then((result) => {
            if( result.status == 200){
                console.log("exito");
                this.dialog = false;

            } else {
                console.log("falló");
            }
        });
      },
      getUserContents(){
          http.get('/UsuarioContenido')
          .then(result => {
              console.log(result);
          });
      },
    }
}
</script>