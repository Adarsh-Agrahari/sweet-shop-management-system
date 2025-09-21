// main App.tsx or root component
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import axiosInstance from "../utils/axiosInstance";

const AppInitializer = ({ children }: any) => {
	const setAuth = useAuthStore((state) => state.setAuth);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				// Set token to axios headers temporarily
				axiosInstance.defaults.headers.common[
					"Authorization"
				] = `Bearer ${token}`;

				// Fetch current user
				const res = await axiosInstance.get("/auth/me");
				setAuth(res.data.user, token);
			} catch (err) {
				localStorage.removeItem("token");
				console.error("Failed to fetch user from token", err);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, [setAuth]);

	if (loading) return <div>Loading...</div>; // optional splash screen

	return <>{children}</>;
};

export default AppInitializer;
