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
        background: #FFE633;
        color: black;
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
            <h3>Catalogo de Cursos</h3>
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
    </v-container>
</template>

<script>
 import { http } from '@/plugins/http.js';

export default {
  name: "Courses",
  data: () => ({
      courses: [],
      coursesByUser: [],
      alert: false,
      selectedCourse: {
          contenidos:  [],
          nombre:'',
          autor:'',
      },
      dialog: false,
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
          console.log("this is selected course", this.selectedCourse);
          this.dialog = true;
      },
  }
};
</script>
