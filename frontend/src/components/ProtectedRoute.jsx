import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}
