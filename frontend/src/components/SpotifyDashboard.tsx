import React, { useState, useEffect } from 'react';
import { searchTracks, SpotifyTrack } from '../services/spotifyService';
import { playlists } from '../services/api';
import { Playlist, Song } from '../types';
import axios from 'axios';
import { 
    Box, TextField, Button, Card, CardContent, CardMedia, Typography, Grid, 
    CircularProgress, InputAdornment, Dialog, DialogTitle, DialogContent, 
    List, ListItem, ListItemText, ListItemAvatar, Avatar, Snackbar, Alert, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useNavigate } from 'react-router-dom';

interface SpotifyDashboardProps {
    token: string;
}

const SpotifyDashboard: React.FC<SpotifyDashboardProps> = ({ token }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const data = await playlists.getAll();
                setUserPlaylists(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to fetch playlists',
                    severity: 'error'
                });
            }
        };
        fetchPlaylists();
    }, []);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setSnackbar({ ...snackbar, open: false });

        try {
            const results = await searchTracks(query, token);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching tracks:', error);
            setSnackbar({
                open: true,
                message: 'Failed to search tracks. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylistClick = (track: SpotifyTrack) => {
        setSelectedTrack(track);
        setOpenDialog(true);
    };

    const handlePlaylistClick = (playlist: Playlist) => {
        navigate(`/playlist/${playlist._id}`);
    };

    const handleDeleteSong = async (songId: string) => {
        if (!selectedPlaylist) return;

        try {
            const updatedPlaylist = await playlists.deleteSong(selectedPlaylist._id, songId);
            setUserPlaylists(currentPlaylists =>
                currentPlaylists.map(p =>
                    p._id === selectedPlaylist._id ? updatedPlaylist : p
                )
            );
            setSelectedPlaylist(updatedPlaylist);
            setSnackbar({
                open: true,
                message: 'Song deleted successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error deleting song:', error);
            setSnackbar({
                open: true,
                message: 'Failed to delete song',
                severity: 'error'
            });
        }
    };

    const handleUpdateSong = async (songId: string, updates: Partial<Song>) => {
        if (!selectedPlaylist) return;

        try {
            const updatedPlaylist = await playlists.updateSong(selectedPlaylist._id, songId, updates);
            setUserPlaylists(currentPlaylists =>
                currentPlaylists.map(p =>
                    p._id === selectedPlaylist._id ? updatedPlaylist : p
                )
            );
            setSelectedPlaylist(updatedPlaylist);
            setSnackbar({
                open: true,
                message: 'Song updated successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error updating song:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update song',
                severity: 'error'
            });
        }
    };

    const handleAddToPlaylist = async (playlist: Playlist) => {
        if (!selectedTrack) return;

        try {
            // Create the song object matching the backend schema
            const newSong = {
                spotifyId: selectedTrack.id,
                title: selectedTrack.name,
                artist: selectedTrack.artists[0].name,
                album: selectedTrack.album.name,
                duration: Math.floor(selectedTrack.duration_ms / 1000), // Convert ms to seconds
                previewUrl: selectedTrack.preview_url || ''
            };

            // Check if song already exists in playlist
            const songExists = playlist.songs?.some(song => song.spotifyId === newSong.spotifyId);
            if (songExists) {
                throw new Error('Song already exists in playlist');
            }

            // Add song to playlist using the API service
            const response = await axios.post(
                `http://localhost:3001/api/playlists/${playlist._id}/songs`,
                { song: newSong },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Update local state with the updated playlist
            setUserPlaylists(currentPlaylists => 
                currentPlaylists.map(p => 
                    p._id === playlist._id ? response.data : p
                )
            );

            setSnackbar({
                open: true,
                message: `Added "${selectedTrack.name}" to playlist "${playlist.name}" successfully!`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding track:', error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to add track to playlist',
                severity: 'error'
            });
        }

        setOpenDialog(false);
        setSelectedTrack(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTrack(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Left side - Search and Results */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, bgcolor: '#282828' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                            Search Songs
                        </Typography>
                        <TextField
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search for songs..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#b3b3b3' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#b3b3b3'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1DB954'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1DB954'
                                    }
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        {loading ? (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress sx={{ color: '#1DB954' }} />
                            </Box>
                        ) : searchQuery && searchResults.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                                <Typography sx={{ color: '#b3b3b3', textAlign: 'center' }}>
                                    No songs found for "{searchQuery}"
                                </Typography>
                            </Box>
                        ) : !searchQuery ? (
                            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                                <Typography sx={{ color: '#b3b3b3', textAlign: 'center' }}>
                                    Start typing to search for songs
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {searchResults.map((track) => (
                                    <ListItem
                                        key={track.id}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 1,
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={track.album.images[0]?.url}
                                                alt={track.name}
                                                variant="rounded"
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography sx={{ color: 'white' }}>{track.name}</Typography>}
                                            secondary={
                                                <Typography sx={{ color: '#b3b3b3' }}>
                                                    {track.artists[0].name} • {track.album.name}
                                                </Typography>
                                            }
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleAddToPlaylistClick(track)}
                                            sx={{
                                                bgcolor: '#1DB954',
                                                '&:hover': {
                                                    bgcolor: '#1ed760'
                                                }
                                            }}
                                        >
                                            Add to Playlist
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Right side - Playlists */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, bgcolor: '#282828' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                            Your Playlists
                        </Typography>
                        {userPlaylists.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                                <Typography sx={{ color: '#b3b3b3', textAlign: 'center' }}>
                                    No playlists found. Create your first playlist to get started!
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {userPlaylists.map((playlist) => (
                                    <ListItem
                                        key={playlist._id}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 1,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                                            },
                                            bgcolor: selectedPlaylist?._id === playlist._id ? 
                                                'rgba(255, 255, 255, 0.1)' : 'transparent'
                                        }}
                                        onClick={() => handlePlaylistClick(playlist)}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ color: 'white' }}>
                                                    {playlist.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography sx={{ color: '#b3b3b3' }}>
                                                    {playlist.songs?.length || 0} songs
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>

                    {/* Selected Playlist Detail */}
                    {selectedPlaylist && (
                        <PlaylistDetail
                            playlist={selectedPlaylist}
                            onDeleteSong={handleDeleteSong}
                            onUpdateSong={handleUpdateSong}
                        />
                    )}
                </Grid>
            </Grid>

            {/* Add to Playlist Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        bgcolor: '#282828',
                        color: 'white',
                        minWidth: '300px'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#1DB954' }}>
                    Select Playlist
                </DialogTitle>
                <DialogContent>
                    {userPlaylists.length === 0 ? (
                        <Typography color="white">
                            No playlists found. Create a playlist first!
                        </Typography>
                    ) : (
                        <List sx={{ pt: 0 }}>
                            {userPlaylists.map((playlist) => (
                                <ListItem 
                                    button 
                                    onClick={() => handleAddToPlaylist(playlist)}
                                    key={playlist._id}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: 'rgba(29, 185, 84, 0.1)',
                                            cursor: 'pointer'
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar 
                                            sx={{ bgcolor: '#1DB954' }}
                                        >
                                            <MusicNoteIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={
                                            <Box>
                                                <Typography color="white">
                                                    {playlist.name}
                                                </Typography>
                                                <Typography variant="body2" color="#b3b3b3">
                                                    {playlist.songs?.length || 0} songs
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            playlist.songs?.length > 0 && (
                                                <Typography variant="body2" color="#b3b3b3" sx={{ mt: 1 }}>
                                                    Latest: {playlist.songs[playlist.songs.length - 1].title}
                                                </Typography>
                                            )
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SpotifyDashboard;
