<template>
  <div v-if="resultMessage || errorMessage || stats.url" class="main">
    <div v-if="resultMessage">
      <span>Your short url is: </span>
      <span class="result-message">{{ resultMessage }}</span>
      <button v-on:click="copyToClipboard" class="result-message-btn">
        Copy
      </button>
    </div>
    <div v-if="stats.url">
      <p>Short URL: {{ stats.url }}</p>
      <p>Clicks: {{ stats.clicksCount }}</p>
    </div>
    <div v-if="errorMessage">
      <span class="error-message">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Results",
  computed: mapState(["errorMessage", "resultMessage", "stats"]),
  methods: {
    copyToClipboard() {
      const fieldEl = document.querySelector(".result-message");

      var textArea = document.createElement("textarea");
      textArea.value = fieldEl.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      textArea.remove();
    },
  },
};
</script>

<style scoped>
.error-message {
  font-weight: 900;
  color: var(--clr-error);
  display: table;
  margin-left: auto;
  margin-right: auto;
}

.result-message {
  background: var(--clr-selected);
}

.result-message-btn {
  font-family: var(--font);
  font-weight: 400;
  background-color: transparent;
  border: none;
  margin-left: 1rem;
  padding: 0.5px;
  text-align: top right;
  border: 1px solid;
  border-radius: 5px;
}

.result-message-btn:hover {
  cursor: pointer;
  background: var(--clr-selected);
  transition: all 0.3s ease;
}
</style>
