import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 500, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Contact Me</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>Send</Button>
        </form>
      </Box>
    </Box>
  );
};

export default Contact;
