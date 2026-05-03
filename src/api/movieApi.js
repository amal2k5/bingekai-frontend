import api from "./api";

const API = "https://bingekai.duckdns.org/api/movies";

export const getTrendingMovies = async () => {
  const res = await api.get(`${API}/trending/`);
  return res.data;
};

export const searchMovies = async (query) => {
  const res = await api.get(`${API}/search/?q=${query}`);
  return res.data;
};

export const getMovieDetails = async (id) => {
  const res = await api.get(`${API}/${id}/`);
  return res.data;
};