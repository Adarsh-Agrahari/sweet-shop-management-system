import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import { useOrderStore } from "../../stores/orderStore";

const ManageOrders = () => {
	const { orders, setOrders, updateOrder } = useOrderStore();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getOrders();
				setOrders(data);
			} catch (err: any) {
				console.error(err);
				setError("Failed to fetch orders");
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, [setOrders]);

	const handleStatusChange = async (id: number, status: string) => {
		try {
			const updated = await updateOrderStatus(id, status);
			updateOrder(updated);
		} catch (err: any) {
			console.error(err);
			setError(err.response?.data?.error || "Failed to update order");
		}
	};

	if (loading) return <p>Loading orders...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

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
			<h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
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
							<th className="border px-3 py-2">User Name</th>
							<th className="border px-3 py-2">Email</th>
							<th className="border px-3 py-2">Date & Time</th>
							<th className="border px-3 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((o) => (
							<tr key={o.id} className={getRowClass(o.status)}>
								<td className="border px-3 py-2">{o.id}</td>
								<td className="border px-3 py-2">
									{o.sweet.name}
								</td>
								<td className="border px-3 py-2">
									{o.quantity}
								</td>
								<td className="border px-3 py-2">{o.status}</td>
								<td className="border px-3 py-2">
									{o.user?.name || "-"}
								</td>
								<td className="border px-3 py-2">
									{o.user?.email || "-"}
								</td>
								<td className="border px-3 py-2">
									{new Date(o.createdAt).toLocaleString()}
								</td>
								<td className="border px-3 py-2">
									<select
										value={o.status}
										onChange={(e) =>
											handleStatusChange(
												o.id,
												e.target.value
											)
										}
										className="border px-2 py-1 rounded"
									>
										<option value="PENDING">Pending</option>
										<option value="CONFIRMED">
											Confirmed
										</option>
										<option value="CANCELLED">
											Cancelled
										</option>
									</select>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default ManageOrders;
