<template>
  <div class="email-application">
    <div class="form-group">
      <label for="from">From:</label>
      <input type="text" id="from" v-model="from"/>
    </div>

    <div class="form-group">
      <label for="to">To:</label>
      <input type="text" id="to" v-model="to" readonly />
    </div>

    <div class="form-group">
      <label for="subject">Subject:</label>
      <input type="text" id="subject" v-model="subject" />
    </div>

    <div class="form-group">
      <label for="body">Body:</label>
      <textarea id="body" v-model="body"></textarea>
    </div>

    <button @click="sendEmail">Send</button>
  </div>
</template>

<script>
export default {
  name: 'Email',
  data() {
    return {
      from: '',
      to: 'avhishe.adhikary11@gmail.com',
      subject: '',
      body: ''
    };
  },
  methods: {
    sendEmail() {
      const mailtoLink = `mailto:${this.to}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
      window.location.href = mailtoLink;
    }
  }
};
</script>

<style scoped>
.email-application {
  max-width: 3840px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #000;
  height: 100%;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

</style>
