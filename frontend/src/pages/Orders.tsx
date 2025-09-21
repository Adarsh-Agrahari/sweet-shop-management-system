import { useEffect, useState } from "react";
import { useOrderStore } from "../stores/orderStore";
import { getOrders, placeOrder } from "../services/orderService";
import { getSweets } from "../services/sweetService";

const Orders = () => {
	const { orders, setOrders, addOrder } = useOrderStore();
	const [sweets, setSweets] = useState<any[]>([]);
	const [sweetId, setSweetId] = useState<number | "">("");
	const [quantity, setQuantity] = useState<number>(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch orders + sweets
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [orderData, sweetData] = await Promise.all([
					getOrders(),
					getSweets(),
				]);
				setOrders(orderData);
				setSweets(sweetData);
			} catch (err) {
				console.error(err);
				setError("Failed to fetch data");
			}
		};
		fetchData();
	}, [setOrders]);

	// Handle new order placement
	const handlePlaceOrder = async () => {
		if (!sweetId || quantity <= 0) return;

		try {
			setLoading(true);
			setError(null);
			const data = await placeOrder(Number(sweetId), quantity);
			addOrder(data); // update Zustand store
			setSweetId("");
			setQuantity(1);
		} catch (err: any) {
			console.error(err);
			setError(err.response?.data?.error || "Failed to place order");
		} finally {
			setLoading(false);
		}
	};

	const getRowClass = (status: string) => {
		switch (status.toUpperCase()) {
			case "PENDING":
				return "bg-yellow-100";
			case "CONFIRMED":
				return "bg-green-100";
			case "CANCELLED":
				return "bg-red-100";
			default:
				return "";
		}
	};

	return (
		<div className="p-6 w-3/4 mx-auto">
			<h1 className="text-2xl font-bold mb-4">My Orders</h1>

			{/* Place new order */}
			<div className="mb-6 border p-4 rounded">
				<h2 className="text-lg font-semibold mb-2">Place New Order</h2>
				<div className="flex flex-col gap-2">
					{/* Sweet Selection */}
					<div className="flex items-center gap-2">
						<select
							value={sweetId}
							onChange={(e) => setSweetId(Number(e.target.value))}
							className="border px-2 py-1 rounded"
						>
							<option value="">Select Sweet</option>
							{sweets.map((sweet) => (
								<option key={sweet.id} value={sweet.id}>
									{sweet.name} - ₹{sweet.price}
								</option>
							))}
						</select>

						{/* Show stock if a sweet is selected */}
						{sweetId && (
							<span className="text-gray-700">
								Stock:{" "}
								{sweets.find((s) => s.id === sweetId)?.quantity ??
									0}
							</span>
						)}
					</div>

					{/* Quantity & Total */}
					{sweetId && (
						<div className="flex items-center gap-2">
							<input
								type="number"
								value={quantity}
								min={1}
								max={
									sweets.find((s) => s.id === sweetId)
										?.quantity ?? 1
								}
								onChange={(e) =>
									setQuantity(
										Math.min(
											Number(e.target.value),
											sweets.find((s) => s.id === sweetId)
												?.quantity ?? 1
										)
									)
								}
								className="border px-2 py-1 rounded w-20"
							/>
							<span className="font-semibold">
								Total: ₹
								{(
									quantity *
									(sweets.find((s) => s.id === sweetId)
										?.price ?? 0)
								).toFixed(2)}
							</span>

							<button
								onClick={handlePlaceOrder}
								disabled={loading}
								className="bg-blue-500 text-white px-4 py-1 rounded"
							>
								{loading ? "Placing..." : "Place Order"}
							</button>
						</div>
					)}

					{/* Error message */}
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>
			</div>

			{/* Orders List */}
			<div>
				<h2 className="text-lg font-semibold mb-2">Your Orders</h2>
				{orders.length === 0 ? (
					<p>No orders yet.</p>
				) : (
					<table className="w-full border-collapse border">
						<thead>
							<tr className="bg-gray-100">
								<th className="border px-3 py-2">ID</th>
								<th className="border px-3 py-2">Sweet</th>
								<th className="border px-3 py-2">Quantity</th>
								<th className="border px-3 py-2">Status</th>
								<th className="border px-3 py-2">Date</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((o) => (
								<tr
									key={o.id}
									className={getRowClass(o.status)}
								>
									<td className="border px-3 py-2">{o.id}</td>
									<td className="border px-3 py-2">
										{o.sweet.name}
									</td>
									<td className="border px-3 py-2">
										{o.quantity}
									</td>
									<td className="border px-3 py-2">
										{o.status}
									</td>
									<td className="border px-3 py-2">
										{new Date(o.createdAt).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default Orders;
