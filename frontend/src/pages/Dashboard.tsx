import { useEffect, useState } from "react";
import { getSweets } from "../services/sweetService";
import { useSweetStore } from "../stores/sweetStore";
import SweetCard from "../components/SweetCard";

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const sweets = useSweetStore((state) => state.sweets);
	const setSweets = useSweetStore((state) => state.setSweets);

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

	if (loading) return <div>Loading...</div>;

	return (
		<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{sweets.map((sweet) => (
				<SweetCard key={sweet.id} sweet={sweet} />
			))}
		</div>
	);
};

export default Dashboard;
