import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MusicNote as MusicNoteIcon
} from '@mui/icons-material';
import { Playlist, Song } from '../types';
import { CustomTextField } from './common/CustomTextField';
import { CustomButton } from './common/CustomButton';
import { CustomDialog } from './common/CustomDialog';
import { CustomSnackbar } from './common/CustomSnackbar';

interface PlaylistDetailProps {
  playlist: Playlist;
  onDeleteSong: (songId: string) => Promise<void>;
  onUpdateSong: (songId: string, updatedSong: Partial<Song>) => Promise<void>;
}

export const PlaylistDetail = ({
  playlist,
  onDeleteSong,
  onUpdateSong
}: PlaylistDetailProps) => {
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedArtist, setEditedArtist] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleEditClick = (song: Song) => {
    setEditingSong(song);
    setEditedTitle(song.title);
    setEditedArtist(song.artist);
  };

  const handleCloseEdit = () => {
    setEditingSong(null);
    setEditedTitle('');
    setEditedArtist('');
  };

  const handleSaveEdit = async () => {
    if (!editingSong) return;

    try {
      await onUpdateSong(editingSong.spotifyId, {
        title: editedTitle,
        artist: editedArtist
      });
      setSnackbar({
        open: true,
        message: 'Song updated successfully!',
        severity: 'success'
      });
      handleCloseEdit();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update song',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (songId: string) => {
    try {
      await onDeleteSong(songId);
      setSnackbar({
        open: true,
        message: 'Song deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete song',
        severity: 'error'
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <MusicNoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              {playlist.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              {playlist.songs.length} songs
            </Typography>
          </Grid>
        </Grid>

        {playlist.songs.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '200px',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              p: 4,
              textAlign: 'center'
            }}
          >
            <MusicNoteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary' }} gutterBottom>
              No Songs in This Playlist
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Search for songs and add them to your playlist to get started!
            </Typography>
          </Box>
        ) : (
          <List>
            {playlist.songs.map((song: Song, index: number) => (
              <ListItem
                key={song.spotifyId}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Typography sx={{ color: 'text.secondary', mr: 2, width: 30 }}>
                  {index + 1}
                </Typography>
                <ListItemText
                  primary={
                    <Typography sx={{ color: 'text.primary' }}>
                      {song.title}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: 'text.secondary' }}>
                      {song.artist} • {song.album} • {formatDuration(song.duration)}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEditClick(song)}
                    sx={{ color: 'primary.main', mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(song.spotifyId)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <CustomDialog
        open={!!editingSong}
        onClose={handleCloseEdit}
        title="Edit Song"
        onConfirm={handleSaveEdit}
        confirmText="Save"
      >
        <Box sx={{ pt: 2 }}>
          <CustomTextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <CustomTextField
            margin="dense"
            label="Artist"
            fullWidth
            value={editedArtist}
            onChange={(e) => setEditedArtist(e.target.value)}
          />
        </Box>
      </CustomDialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};
