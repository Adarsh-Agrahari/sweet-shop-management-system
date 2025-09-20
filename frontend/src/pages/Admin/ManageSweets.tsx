import { useEffect, useState } from "react";
import {
	getSweets,
	createSweet,
	updateSweet,
	deleteSweet,
	restockSweet,
} from "../../services/sweetService";
import { useSweetStore } from "../../stores/sweetStore";

interface Sweet {
	id: number;
	name: string;
	category: string;
	price: number;
	quantity: number;
}

const ManageSweets = () => {
	const sweets = useSweetStore((state) => state.sweets);
	const setSweets = useSweetStore((state) => state.setSweets);
	const addSweetToStore = useSweetStore((state) => state.addSweet);
	const updateSweetInStore = useSweetStore((state) => state.updateSweet);
	const deleteSweetFromStore = useSweetStore((state) => state.deleteSweet);

	const [loading, setLoading] = useState(true);

	// Modals state
	const [showForm, setShowForm] = useState(false);
	const [editSweet, setEditSweet] = useState<Sweet | null>(null);
	const [restockSweetId, setRestockSweetId] = useState<number | null>(null);
	const [restockQty, setRestockQty] = useState(0);

	// Form state
	const [form, setForm] = useState({
		name: "",
		category: "",
		price: 0,
		quantity: 0,
	});

	const [error, setError] = useState("");

	useEffect(() => {
		const fetchSweets = async () => {
			setLoading(true);
			try {
				const data = await getSweets();
				setSweets(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchSweets();
	}, []);

	const openForm = (sweet?: Sweet) => {
		if (sweet) {
			setEditSweet(sweet);
			setForm({ ...sweet });
		} else {
			setEditSweet(null);
			setForm({ name: "", category: "", price: 0, quantity: 0 });
		}
		setShowForm(true);
		setError("");
	};

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;
		setForm({
			...form,
			[name]: type === "number" ? Number(value) : value,
		});
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editSweet) {
				const updatedFields: Partial<typeof form> = {};
				Object.keys(form).forEach((key) => {
					if ((form as any)[key] !== (editSweet as any)[key]) {
						(updatedFields as any)[key] = (form as any)[key];
					}
				});

				if (Object.keys(updatedFields).length === 0) {
					alert("No changes made");
					return;
				}
				const updated = await updateSweet(editSweet.id, updatedFields);
				updateSweetInStore(updated);
			} else {
				const created = await createSweet(form);
				addSweetToStore(created);
			}
			setShowForm(false);
		} catch (err: any) {
			setError(err.response?.data?.error || "Error saving sweet");
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this sweet?")) return;
		try {
			await deleteSweet(id);
			deleteSweetFromStore(id);
		} catch (err) {
			console.error(err);
		}
	};

	const handleRestock = async (id: number) => {
		if (restockQty <= 0) return alert("Enter valid quantity");
		try {
			const updated = await restockSweet(id, restockQty);
			updateSweetInStore(updated);
			setRestockSweetId(null);
			setRestockQty(0);
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Manage Sweets</h1>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => openForm()}
				>
					Add Sweet
				</button>
			</div>

			{/* Sweet Table */}
			<table className="w-full table-auto border-collapse">
				<thead>
					<tr className="bg-gray-200">
						<th className="border px-2 py-1">Name</th>
						<th className="border px-2 py-1">Category</th>
						<th className="border px-2 py-1">Price</th>
						<th className="border px-2 py-1">Quantity</th>
						<th className="border px-2 py-1">Actions</th>
					</tr>
				</thead>
				<tbody>
					{sweets.map((sweet) => (
						<tr key={sweet.id} className="text-center">
							<td className="border px-2 py-1">{sweet.name}</td>
							<td className="border px-2 py-1">
								{sweet.category}
							</td>
							<td className="border px-2 py-1">${sweet.price}</td>
							<td className="border px-2 py-1">
								{sweet.quantity}
							</td>
							<td className="border px-2 py-1 flex justify-center gap-2">
								<button
									className="bg-yellow-400 px-2 py-1 rounded"
									onClick={() => openForm(sweet)}
								>
									Edit
								</button>
								<button
									className="bg-red-500 px-2 py-1 rounded text-white"
									onClick={() => handleDelete(sweet.id)}
								>
									Delete
								</button>
								<button
									className="bg-green-500 px-2 py-1 rounded text-white"
									onClick={() => setRestockSweetId(sweet.id)}
								>
									Restock
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Add/Edit Form Modal */}
			{showForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded shadow w-96">
						<h2 className="text-xl font-bold mb-4">
							{editSweet ? "Edit Sweet" : "Add Sweet"}
						</h2>
						{error && (
							<div className="text-red-500 mb-2">{error}</div>
						)}
						<form
							onSubmit={handleFormSubmit}
							className="flex flex-col gap-2"
						>
							<input
								type="text"
								name="name"
								placeholder="Name"
								value={form.name}
								onChange={handleFormChange}
								className="border p-2 rounded"
								required
							/>
							<input
								type="text"
								name="category"
								placeholder="Category"
								value={form.category}
								onChange={handleFormChange}
								className="border p-2 rounded"
								required
							/>
							<input
								type="number"
								name="price"
								placeholder="Price"
								value={form.price}
								onChange={handleFormChange}
								className="border p-2 rounded"
								required
								min={0}
							/>
							<input
								type="number"
								name="quantity"
								placeholder="Quantity"
								value={form.quantity}
								onChange={handleFormChange}
								className="border p-2 rounded"
								required
								min={0}
							/>
							<div className="flex justify-end gap-2 mt-2">
								<button
									type="button"
									className="px-3 py-1 rounded border"
									onClick={() => setShowForm(false)}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-3 py-1 rounded bg-blue-500 text-white"
								>
									Save
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Restock Modal */}
			{restockSweetId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded shadow w-80">
						<h2 className="text-xl font-bold mb-4">
							Restock Sweet
						</h2>
						<input
							type="number"
							placeholder="Quantity"
							value={restockQty}
							onChange={(e) =>
								setRestockQty(Number(e.target.value))
							}
							className="border p-2 rounded w-full mb-4"
							min={1}
						/>
						<div className="flex justify-end gap-2">
							<button
								className="px-3 py-1 rounded border"
								onClick={() => setRestockSweetId(null)}
							>
								Cancel
							</button>
							<button
								className="px-3 py-1 rounded bg-green-500 text-white"
								onClick={() => handleRestock(restockSweetId)}
							>
								Restock
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ManageSweets;
