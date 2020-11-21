<template>
  <div class="main">
    <div class="short-form">
      <input
        v-model="longUrl"
        class="short-form-input"
        type="text"
        placeholder="Put your long URL here"
        autocomplete="off"
      />
      <button v-on:click="onSubmit" class="short-form-btn">
        Make it short!
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "ShortUrlForm",
  data() {
    return {
      longUrl: null,
    };
  },
  computed: {
    ...mapState(["resultMessage"]),
  },
  methods: {
    ...mapMutations(["setResultMessage", "resetState"]),
    ...mapActions(["makeShortUrl", "validateInputUrl"]),
    async onSubmit() {
      this.resetState();
      if (!(await this.validateInputUrl(this.longUrl))) return;

      const locallyStoredUrl = this.getFromLocalStorage(this.longUrl);

      if (locallyStoredUrl) {
        this.setResultMessage(locallyStoredUrl);
      } else {
        await this.makeShortUrl(this.longUrl);
        if (this.resultMessage) {
          this.saveToLocalStorage(this.longUrl, this.resultMessage);
        }
      }

      this.longUrl = null;
    },
    getFromLocalStorage(key) {
      return localStorage.getItem(key);
    },
    saveToLocalStorage(key, value) {
      localStorage.setItem(key, value);
    },
  },
};
</script>

<style scoped>
.short-form {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.short-form-input,
.short-form-btn {
  margin: 1rem 0;
  max-width: 100%;
}

.short-form-input {
  background-color: transparent;
  border: none;
  text-align: center;
  border-bottom: 2px solid;
  transition: border-bottom-color 0.3s ease-in-out;
  font-family: var(--font);
}

.short-form-input:focus {
  outline: none;
  border-bottom-color: #56bc58;
}

.short-form-btn {
  border: 1px solid;
  border-radius: 5px;
  background-color: transparent;
  font-family: var(--font);
  font-size: 1rem;
  padding: 0.75em 1.25rem;
}

.short-form-btn:hover {
  cursor: pointer;
  background: var(--clr-selected);
  transition: all 0.3s ease;
}
</style>
