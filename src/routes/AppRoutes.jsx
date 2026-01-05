import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from '../auth/Signup';
import LoginPage from '../auth/login';
import DynamicRoutes from './DynamicRoutes';

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* All Dynamic Dashboard Routes */}
                <Route path="/*" element={<DynamicRoutes />} />
            </Routes>
        </Router>
    );
}
