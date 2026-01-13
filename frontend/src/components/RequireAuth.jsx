import { useGetUserQuery } from '../store/authApi';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }) {
    const { data: user, isLoading } = useGetUserQuery();

    if (isLoading) {
        return <div>Проверка авторизации...</div>;
    }

    return user ? children : <Navigate to="/area-checker/login" replace />;
}
