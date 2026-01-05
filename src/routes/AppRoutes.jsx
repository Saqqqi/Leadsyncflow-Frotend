import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from '../auth/Signup';
import LoginPage from '../auth/login';

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}
