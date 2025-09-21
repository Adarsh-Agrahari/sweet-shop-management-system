import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import ManageSweets from "./pages/Admin/ManageSweets";
import ManageOrders from "./pages/Admin/ManageOrders";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AppInitializer from "./components/Auth";
import PublicRoute from "./components/PublicRoute";

function App() {
	return (
		<AppInitializer>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/orders"
						element={
							<ProtectedRoute>
								<Orders />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/sweets"
						element={
							<ProtectedRoute adminOnly>
								<ManageSweets />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/orders"
						element={
							<ProtectedRoute adminOnly>
								<ManageOrders />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</AppInitializer>
	);
}

export default App;
