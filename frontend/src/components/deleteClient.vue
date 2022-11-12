<script>
import useVuelidate from '@vuelidate/core'
import axios from 'axios'

export default {
  props: ['id'],
  setup() {
    return { v$:useVuelidate({ $autoDirty: true }) }
  },  
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
    window.scrollTo(0, 0)
  },
  beforeMount() { 
    axios
      .get (
        import.meta.env.VITE_ROOT_API + '/clients/id/${this.$route.params.id}'
    )
  },
  methods: {
    ChangeT(selectedClient) {
      this.client.selectedClient = selectedClient
    },
    deleteClient(id) {
      const apiURL = 
        import.meta.env.VITE_ROOT_API + '/clients/deleteClient/' + client._id;
      let indexOfArrayItem = this.clients.findIndex((i) => i._id === id);

      if (window.confirm('Do you really want to delete?')) {
        axios
          .delete(apiURL)
          .then(() => {
            this.clients.splice(indexOfArrayItem, 1)
          })
          this.$router.back().catch((error) => {
            console.log(error)
          });
      }
    }
  }
}
</script>
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Delete Client
      </h1>
    </div>
    <div class="px-10 pt-20">
      <!--Want to stop from reloading page after deleting-->
      <form @submit.prevent="handleSubmitForm">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
      >
        <h2 class="text-2xl font-bold">Delete Client By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="deleteBy"
          >
            <option value="Client Name">Client Name</option>
            <option value="Client Number">Client Number</option>
          </select>
        </div>
        <div class="flex flex-col" v-if="deleteBy === 'Client Name'">
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="firstName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter first name"
            />
          </label>
        </div>
        <div class="flex flex-col" v-if="deleteBy === 'Client Name'">
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="lastName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter last name"
            />
          </label>
        </div>
        <!-- Displays Client Number search field -->
        <div class="flex flex-col" v-if="deleteBy === 'Client Number'">
          <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            v-model="phoneNumber"
            v-on:keyup.enter="handleSubmitForm"
            placeholder="Enter Client Phone Number"
          />
        </div>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
      >
        <div></div>
        <div></div>
        <div class="flex justify-between mt-10 mr-20">
          <button
            @click="deleteClient"
            type="submit"
            class="bg-red-700 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
      </form>
    </div>
  </main>
</template>