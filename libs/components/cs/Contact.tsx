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
    <Box sx={{ backgroundColor: '#faf8f5', py: 10 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontFamily: 'Playfair Display',
            color: '#2e2424',
            mb: 4,
            textAlign: 'center',
          }}
        >
          We're Always Here To Assist
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
          {/* Form Side */}
          <Box flex={1}>
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
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #b08a60, #a77f54)',
                    fontWeight: 'bold',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #a77f54, #8f6843)',
                    },
                  }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Static Info Side */}
          <Box flex={1} sx={{ backgroundColor: '#f5f1ec', borderRadius: 4, p: 4 }}>
            <Typography variant="h6" fontFamily="Playfair Display" mb={2} color="#2e2424">
              Our Address
            </Typography>
            <Typography variant="body2" mb={3}>
            74-16 Itaewon-ro 27ga-gil,  Yongsan-gu, Seoul, 04349, South Korea         
            </Typography>
            <Typography variant="h6" fontFamily="Playfair Display" mb={2} color="#2e2424">
              Contact Details
            </Typography>
            <Typography variant="body2">010 9380 7522</Typography>
            <Typography variant="body2" mb={3}>makhwork15@gmail.com</Typography>

            <Typography variant="h6" fontFamily="Playfair Display" mb={2} color="#2e2424">
              Opening Hours
            </Typography>
            <Typography variant="body2">Monday to Friday • 09:00 to 21:00</Typography>
            <Typography variant="body2">Saturday & Sunday • 12:00 to 20:00</Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ContactPage;
