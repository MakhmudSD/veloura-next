import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CREATE_INQUIRY } from '../../../apollo/user/mutation';
import { GET_INQUIRIES } from '../../../apollo/admin/query';

type InquiryType = 'GENERAL' | 'DELIVERY' | 'PRODUCT' | 'ACCOUNT';

const Inquiry = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const [inquiryType, setInquiryType] = useState<InquiryType>('GENERAL');
  const [content, setContent] = useState('');
  const [createInquiry] = useMutation(CREATE_INQUIRY);

  const { data, refetch } = useQuery(GET_INQUIRIES, {
    skip: !user,
    fetchPolicy: 'network-only',
  });

  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    if (data?.getMyInquiries) {
      setInquiries(data.getMyInquiries);
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const res = await createInquiry({
        variables: {
          input: {
            inquiryType,
            content,
          },
        },
      });

      const newInquiry = res.data.createInquiry;
      setInquiries([newInquiry, ...inquiries]);
      setContent('');
      setInquiryType('GENERAL');
    } catch (error) {
      console.error(error);
      alert('Failed to submit inquiry.');
    }
  };

  if (device === 'mobile') return <div>Inquiry MOBILE</div>;

  return (
    <Stack direction="row" spacing={4} className="inquiry-content" sx={{ px: 4, py: 4 }}>
      {/* Left: Inquiry list */}
      <Box className="inquiry-list" flex={2}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          My Inquiries
        </Typography>

        {inquiries.length === 0 ? (
          <Typography>No inquiries submitted yet.</Typography>
        ) : (
          inquiries.map((inq) => (
            <Paper
              key={inq._id}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.5,
                    bgcolor: '#e0e0e0',
                    borderRadius: 10,
                    textTransform: 'capitalize',
                    color: '#555',
                  }}
                >
                  {inq.inquiryType.toLowerCase()}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {moment(inq.createdAt).format('YYYY.MM.DD')}
                </Typography>
              </Box>

              <Typography fontSize={14} sx={{ whiteSpace: 'pre-line' }}>
                {inq.content}
              </Typography>

              {inq.reply && (
                <Box mt={2} p={2} bgcolor="#f3f8ff" borderRadius={1}>
                  <Typography fontSize={13} fontWeight={500} color="#3a4e74" mb={1}>
                    🛠 Admin Reply:
                  </Typography>
                  <Typography fontSize={14}>{inq.reply}</Typography>
                </Box>
              )}
            </Paper>
          ))
        )}
      </Box>

      {/* Right: Inquiry form */}
      <Box flex={1} sx={{ position: 'sticky', top: 32 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Write a New Inquiry
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              select
              label="Select Category"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value as InquiryType)}
              size="small"
            >
              <MenuItem value="GENERAL">General</MenuItem>
              <MenuItem value="DELIVERY">Delivery</MenuItem>
              <MenuItem value="PRODUCT">Product</MenuItem>
              <MenuItem value="ACCOUNT">Account</MenuItem>
            </TextField>

			<Box display="flex" flexDirection="column" alignItems="flex-start" gap={1} width="100%">
  <Typography className="form-label">Your Message</Typography>
  <TextField
    multiline
    rows={4}
    placeholder="Write your inquiry here..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    size="small"
    fullWidth
    variant="outlined"
    InputProps={{
      style: {
        padding: '12px',
        fontSize: '14px',
        lineHeight: '1.5',
      },
    }}
    InputLabelProps={{
      shrink: false, // if you are not using label prop
    }}
  />
</Box>


            <Divider />

            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
};

export default Inquiry;
