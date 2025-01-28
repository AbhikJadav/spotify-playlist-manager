import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { playlists } from '../services/api';
import { Playlist } from '../types';

export const Playlists = () => {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', isPublic: false });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlaylists();
  }, []);

  
  const fetchPlaylists = async () => {
    try {
      const data = await playlists.getAll();
      setUserPlaylists(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching playlists');
    }
  };

  const handleCreate = async () => {
    try {
      await playlists.create(formData.name, formData.description, formData.isPublic);
      setOpenCreate(false);
      setFormData({ name: '', description: '', isPublic: false });
      fetchPlaylists();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating playlist');
    }
  };

  const handleEdit = async () => {
    if (!selectedPlaylist) return;
    try {
      await playlists.update(selectedPlaylist._id, formData);
      setOpenEdit(false);
      setSelectedPlaylist(null);
      setFormData({ name: '', description: '', isPublic: false });
      fetchPlaylists();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating playlist');
    }
  };

  const handleDelete = async (playlistId: string) => {
    try {
      await playlists.delete(playlistId);
      fetchPlaylists();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting playlist');
    }
  };

  return (
    <Box>
      {
        userPlaylists.length !== 0 &&
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Playlists</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Create Playlist
          </Button>
        </Box>
      }
      

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {userPlaylists.length === 0 ? (
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
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Playlists Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Create your first playlist to start organizing your music!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{ mt: 2 }}
          >
            Create Playlist
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {userPlaylists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{playlist.name}</Typography>
                  <Typography color="textSecondary">{playlist.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {playlist.songs.length} songs
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setFormData({
                          name: playlist.name,
                          description: playlist.description,
                          isPublic: playlist.isPublic,
                        });
                        setOpenEdit(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(playlist._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Playlist Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Playlist Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
