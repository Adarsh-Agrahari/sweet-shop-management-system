import { useNavigate } from "react-router-dom";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "./ui/menubar";
import { Button } from "./ui/button";
import { useAuthStore } from "../stores/authStore";

const Navbar = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore((state) => state);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<Menubar className="border-b border-gray-200 mt-4 px-6 py-3 bg-white/80 backdrop-blur-md shadow-sm flex justify-between">
			{/* Logo */}
			<div>
				<Button onClick={() => navigate("/")} variant="ghost">
					SSMS
				</Button>
			</div>

			{/* Menu Items */}
			<div className="flex space-x-4">
				{/* Sweets Menu */}
				{user?.role == "ADMIN" && (
					<Button
						onClick={() => navigate("/admin/sweets")}
						variant="ghost"
					>
						Manage Sweets
					</Button>
				)}

				{user?.role == "ADMIN" && (
					<div className="border border-r my-2"></div>
				)}

				{/* Orders Menu */}
				{user?.role == "ADMIN" && (
					<Button
						onClick={() => navigate("/admin/orders")}
						variant="ghost"
					>
						Manage Orders
					</Button>
				)}

				{user && (
					<div className="border border-r my-2"></div>
				)}

				{/* Orders Menu */}
				{user && (
					<Button
						onClick={() => navigate("/orders")}
						variant="ghost"
					>
						Orders
					</Button>
				)}

				<div className="border border-r my-2"></div>

				{/* Account / Login-Logout */}
				<MenubarMenu>
					<MenubarTrigger className="px-4 py-2 text-gray-700 font-medium rounded-md transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-5 mr-1"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
						Account
					</MenubarTrigger>
					<MenubarContent className="rounded-md border shadow-lg bg-white/95 backdrop-blur-sm">
						{user ? (
							<MenubarItem
								onSelect={handleLogout}
								className="px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer rounded-sm transition-colors"
							>
								Logout
							</MenubarItem>
						) : (
							<>
								<MenubarItem
									onSelect={() => navigate("/login")}
									className="px-4 py-2 cursor-pointer rounded-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
								>
									Login
								</MenubarItem>
								<MenubarItem
									onSelect={() => navigate("/register")}
									className="px-4 py-2 cursor-pointer rounded-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
								>
									Register
								</MenubarItem>
							</>
						)}
					</MenubarContent>
				</MenubarMenu>
			</div>
		</Menubar>
	);
};

export default Navbar;
