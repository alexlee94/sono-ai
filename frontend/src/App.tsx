import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ChatPage from './pages/ChatPage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a1a1a',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ChatPage />
        </ThemeProvider>
    );
};

export default App;