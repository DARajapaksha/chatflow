import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { Button } from '@heroui/react';
import { WallpaperProvider } from './context/WallpaperContext';
import { ThemeProvider } from './context/ThemeContext';
import { Route, Routes } from 'react-router';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import { useAuth } from '@clerk/react';

function App() {

  const { isSignedIn, isLoaded } = useAuth();

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to="/auth" replace />} />
          <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to="/chat" replace />} />
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App;
