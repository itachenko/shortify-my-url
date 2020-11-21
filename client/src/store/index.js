import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const initState = () => ({
  errorMessage: null,
  resultMessage: null,
  stats: {
    url: null,
    clicksCount: null,
  },
});

const state = initState;

const mutations = {
  setErrorMessage: (state, message) => (state.errorMessage = message),
  setResultMessage: (state, message) => (state.resultMessage = message),
  setStats: (state, data) => (state.stats = data),
  resetState: (state) => Object.assign(state, initState()),
};

const actions = {
  async getStats({ commit }, shortUrl) {
    try {
      const { data } = await axios.post("/api/stats", {
        url: shortUrl,
      });
      commit("setStats", data);
    } catch (error) {
      commit("setErrorMessage", error.response.data.error);
    }
  },
  async makeShortUrl({ commit }, longUrl) {
    try {
      const { data } = await axios.post("/api/url", {
        url: longUrl,
      });

      commit("setResultMessage", data.shortUrl);
    } catch (error) {
      commit("setErrorMessage", error.response.data.error);
    }
  },
   validateInputUrl({ commit }, url) {
    if (!url) {
      commit("setErrorMessage", "URL should not be empty");
      return false;
    }

    return true;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
});
