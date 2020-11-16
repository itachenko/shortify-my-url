require("regenerator-runtime");
const axios = require("axios");
const Vue = require("vue/dist/vue");

var app = new Vue({
  el: "#app",
  data: {
    errorMessage: null,
    result: null,
    longUrl: null,
    shortUrl: null,
    stats: null,
    displayAbout: false,
    limitations: {
      shortUrlTTL: null,
      requestRateLimitCount: null,
      requestRateLimitHours: null,
    },
  },
  methods: {
    async submitForm() {
      this.resetData();

      const locallyStoredUrl = localStorage.getItem(this.longUrl);

      if (locallyStoredUrl) {
        this.result = locallyStoredUrl;
        this.longUrl = null;
      } else {
        try {
          const response = await axios.post("/api/url", {
            url: this.longUrl,
          });
          localStorage.setItem(this.longUrl, response.data.shortUrl);
          this.result = response.data.shortUrl;
          this.longUrl = null;
        } catch (error) {
          this.errorMessage = error.response.data.error;
          this.longUrl = null;
        }
      }
    },
    submitStatsForm() {
      this.resetData();

      axios
        .post("/api/stats", {
          url: this.shortUrl,
        })
        .then((response) => (this.stats = response.data))
        .catch((error) => (this.errorMessage = error.response.data.error));
      this.shortUrl = null;
    },
    resetData() {
      this.errorMessage = null;
      this.result = null;
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
    axios.get("/api/config").then(({ data }) => (this.limitations = data));
  },
});
