import axiosInstance from "../utils/axiosInstance";

export const getSweets = async () => {
	const res = await axiosInstance.get("/sweets");
	return res.data;
};

export const createSweet = async (data: {
	name: string;
	category: string;
	price: number;
	quantity: number;
}) => {
	const res = await axiosInstance.post("/sweets", data);
	return res.data;
};

export const updateSweet = async (id: number, data: Partial<any>) => {
    console.log("Updating sweet with data:", data);
	const res = await axiosInstance.patch(`/sweets/${id}`, data);
	return res.data;
};

export const deleteSweet = async (id: number) => {
	const res = await axiosInstance.delete(`/sweets/${id}`);
	return res.data;
};

export const restockSweet = async (id: number, quantity: number) => {
	const res = await axiosInstance.post(`/sweets/${id}/restock`, { quantity });
	return res.data;
};
