<style>
    .container{
      display: block;
    }
    .card{
        margin: 10px;
    }
    .v-alert{
        display: absolute;
    }
    .header{
        width:"100%";
        padding: 20px;
        background: #e0e0e0;
        color: black;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
    }
    .header-text{
        font-family: Arial, Helvetica, sans-serif;
    }
    .contenidos-container{
        padding: 20px;
        background: #D6D6D6;
        border: dashed 1px #B3B2B2;
    }
</style>

<template>
    <v-container class="container">
       <v-alert
            class="v-alert"
            :value="alert"
            color="green"
            dark
            border="top"
            icon="mdi-home"
            transition="scale-transition">
            <div style="display: flex; justify-content:space-between;">
                success 
                <v-btn color="red" @click="alert = false">Close</v-btn>
            </div>
        </v-alert>
        <div class="header">
            <h3 class="header-text">Catalogo de Cursos</h3>
            <v-btn color="success" @click="dialogCreateCourse = true">Crear Curso</v-btn>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 50px;">
            <v-flex xs12 sm6 md8>
                <v-card class="card" v-for="course in courses" :key="course._id">
                    <v-card-title>
                        {{course.nombre}}
                    </v-card-title>
                    <v-card-text>
                        {{course.nombre}}
                    </v-card-text>
                    <v-card-actions>
                        <v-btn 
                            :disabled="coursesByUser.includes(course._id)"
                            raised 
                            @click="inscirbirseBtnClicked(course._id)" 
                            class="primary">
                            {{coursesByUser.includes(course._id) ? 'Ya estas inscrito' : 'Inscribirme'}}
                        </v-btn>
                        <v-btn color="red lighten-2" dark @click="courseInfo(course)" rounded class="secondary small">información</v-btn>
                    </v-card-actions>
                </v-card>
        </v-flex>
         </div>
          <v-dialog
            v-model="dialog"
            width="500"
        >
    
            <v-card>
            <v-card-title
                class="headline grey lighten-2"
                primary-title
            >
                Curso: {{selectedCourse.nombre}}
            </v-card-title>
    
            <v-card-text>
                <p>Nombre del curso: {{selectedCourse.nombre || 'tmp'}}</p>  
                <p>Impartido por: {{selectedCourse.autor || 'profe sin nombre'}}</p> 
                <p>El curso consta de un total de {{selectedCourse.contenidos.length || 0}} contenidos disponbiles para ti 24/7</p>
            </v-card-text>
            <v-divider></v-divider>
    
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                text
                @click="dialog = false"
                >
                Close
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialogCreateCourse"
            width="70%"
        >
            <v-card>
            <v-card-title
                class="headline grey lighten-2"
                primary-title
            >
               {{nuevoCursoNombre !== '' ? nuevoCursoNombre : 'Crear Curso'}}
            </v-card-title>
            <v-card-text>
                  <v-text-field label="Nombre del curso" v-model="nuevoCursoNombre"></v-text-field>
                  <v-text-field label="Autor" v-model="nuevoCursoAutor"></v-text-field>
                  <v-divider></v-divider>
                  <div class="contenidos-container">
                    <v-subheader>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                            Contenidos {{nuevoCursoObject.contenidos.length}}
                            <v-btn style="padding: 10px" color="primary" @click="agregarContenidoAlCurso()">Agregar Contenido</v-btn>  
                        </div>                    
                    </v-subheader>
                    <div :v-model="nuevoCursoContenidos.length > 0 ? true : false">
                            <v-text-field label="Titulo del Contenido" v-model="nuevoCursoContenidoTitulo" ></v-text-field>
                            <v-text-field  type="number" label="nivel" v-model="nuevoCursoContenidoNivel" ></v-text-field>
                            <v-text-field label="Id de video youtube"  v-model="nuevoCursoContenidoVideo" ></v-text-field>
                            <v-divider></v-divider>
                            <v-text-field label="Nombre de examen"  v-model="nuevoCursoContenidoQuizNombre" ></v-text-field>
                            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                            <v-subheader>Preguntas</v-subheader>
                            <v-btn style="padding: 10px"  @click="agregarPreguntasQuiz()">Confirmar Pregunta</v-btn>  
                                </div>  
                            <v-text-field label="Pregunta" v-model="nuevoCursoContenidoQuizPregunta"></v-text-field>
                            <v-text-field label="Respuesta Correcta" v-model="nuevoCursoContenidoQuizRespuesta1"></v-text-field>
                            <v-text-field label="Respuesta" v-model="nuevoCursoContenidoQuizRespuesta2"></v-text-field>
                            <v-btn color="primary" @click="confirmadoNuevoContenido()">Confirmar el contenido del curso</v-btn>
                    </div>
                    <v-expansion-panels style="padding-top: 20px">
                    <v-expansion-panel
                        v-for="nuevoContenido in nuevoCursoObject.contenidos"
                        :key="nuevoContenido.titulo || ''"
                    >
                        <v-expansion-panel-header>{{nuevoContenido.titulo}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    </v-expansion-panels>
                </div>
                </v-card-text>
            
            <v-divider></v-divider>
    
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="success"
                text
                @click="guardarNuevoCurso()"
                >
                Guardar
                </v-btn>
                <v-btn
                color="primary"
                text
                @click="dialogCreateCourse = false"
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
  name: "Courses",
  data: () => ({
      nuevoCursoObject: {
          contenidos: [],
      },
      preguntasContenido: [],
      nuevoCursoNombre: '',
      nuevoCursoAutor:'',
      nuevoCursoContenidoTitulo: '',
      nuevoCursoContenidoVideo: '',
      nuevoCursoContenidoNivel: 1,
      nuevoCursoContenidoQuizNombre: '',
      nuevoCursoContenidoQuizPregunta: '',
      nuevoCursoContenidoQuizRespuesta1: '',
      nuevoCursoContenidoQuizRespuesta2: '',
      nuevoCursoContenidos: [],  
      courses: [],
      coursesByUser: [],
      alert: false,
      selectedCourse: {
          contenidos:  [],
          nombre:'',
          autor:'',
      },
      dialog: false,
      dialogCreateCourse: false,
  }),
  mounted() {
    this.getCourses();
  },
  methods:{
      getCourses(){
        http.get("/Curso")
        .then((result) => {
            if(result.status == 200){
                this.courses = result.data;
                this.updateCursosByUser();
            }
        })
        .catch((error) => {
            console.log(error);
        });
      },
        async inscirbirseBtnClicked(idCurso){
        this.alert = false;
         await http.put("Curso/inscripcionCurso", { idCurso: idCurso, user: this.$store.state.user })
            .then(async (result) => {
            if(result.status == 200){
                this.alert = true;
                this.$store.state.user.cursos =  this.$store.state.user.cursos.concat({ idCurso: idCurso, finalizado: false });
            } else {
                console.log('error');
            }
            })
            .finally(() => { this.updateCursosByUser(); });
      },
    updateCursosByUser(){
        this.coursesByUser = this.$store.state.user.cursos.map((curso) => curso.idCurso);
        // http.get(`UsuarioContenido/ByUser/${this.$store.state.user._id}`)
        //     .then((r) => { 
        //         this.coursesByUser = r.data.cursos.map((curso) => curso.idCurso);
        //     });
        //     console.log('this is courses by user', this.coursesByUser);
      },
      courseInfo(course){
          this.selectedCourse = course;
          this.dialog = true;
      },
      agregarContenidoAlCurso(){
          this.nuevoCursoContenidos.push(
              {
                  titulo: 'Nuevo contenido',
                  nivel: 1,
                  video: '',
                  quiz:[],
              }
            );
            this.nuevoCursoContenidoTitulo = 'Nuevo Contenido';
            this.nuevoCursoContenidoVideo = '';
            this.nuevoCursoContenidoNivel = 1;
            this.nuevoCursoContenidoQuizNombre = '';
            this.preguntasContenido = [];
      },
      confirmadoNuevoContenido(){
          this.nuevoCursoObject.contenidos.push({  
            titulo: this.nuevoCursoContenidoTitulo,
            nivel: this.nuevoCursoContenidoNivel || 1,
            video: this.nuevoCursoContenidoVideo,
            quiz: {
                titulo: this.nuevoCursoContenidoQuizNombre,
                preguntas: this.preguntasContenido,
            }
        });
      },
      agregarPreguntasQuiz(){
          this.preguntasContenido.push({pregunta: this.nuevoCursoContenidoQuizPregunta, respuestas: [{ respuesta: this.nuevoCursoContenidoQuizRespuesta1, correcta: true }, {respuesta: this.nuevoCursoContenidoQuizRespuesta2, correcta: false}]});
          this.nuevoCursoContenidoQuizPregunta = '';
          this.nuevoCursoContenidoQuizRespuesta1 = '';
          this.nuevoCursoContenidoQuizRespuesta2= '';
      },
      guardarNuevoCurso(){
          this.nuevoCursoObject.nombre = this.nuevoCursoNombre;
          this.nuevoCursoObject.autor = this.nuevoCursoAutor;
          http.post('/Curso', { curso: this.nuevoCursoObject })
          .then(r => {
              console.log(r);
          })
          .catch((err) => {
              console.log('error', err);
          });
      }
  }
};
</script>
