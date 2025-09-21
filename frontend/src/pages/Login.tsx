import { useState } from "react";
import { login } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const setAuth = useAuthStore((state) => state.setAuth);
	const navigate = useNavigate();

	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await login(form);
			setAuth(data.user, data.token);
			navigate("/");
		} catch (err: any) {
			setError(err.response?.data?.error || "Login failed");
		}
	};

	const demoLogin = async () => {
		try {
			const data = await login({
				email: "admin@example.com",
				password: "admin123",
			});
			setAuth(data.user, data.token);
			navigate("/");
		} catch (err: any) {
			setError(err.response?.data?.error || "Login failed");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border rounded">
			<h1 className="text-2xl mb-4 flex justify-center">Login</h1>
			{error && <div className="text-red-500 mb-2">{error}</div>}
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					className="p-2 border rounded"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					className="p-2 border rounded"
				/>
				<button
					type="submit"
					className="p-2 bg-blue-500 text-white rounded"
				>
					Login
				</button>
			</form>
			<div className="flex items-center justify-center gap-2  mt-4 p-2">
				<span className="flex items-center">
					Don't have an account?
				</span>
				<button
					onClick={() => navigate("/register")}
					className="text-blue-500 underline hover:text-blue-800 hover:cursor-pointer flex items-center"
				>
					Register here
				</button>
			</div>
			<div>
				<button
					onClick={() => demoLogin()}
					className="text-white mx-auto flex justify-center hover:cursor-pointer items-center border bg-green-400 hover:bg-green-600 px-4 py-2 rounded mt-4"
				>
					Demo Login
				</button>
			</div>
		</div>
	);
};

export default Login;
