import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ingestDocuments = async (texts: string[]): Promise<{ message: string }> => {
    const response = await api.post('/api/ingest', { texts });
    return response.data;
};

export const askQuestion = async (question: string): Promise<{ answer: string }> => {
    const response = await api.post('/api/chat', { question });
    return response.data;
};

export default api;