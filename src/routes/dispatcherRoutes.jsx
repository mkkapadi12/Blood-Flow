import DispatcherLayout from "@/components/layouts/DispatcherLayout";
import DispatcherLogin from "@/pages/dispatcher/auth/DispatcherLogin";
import DispatcherRegister from "@/pages/dispatcher/auth/DispatcherRegister";
import DispatcherDashboard from "@/pages/dispatcher/page/DispatcherDashboard";
import AllRequestes from "@/pages/dispatcher/page/AllRequestes";
import RequestDetailsPage from "@/pages/dispatcher/page/RequestDetailsPage";
import ProtectedRoute from "./ProtectedRoute";
import { DISPATCHER_TOKEN_KEY } from "@/config/storage-keys";

export const dispatcherRoutes = [
  { path: "/dispatcher/login", element: <DispatcherLogin /> },
  { path: "/dispatcher/register", element: <DispatcherRegister /> },
  {
    path: "/dispatcher",
    element: (
      <ProtectedRoute
        tokenKey={DISPATCHER_TOKEN_KEY}
        redirectTo="/dispatcher/login"
      >
        <DispatcherLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DispatcherDashboard /> },
      { path: "requests", element: <AllRequestes /> },
      { path: "requests/:id", element: <RequestDetailsPage /> },
    ],
  },
];
