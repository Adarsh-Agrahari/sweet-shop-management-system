import axiosInstance from "../utils/axiosInstance";

export const register = async (data: {
	name?: string;
	email: string;
	password: string;
}) => {
	const res = await axiosInstance.post("/auth/register", data);
	return res.data;
};

export const login = async (data: { email: string; password: string }) => {
	const res = await axiosInstance.post("/auth/login", data);
	return res.data;
};
