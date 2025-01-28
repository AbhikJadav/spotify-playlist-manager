import axios from 'axios';
import { Playlist } from '../types';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const playlists = {
  getAll: async () => {
    try {
      const response = await api.get('/playlists');
      return response.data;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await api.get(`/playlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  },
  
  create: async (name: string, description: string, isPublic: boolean) => {
    try {
      const response = await api.post('/playlists', { name, description, isPublic });
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  },
  
  update: async (playlistId: string, updatedPlaylist: Partial<Playlist>) => {
    try {
      const response = await api.put(`/playlists/${playlistId}`, updatedPlaylist);
      return response.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  },
  
  delete: async (playlistId: string) => {
    try {
      await api.delete(`/playlists/${playlistId}`);
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  },

  addSong: async (playlistId: string, song: any) => {
    try {
      const response = await api.post(`/playlists/${playlistId}/songs`, { song });
      return response.data;
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      throw error;
    }
  },

  updateSong: async (playlistId: string, songId: string, updates: Partial<any>) => {
    try {
      const response = await api.put(`/playlists/${playlistId}/songs/${songId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating song:', error);
      throw error;
    }
  },

  deleteSong: async (playlistId: string, songId: string) => {
    try {
      const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  }
};

export const spotify = {
  searchSongs: async (query: string) => {
    const response = await api.get(`/spotify/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
  addToPlaylist: async (playlistId: string, trackUri: string) => {
    const response = await api.post(`/spotify/playlists/${playlistId}/tracks`, { uri: trackUri });
    return response.data;
  },
  getRecommendations: async (seedTracks: string[]) => {
    const response = await api.get(`/spotify/recommendations`, {
      params: { seed_tracks: seedTracks.join(',') }
    });
    return response.data;
  }
};
