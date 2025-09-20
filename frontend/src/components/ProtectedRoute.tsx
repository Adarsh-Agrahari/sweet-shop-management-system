import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface Props {
	children: ReactNode;
	adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
	const user = useAuthStore((state) => state.user);

	if (!user) return <Navigate to="/login" />;
	if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

	return <>{children}</>;
};

export default ProtectedRoute;
