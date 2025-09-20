import { useState } from "react";
import { register } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const setAuth = useAuthStore((state) => state.setAuth);
	const navigate = useNavigate();

	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await register(form);
			setAuth(data.user, data.token);
			navigate("/");
		} catch (err: any) {
			setError(err.response?.data?.error || "Registration failed");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border rounded">
			<h1 className="text-2xl mb-4">Register</h1>
			{Array.isArray(error) ? (
				<div className="text-red-500 mb-2">
					{error.map((e: any, idx: number) => (
						<div key={idx}>{e.message}</div>
					))}
				</div>
			) : (
				error && <div className="text-red-500 mb-2">{error}</div>
			)}
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<input
					type="text"
					name="name"
					placeholder="Name"
					value={form.name}
					onChange={handleChange}
					className="p-2 border rounded"
				/>
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
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;
