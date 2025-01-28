import axios from 'axios';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const API_BASE_URL = 'http://localhost:3001/api';

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    uri: string;
}

export interface SpotifyProfile {
    id: string;
    display_name: string;
    email: string;
    images: { url: string }[];
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    images: { url: string }[];
    tracks: {
        total: number;
    };
}

export const getAuthUrl = async (): Promise<string> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/spotify/auth-url`);
        if (!response.data.url) {
            throw new Error('No authorization URL received from server');
        }
        return response.data.url;
    } catch (error: any) {
        console.error('Error getting Spotify auth URL:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to get Spotify authorization URL');
    }
};

export const getSpotifyToken = async (code: string): Promise<{ access_token: string }> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/spotify/token`, { code });
        if (!response.data.access_token) {
            throw new Error('No access token received from server');
        }
        return response.data;
    } catch (error: any) {
        console.error('Error getting Spotify token:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to get Spotify access token');
    }
};

export const getUserProfile = async (token: string): Promise<SpotifyProfile> => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error getting user profile:', error.response?.data || error.message);
        throw new Error('Failed to get Spotify user profile');
    }
};

export const getUserPlaylists = async (token: string): Promise<SpotifyPlaylist[]> => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/me/playlists`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.items;
    } catch (error: any) {
        console.error('Error getting user playlists:', error.response?.data || error.message);
        throw new Error('Failed to get Spotify playlists');
    }
};

export const searchTracks = async (query: string, token: string): Promise<SpotifyTrack[]> => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/search`, {
            params: {
                q: query,
                type: 'track',
                limit: 20
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.tracks.items;
    } catch (error: any) {
        console.error('Error searching tracks:', error.response?.data || error.message);
        throw new Error('Failed to search Spotify tracks');
    }
};

export const addTrackToPlaylist = async (playlistId: string, trackUri: string, token: string): Promise<void> => {
    try {
        await axios.post(
            `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`,
            {
                uris: [trackUri]
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error: any) {
        console.error('Error adding track to playlist:', error.response?.data || error.message);
        throw new Error('Failed to add track to Spotify playlist');
    }
};
