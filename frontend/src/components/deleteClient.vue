<script>
import axios from 'axios'

export default {
  data() {
    return {
      queryData: [],
      // Parameter for search to occur
      searchBy: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    }
  },
  mounted() {
    const apiURL = import.meta.env.VITE_ROOT_API + '/clients/'
    axios.get(apiURL).then((res) => {
      this.queryData = res.data
    })
    window.scrollTo(0, 0)
  },
  methods: {
    chosenClient(selectedClient) {
      this.client.firstName = selectedClient
    },
    deleteClient(id){
      const apiURL = import.meta.env.VITE_ROOT_API + '/clients/deleteClient/' + client._id;
      let indexOfArrayItem = this.clients.findIndex((i) => i._id === id);

      if (window.confirm('Do you really want to delete?')) {
        axios.delete(apiURL).then(() => {
            this.clients.splice(indexOfArrayItem, 1);
          }).catch((error) => {
            console.log(error)
          });
      }
    }
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <!-- Update Student content -->
    </div>
  </div>
</template>
