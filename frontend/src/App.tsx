import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import ManageSweets from "./pages/Admin/ManageSweets";
import ManageOrders from "./pages/Admin/ManageOrders";
import NotFound from "./pages/NotFound";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/" element={<Dashboard />} />
				<Route path="/orders" element={<Orders />} />
				<Route path="/admin/sweets" element={<ManageSweets />} />
				<Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
