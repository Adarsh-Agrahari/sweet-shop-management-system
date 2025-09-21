import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface PublicRouteProps {
	children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
	const { user } = useAuthStore();

	if (user) {
		// Already logged in, redirect to dashboard
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

export default PublicRoute;
