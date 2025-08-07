import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CONTACT } from '../../../apollo/user/mutation';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { CreateContactInput } from '../../types/contact/contact';

const ContactPage = () => {
  const [formData, setFormData] = useState<CreateContactInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [createContact, { loading }] = useMutation(CREATE_CONTACT);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createContact({ variables: { createContactInput: formData } });
      sweetTopSmallSuccessAlert('Your message has been sent!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      sweetMixinErrorAlert(err.message || 'Something went wrong.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          fontFamily: 'Playfair Display',
          color: '#2e2424',
          mb: 1,
        }}
      >
        Contact Us
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        We’d love to hear from you. Fill out the form and we’ll get back to you soon.
      </Typography>

      <Stack spacing={3}>
        <TextField
          name="name"
          label="Your Name"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Your Email"
          type="email"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="subject"
          label="Subject"
          variant="outlined"
          fullWidth
          value={formData.subject}
          onChange={handleChange}
        />
        <TextField
          name="message"
          label="Message"
          multiline
          rows={1}
          variant="outlined"
          fullWidth
          value={formData.message}
          onChange={handleChange}
        />

        <Box textAlign="right">
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default ContactPage;
