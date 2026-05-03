import api from "../api/api";



const BASE = "/watchlists/collections";


export const getUserWatchlists = () => {
  return api.get(`${BASE}/`);
};

export const createWatchlist = (data) => {
  return api.post(`${BASE}/create/`, data);
};

export const getCollectionDetail = (collectionId) => {
  return api.get(`${BASE}/${collectionId}/`);
};

export const addToWatchlist = (data) => {
  return api.post(`${BASE}/add/`, data);
};

export const removeFromWatchlist = ({ list_id, movie_id }) => {
  return api.delete(`${BASE}/${list_id}/remove/${movie_id}/`);
};

export const deleteWatchlist = (collectionId) => {
  return api.delete(`${BASE}/${collectionId}/delete/`);
};

export const toggleWatched = (itemId) => {
  return api.patch(`/watchlists/collection-items/${itemId}/toggle/`);
};

export const getCollectionItemDetail = (itemId) => {
  return api.get(`/watchlists/collection-items/${itemId}/`);
};

export const deleteCollectionItem = (itemId) => {
  return api.delete(`/watchlists/collection-items/${itemId}/`);
};