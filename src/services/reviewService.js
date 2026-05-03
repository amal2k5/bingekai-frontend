import api from "../api/api"; 


export const getReviews = (movieId, sort = 'top') =>
  api.get(`/reviews/movie/${movieId}/`, {
    params: { sort }});

export const createReview = (data, token) =>
  api.post("/reviews/create/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateReview = (id, data, token) =>
  api.patch(`/reviews/update/${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteReview = (id, token) =>
  api.delete(`/reviews/delete/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },

  });

export const toggleLike = (reviewId, token) =>
  api.post(`/reviews/${reviewId}/like/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });