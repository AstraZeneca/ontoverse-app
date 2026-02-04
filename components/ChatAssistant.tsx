import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { Close, SmartToy, Send } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Paper)(({ theme }) => ({
  minWidth: '400px',
  maxWidth: '600px',
  minHeight: '300px',
  maxHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  overflowY: 'auto',
}));

const PlaceholderMessage = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
}));

interface ChatAssistantProps {
  open: boolean;
  onClose: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ open, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement actual chat functionality
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperComponent={ChatContainer}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy color="primary" />
          <Typography variant="h6">Ontoverse Companion</Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <ChatContent>
        <PlaceholderMessage>
          <SmartToy sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
          <Typography variant="body1" gutterBottom>
            Welcome to the Ontoverse Companion!
          </Typography>
          <Typography variant="body2">
            Hi! I'm here to guide you through the Ontoverse.
            Feel free to ask me anything about papers, topics, or navigation.
          </Typography>
        </PlaceholderMessage>
      </ChatContent>

      <InputContainer>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!message.trim()}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <Send />
        </Button>
      </InputContainer>
    </Dialog>
  );
};

export default ChatAssistant;
