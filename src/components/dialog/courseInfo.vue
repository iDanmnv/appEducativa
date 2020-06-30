<template>
      <v-card>
        <v-img
          src="https://i1.wp.com/formaciononline.eu/wp-content/uploads/2019/01/cursos-online-gratuitos.png?resize=710%2C373&ssl=1"
          aspect-ratio="2.75"
        ></v-img>

        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{course.nombre}}</h3>
            <div>Autor:<br>{{course.autor}}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="orange" @click.native="closeClick">Close</v-btn>
        </v-card-actions>
      </v-card>
</template>

<script>
export default { 
  data: () => ({
      course: {},
  }),

  mounted () {
    console.log('desde componente ',this.course)
  },
  methods: {
    closeClick () {
      this.$emit('submit', 'test')
    }
  }
}
</script>
