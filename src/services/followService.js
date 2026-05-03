import API from "../api/api";

export const sendFollowRequest = (userId) =>
  API.post(`/social/follow/send_request/`, { user_id: userId });

export const acceptFollowRequest = (followId) =>
  API.post(`/social/follow/${followId}/accept/`);

export const declineFollowRequest = (followId) =>
  API.post(`/social/follow/${followId}/decline/`);

export const unfollowUser = (userId) =>
  API.post(`/social/follow/unfollow/`, { user_id: userId });

export const getPendingRequests = () =>
  API.get(`/social/follow/pending_requests/`);

export const getSentRequests = () =>
  API.get(`/social/follow/sent_requests/`);

export const getFollowers = (userId = null) => {
  const url = userId 
    ? `/social/follow/followers/?user_id=${userId}`
    : `/social/follow/followers/`;
  return API.get(url);
};

export const getFollowing = (userId = null) => {
  const url = userId 
    ? `/social/follow/following/?user_id=${userId}`
    : `/social/follow/following/`;
  return API.get(url);
};

export const getFollowStats = (userId = null) => {
  const url = userId 
    ? `/social/follow/stats/?user_id=${userId}`
    : `/social/follow/stats/`;
  return API.get(url);
};

export const getFollowRelationship = (followId) =>
  API.get(`/social/follow/${followId}/`);

export const getAllFollows = () =>
  API.get(`/social/follow/`);

export const cancelFollowRequest = (userId) =>
  API.post(`/social/follow/cancel_request/`, { user_id: userId });