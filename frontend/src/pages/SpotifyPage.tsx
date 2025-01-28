import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import SpotifyDashboard from '../components/SpotifyDashboard';
import { getAuthUrl } from '../services/spotifyService';

const SpotifyPage: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'grant_type=client_credentials&client_id=4c1266fd7ad84a8282362bd8b471c630&client_secret=8dc7397be88545e38875d9c6b7b882dc'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch token');
                }
                
                const data = await response.json();
                setToken(data.access_token);
            } catch (err) {
                setError('Failed to authenticate with Spotify');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchToken();
    }, []);

    const handleSpotifyLogin = async () => {
        try {
            setIsLoading(true);
            setError('');
            const authUrl = await getAuthUrl();
            window.location.href = authUrl;
        } catch (error: any) {
            console.error('Error getting auth URL:', error);
            setError(error.message || 'Failed to start Spotify authentication');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    bgcolor: '#1DB954',
                    color: 'white'
                }}
            >
                <CircularProgress sx={{ color: 'white' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Connecting to Spotify...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: '#282828',
                color: 'white'
            }}>
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 3,
                        width: '100%',
                        maxWidth: '500px'
                    }}
                >
                    {error}
                </Alert>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        onClick={() => setError('')}
                        sx={{ 
                            bgcolor: '#1DB954',
                            '&:hover': {
                                bgcolor: '#1ed760'
                            }
                        }}
                    >
                        Try Again
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/')}
                        sx={{ 
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                                borderColor: '#1DB954',
                                color: '#1DB954'
                            }
                        }}
                    >
                        Go Home
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            bgcolor: '#282828',
            minHeight: '100vh'
        }}>
            <SpotifyDashboard token={token} />
        </Box>
    );
};

export default SpotifyPage;
