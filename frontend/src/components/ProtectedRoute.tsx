import type{ ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface ProtectedRouteProps {
	children: ReactNode;
	adminOnly?: boolean;
}

const ProtectedRoute = ({
	children,
	adminOnly = false,
}: ProtectedRouteProps) => {
	const { user } = useAuthStore();

	if (!user) {
		// Not logged in
		return <Navigate to="/login" replace />;
	}

	if (adminOnly && user.role !== "ADMIN") {
		// Logged in but not admin
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
