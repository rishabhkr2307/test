import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Workspace from './components/Workspace'
import { AuthProvider } from './pages/authcontext'     
import ProtectedRoute from './pages/protectedRoute'    
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/authPage'
import ViewWorkspace from './pages/viewWorkspace'
import {ThemeProvider} from './pages/ThemeContext'

export default function App() {
    return (
        <ThemeProvider>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/register" element={<AuthPage mode="register" />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/workspace/:roomId" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
                    <Route path='/view/:roomId' element={<ViewWorkspace/>}/>
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
        </ThemeProvider>
    )
}