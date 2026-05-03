import api from "../api/api";


export const getUserActivity = async (page = 1, limit = 20) => {
  const response = await api.get("/reviews/user/activity/", {
    params: { page, limit }
  });
  return response.data;
};

export const getActivityFeed = (page = 1, limit = 20) => 
  api.get("/activity/feed/", {
    params: { page, limit }
  });

  
export const getTrendingReviews = () =>
  api.get("/reviews/trending/");