import api from "../api/api";


export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    console.log("📤 Uploading file:", file.name);
    

    const response = await api.patch('/auth/profile/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    console.log("📥 Backend response:", response);
    console.log("📥 Response data:", response.data);

    const normalizedData = {
        ...response.data,
        avatar_url: response.data.avatar_url || response.data.avatar
    };
    
    return normalizedData;
};


export const getProfile = async () => {
    const response = await api.get('/auth/profile/');
    

    const normalizedData = {
        ...response.data,
        avatar_url: response.data.avatar_url || response.data.avatar
    };
    
    return normalizedData;
};


export const searchUsers = async (query) => {
    const response = await api.get(`/social/search/?q=${query}`);
    return response.data;
};


export const getSuggestedUsers = async () => {
    const response = await api.get('/social/suggestions/');
    return response.data;
};