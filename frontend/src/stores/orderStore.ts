import { create } from "zustand";

interface Sweet {
	id: number;
	name: string;
	category: string;
	price: number;
	quantity: number;
}

interface User {
	id: number;
	email: string;
	name?: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

interface Order {
	id: number;
	quantity: number;
	status: string;
	userId: number;
	createdAt: string;
	sweet: Sweet;
	user: User;
}

interface OrderState {
	orders: Order[];
	setOrders: (orders: Order[]) => void;
	addOrder: (order: Order) => void;
	updateOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
	orders: [],

	setOrders: (orders) => set({ orders }),

	addOrder: (order) =>
		set((state) => ({
			orders: [...state.orders, order],
		})),

	updateOrder: (order) =>
		set((state) => ({
			orders: state.orders.map((o) => (o.id === order.id ? order : o)),
		})),
}));
