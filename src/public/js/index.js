var app = new Vue({
  el: "#app",
  data: {
    error: null,
    info: null,
    urlForm: {
      longUrl: null,
      shortUrl: null,
    },
    stats: null,
    displayAbout: false,
    limitations: {
      shortUrlTTL: null,
      requestRateLimitCount: null,
      requestRateLimitHours: null,
    },
  },
  methods: {
    submitForm() {
      this.resetData();
      axios
        .post("/api/url", {
          url: this.urlForm.longUrl,
        })
        .then((response) => (this.info = response.data.shortUrl))
        .catch((error) => (this.error = error.response.data.error));
    },
    submitStatsForm() {
      this.resetData();
      axios
        .post("/api/stats", {
          url: this.urlForm.shortUrl,
        })
        .then((response) => (this.stats = response.data))
        .catch((error) => (this.error = error.response.data.error));
    },
    resetData() {
      this.error = null;
      this.info = null;
      this.stats = null;
    },
    copyToClipboard() {
      const fieldEl = document.getElementById("main-result");

      var textArea = document.createElement("textarea");
      textArea.value = fieldEl.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      textArea.remove();
    },
  },
  mounted() {
    axios
      .get("/api/config")
      .then(({ data }) => (this.limitations = data))
  },
});
