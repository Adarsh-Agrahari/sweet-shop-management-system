import { create } from "zustand";

interface User {
	id: number;
	email: string;
	name?: string;
	role: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	setAuth: (user: User, token: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	setAuth: (user, token) => {
		localStorage.setItem("token", token);
		set({ user, token });
	},
	logout: () => {
		localStorage.removeItem("token");
		set({ user: null, token: null });
	},
}));
