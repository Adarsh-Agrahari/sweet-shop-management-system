import { create } from "zustand";

interface Sweet {
	id: number;
	name: string;
	category: string;
	price: number;
	quantity: number;
}

interface SweetState {
	sweets: Sweet[];
	setSweets: (sweets: Sweet[]) => void;
	addSweet: (sweet: Sweet) => void;
	updateSweet: (sweet: Sweet) => void;
	deleteSweet: (id: number) => void;
}

export const useSweetStore = create<SweetState>((set) => ({
	sweets: [],
	setSweets: (sweets) => set({ sweets }),
	addSweet: (sweet) => set((state) => ({ sweets: [...state.sweets, sweet] })),
	updateSweet: (sweet) =>
		set((state) => ({
			sweets: state.sweets.map((s) => (s.id === sweet.id ? sweet : s)),
		})),
	deleteSweet: (id) =>
		set((state) => ({
			sweets: state.sweets.filter((s) => s.id !== id),
		})),
}));
