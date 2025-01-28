import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Paper,
  Avatar,
  ListItemAvatar,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, PlayArrow as PlayIcon } from '@mui/icons-material';
import { spotify, playlists } from '../services/api';
import { Song } from '../types';

interface SongSearchProps {
  playlistId: string;
  onSongAdded: () => void;
}

export const SongSearch = ({ playlistId, onSongAdded }: SongSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const data = await spotify.searchSongs(searchQuery);
      setSearchResults(data.tracks);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error searching songs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSong = async (song: Song) => {
    try {
      await spotify.addToPlaylist(playlistId, song.uri);
      await playlists.addSong(playlistId, song);
      onSongAdded();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding song to playlist');
    }
  };

  const handlePreviewPlay = (previewUrl: string | undefined) => {
    if (!previewUrl) return;
    
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.remove();
    }

    const audio = new Audio(previewUrl);
    audio.play();
    setPreviewAudio(audio);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search for songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
        />
        <IconButton type="submit" color="primary" disabled={isLoading}>
          <SearchIcon />
        </IconButton>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {searchResults.length > 0 && (
        <Paper sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
          <List>
            {searchResults.map((song) => (
              <ListItem key={song.spotifyId}>
                <ListItemAvatar>
                  <Avatar src={song.albumArt} alt={song.album} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary={song.name}
                  secondary={
                    <>
                      {song.artists.map(artist => artist.name).join(', ')}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {song.album}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                  {song.previewUrl && (
                    <Tooltip title="Play Preview">
                      <IconButton edge="end" onClick={() => handlePreviewPlay(song.previewUrl)}>
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Add to Playlist">
                    <IconButton edge="end" onClick={() => handleAddSong(song)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
