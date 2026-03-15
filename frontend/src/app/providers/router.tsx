import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import { AdminChatPage } from "../../pages/admin/AdminChatPage";
import { AdminDashboardPage } from "../../pages/admin/AdminDashboardPage";
import LandingPage from "../../pages/public/landing/page";
import TourDetailsPage from "../../pages/public/tour-details/page";

const router = createBrowserRouter([
	// Публичные маршруты
	{ path: "/", element: <LandingPage /> },
	{ path: "/tours/:id", element: <TourDetailsPage /> },

	// Админка
	{ path: "/admin", element: <AdminDashboardPage /> },
	{ path: "/admin/create", element: <AdminChatPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;

