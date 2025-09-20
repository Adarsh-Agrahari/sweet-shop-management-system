interface Props {
	sweet: {
		id: number;
		name: string;
		category: string;
		price: number;
		quantity: number;
	};
}

const SweetCard = ({ sweet }: Props) => {
	return (
		<div className="border p-4 rounded shadow flex flex-col justify-between">
			<h2 className="text-lg font-bold">{sweet.name}</h2>
			<p>Category: {sweet.category}</p>
			<p>Price: ${sweet.price}</p>
			<p>Stock: {sweet.quantity}</p>
			<button
				disabled={sweet.quantity <= 0}
				className={`mt-2 p-2 rounded text-white ${
					sweet.quantity > 0 ? "bg-green-500" : "bg-gray-400"
				}`}
			>
				{sweet.quantity > 0 ? "Purchase" : "Out of Stock"}
			</button>
		</div>
	);
};

export default SweetCard;
