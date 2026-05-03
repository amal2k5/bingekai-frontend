import api from "../api/api";

/* =========================
   USER (PRIVATE LISTS)
========================= */

// get logged-in user's lists
export const getUserLists = () =>
  api.get("/lists/my/");

// create new list
export const createList = (data) =>
  api.post("/lists/create/", data);

// delete list
export const deleteList = (id) =>
  api.delete(`/lists/delete/${id}/`);

// get PRIVATE list detail (owner only)
export const getListDetail = async (listId) => {
  const response = await api.get(`/lists/public/${listId}/`);
  return response.data;
};


/* =========================
   PUBLIC LISTS
========================= */

// get PUBLIC list detail (for others)
export const getPublicList = (listId) =>
  api.get(`/lists/public/${listId}/`);


/* =========================
   MOVIE ACTIONS
========================= */

// add movie to list
export const addMovieToList = (data) =>
  api.post("/lists/add-movie/", data);

// remove movie from list
export const removeMovieFromList = (listId, movieId) =>
  api.delete(`/lists/collections/${listId}/remove/${movieId}/`);