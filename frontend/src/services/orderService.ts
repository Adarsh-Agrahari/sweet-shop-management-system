import axiosInstance from "../utils/axiosInstance";

export const getOrders = async () => {
	const res = await axiosInstance.get(`/orders`);
	return res.data;
};

export const placeOrder = async (sweetId: number, quantity: number) => {
	const res = await axiosInstance.post(`/orders`, { sweetId, quantity });
	return res.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
	const res = await axiosInstance.patch(`/orders/${id}/status`, { status });
	return res.data;
};
