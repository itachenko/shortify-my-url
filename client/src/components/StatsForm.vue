<template>
  <div class="main">
    <div class="stats-form" id="stats-form">
      <input
        v-model="shortUrl"
        class="stats-form-input"
        type="text"
        placeholder="Short URL"
        autocomplete="off"
      />
      <button v-on:click="onSubmit" class="stats-form-btn">Get stats</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "StatsForm",
  data() {
    return {
      shortUrl: null,
    };
  },
  methods: {
    ...mapActions(["getStats"]),
    ...mapMutations(["resetState"]),
    onSubmit() {
      this.resetState();
      this.getStats(this.shortUrl);
      this.shortUrl = null;
    },
  },
};
</script>

<style scoped>
.stats-form-input {
  background-color: transparent;
  border: none;
  text-align: center;
  border-bottom: 2px solid;
  transition: border-bottom-color 0.3s ease-in-out;
  font-family: var(--font);
}

.stats-form-input:focus {
  outline: none;
  border-bottom-color: #56bc58;
}

.stats-form-btn {
  border: 1px solid;
  border-radius: 5px;
  background-color: transparent;
  font-family: var(--font);
  font-size: 0.8rem;
  padding: 0.2em;
  margin: 0.5em;
}

.stats-form-btn:hover {
  cursor: pointer;
  background: var(--clr-selected);
  transition: all 0.3s ease;
}
</style>
