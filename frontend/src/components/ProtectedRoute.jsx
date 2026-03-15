import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { user, isSuspended } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to={{ pathname: "/auth", hash: location.hash, search: location.search }} state={{ from: location }} replace />;
    }

    if (isSuspended) {
        return <Navigate to="/suspended" replace />;
    }

    return children;
}
