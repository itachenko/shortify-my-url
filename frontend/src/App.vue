<template>
  <div id="app">
    <Header />
    <ShortUrlForm />
    <Results />
    <StatsForm />
    <About />
  </div>
</template>

<script>
import ShortUrlForm from "./components/ShortUrlForm.vue";
import StatsForm from "./components/StatsForm.vue";
import About from "./components/About.vue";
import Header from "./components/Header.vue";
import Results from "./components/Results.vue";

export default {
  name: "App",
  components: {
    ShortUrlForm,
    Results,
    StatsForm,
    Header,
    About,
  },
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

:root {
  --clr-background: #fafafa;
  --clr-dark: #0c0e36;
  --clr-light: #fff;
  --clr-error: #f70058;
  --clr-selected: #e9eee6;
  --font: "Work Sans", sans-serif;
}

body {
  background-color: var(--clr-background);
  font-family: var(--font);
  font-size: 1.125rem;
  color: var(--clr-dark);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main {
  text-align: center;
  padding: 1em;
  margin-left: auto;
  margin-right: auto;
}
</style>
