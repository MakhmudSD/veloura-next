import React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';

const ContactListPanel = ({ contacts = [], loading }: { contacts: any[]; loading: boolean }) => {
  if (loading) return <CircularProgress />;

  if (!contacts.length) {
    return <Typography>No contact messages found.</Typography>;
  }

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      {contacts.map((msg) => (
        <Paper key={msg._id} elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography fontWeight={600} fontSize="1.1rem">
            {msg.subject}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            From: {msg.name} ({msg.email}) |{' '}
            {new Date(msg.createdAt).toLocaleString()}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>{msg.message}</Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default ContactListPanel;
