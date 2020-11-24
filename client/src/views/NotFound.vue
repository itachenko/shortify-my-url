<template>
  <div class="main">
    <Header />
    <div>
      <h1>Ooooops...</h1>
      <h2>Unfortunately we don't know what's hiding behind this short URL</h2>
    </div>
    <About />
  </div>
</template>

<script>
import About from "../components/About.vue";
import Header from "../components/Header.vue";

export default {
  name: "NotFound",
  components: {
    Header,
    About,
  },
};
</script>
