import axiosInstance from "./axiosInstance";

export const getUserFromToken = async () => {
	const token = localStorage.getItem("token");
	if (!token) return null;

	try {
		const res = await axiosInstance.get("/auth/me", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.data.user;
	} catch {
		localStorage.removeItem("token");
		return null;
	}
};
