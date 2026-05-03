import api from "./api";


export const getUserRating = (movieId) =>
  api.get(`/ratings/${movieId}/`);


export const getMyRatings = () =>
  api.get("/ratings/my/");


export const rateMovie = (movieId, rating) =>
  api.post(`/ratings/rate/`, { movie_id: movieId, rating });


export const getRatingStats = (movieId) =>
  api.get(`/ratings/stats/${movieId}/`);


export const unrateMovie = (movieId) => {
  return api.delete("/ratings/rate/", {
    data: { movie_id: movieId },
  });
};