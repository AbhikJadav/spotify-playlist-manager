import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MusicNote as MusicNoteIcon
} from '@mui/icons-material';
import { Playlist } from '../types';
import { playlists } from '../services/api';
import { PlaylistDetail } from '../components/PlaylistDetail';
import { CustomButton } from '../components/common/CustomButton';
import { CustomTextField } from '../components/common/CustomTextField';
import { CustomDialog } from '../components/common/CustomDialog';
import { CustomSnackbar } from '../components/common/CustomSnackbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PageContainer } from '../components/common/PageContainer';

const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPlaylist, setEditingPlaylist] = useState(false);
  const [editedPlaylistName, setEditedPlaylistName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    const fetchPlaylist = async () => {
      if (!id) return;
      try {
        const data = await playlists.getById(id);
        setPlaylist(data);
        setEditedPlaylistName(data.name);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch playlist details',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  const handleEditPlaylist = () => {
    setEditingPlaylist(true);
  };

  const handleSavePlaylist = async () => {
    if (!playlist) return;

    try {
      const updatedPlaylist = await playlists.update(playlist._id, {
        name: editedPlaylistName
      });
      setPlaylist(updatedPlaylist);
      setSnackbar({
        open: true,
        message: 'Playlist updated successfully!',
        severity: 'success'
      });
      setEditingPlaylist(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update playlist',
        severity: 'error'
      });
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;

    try {
      await playlists.delete(playlist._id);
      setSnackbar({
        open: true,
        message: 'Playlist deleted successfully!',
        severity: 'success'
      });
      navigate('/');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete playlist',
        severity: 'error'
      });
    }
  };

  const handleUpdateSong = async (songId: string, updates: any) => {
    if (!playlist) return;

    try {
      const updatedPlaylist = await playlists.updateSong(playlist._id, songId, updates);
      setPlaylist(updatedPlaylist);
      return updatedPlaylist;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!playlist) return;

    try {
      const updatedPlaylist = await playlists.deleteSong(playlist._id, songId);
      setPlaylist(updatedPlaylist);
      return updatedPlaylist;
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!playlist) {
    return (
      <PageContainer>
        <Typography color="error">Playlist not found</Typography>
        <CustomButton
          variant="secondary"
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </CustomButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <CustomButton
            variant="text"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Dashboard
          </CustomButton>
        </Grid>
        <Grid item xs>
          {editingPlaylist ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CustomTextField
                value={editedPlaylistName}
                onChange={(e) => setEditedPlaylistName(e.target.value)}
                placeholder="Playlist name"
              />
              <CustomButton
                variant="primary"
                onClick={handleSavePlaylist}
              >
                Save
              </CustomButton>
              <CustomButton
                variant="text"
                onClick={() => setEditingPlaylist(false)}
              >
                Cancel
              </CustomButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {playlist.name}
              </Typography>
              <IconButton
                onClick={handleEditPlaylist}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => setShowDeleteConfirm(true)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Grid>
      </Grid>

      <PlaylistDetail
        playlist={playlist}
        onDeleteSong={handleDeleteSong}
        onUpdateSong={handleUpdateSong}
      />

      <CustomDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Playlist"
        onConfirm={handleDeletePlaylist}
        confirmText="Delete"
      >
        <Typography>
          Are you sure you want to delete this playlist? This action cannot be undone.
        </Typography>
      </CustomDialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </PageContainer>
  );
};

export default PlaylistDetailPage;
