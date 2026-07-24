import { useState } from 'react';
import {
    Container, Box, TextField, Button, Typography,
    Paper, CircularProgress, Alert, Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { askQuestion, ingestDocuments } from '../api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [document, setDocument] = useState('');
    const [ingesting, setIngesting] = useState(false);
    const [ingested, setIngested] = useState(false);

    const handleIngest = async () => {
        if (!document.trim()) return;
        setIngesting(true);
        setError('');
        try {
            await ingestDocuments([document]);
            setIngested(true);
            setDocument('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to ingest document');
        } finally {
            setIngesting(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError('');

        try {
            const response = await askQuestion(input);
            const assistantMessage: Message = { role: 'assistant', content: response.answer };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to get response');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
                Sono AI
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Upload a document and ask questions about it
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Document Upload */}
            {!ingested && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Upload Document
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        placeholder="Paste your document text here..."
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleIngest}
                        disabled={ingesting || !document.trim()}
                        fullWidth
                    >
                        {ingesting ? 'Processing...' : 'Upload & Process Document'}
                    </Button>
                </Paper>
            )}

            {ingested && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Document processed successfully. You can now ask questions.
                </Alert>
            )}

            {/* Chat */}
            <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
                    {messages.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography color="text.secondary">
                                Upload a document to start chatting
                            </Typography>
                        </Box>
                    ) : (
                        messages.map((msg, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 2
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '75%',
                                        bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.100',
                                        color: msg.role === 'user' ? 'white' : 'text.primary',
                                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                                    }}
                                >
                                    <Typography variant="body1">{msg.content}</Typography>
                                </Paper>
                            </Box>
                        ))
                    )}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Ask a question about your document..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={loading || !ingested}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        onClick={handleSend}
                        disabled={loading || !input.trim() || !ingested}
                        sx={{ minWidth: 50 }}
                    >
                        <SendIcon />
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ChatPage;