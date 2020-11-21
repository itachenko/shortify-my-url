<template>
  <div class="main">
    <button @click="displayAbout = !displayAbout" class="about-btn">
      About
    </button>

    <div v-if="displayAbout" class="about">
      <p>Free service to make your URLs short.</p>
      <br />
      <p>Get stats allows you to see how many times short URL has been used.</p>
      <br />
      <p>Limitations:</p>
      <p>- short URL lifetime is {{ limitations.shortUrlTTL }} days.</p>
      <p>
        - you can create only {{ limitations.requestRateLimitCount }} URLs in
        {{ limitations.requestRateLimitHours }} hours.
      </p>
      <br />
      <p>Created by Ivan Tachenko (ivan.tachenko@gmail.com)</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "About",
  data() {
    return {
      displayAbout: false,
      limitations: {
        shortUrlTTL: null,
        requestRateLimitCount: null,
        requestRateLimitHours: null,
      },
    };
  },
  mounted() {
    axios
      .get("/api/config")
      .then(({ data }) => (this.limitations = data))
      .catch((error) => console.log(error));
  },
};
</script>

<style scoped>
.about-btn {
  border: 1px solid;
  border-radius: 5px;
  background-color: transparent;
  font-family: var(--font);
  font-size: 0.8rem;
  padding: 0.2em;
  margin: 0.5em;
}

.about-btn:hover {
  cursor: pointer;
  background: var(--clr-selected);
  transition: all 0.3s ease;
}

.about {
  overflow: hidden;
  font-size: 0.8rem;
  text-align: center;
}
</style>
