<script>
import axios from 'axios'
import AttendanceChart from './barChart.vue'

export default {
  components: {
    AttendanceChart
  },
  data() {
    return {
      labels: [],
      enrolled: [],
      loading: false,
      error: null
    }
  },
  methods: {
    async fetchData() {
      try {
        this.error = null
        this.loading = true
        const response = await axios.get(
          import.meta.env.VITE_ROOT_API + `/events/attendance`
        )
        //"re-organizing" - mapping json from the response
        this.labels = response.data.map((item) => item.name)
        this.enrolled = response.data.map((item) => item.attendees)
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: 'Server Response',
            message: err.message
          }
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: 'Unable to Reach Server',
            message: err.message
          }
        } else {
          // There's probably an error in your code
          this.error = {
            title: 'Application Error',
            message: err.message
          }
        }
      }
      this.loading = false
    },
    routePush(routeName) {
      this.$router.push({ name: routeName })
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<template>
  <div>
    <h1
      class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
    >
      Welcome
    </h1>
  </div>
  <section class="container">
    <div class="columns">
      <div class="column">
        <div>
          <AttendanceChart
            v-if="!loading && !error"
            :label="labels"
            :chart-data="enrolled"
          ></AttendanceChart>

          <!-- Start of loading animation -->
          <div class="mt-40" v-if="loading">
            <p
              class="text-6xl font-bold text-center text-gray-500 animate-pulse"
            >
              Loading...
            </p>
          </div>
          <!-- End of loading animation -->

          <!-- Start of error alert -->
          <div class="mt-12 bg-red-50" v-if="error">
            <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
              {{ error.title }}
            </h3>
            <p class="p-4 text-lg font-bold text-red-900">
              {{ error.message }}
            </p>
          </div>
          <!-- End of error alert -->
          <br />
          <br />
        </div>
      </div>
    </div>
  </section>
</template>
