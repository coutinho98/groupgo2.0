import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;

}