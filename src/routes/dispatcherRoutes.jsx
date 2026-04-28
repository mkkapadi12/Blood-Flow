import DispatcherLayout from "@/components/layouts/DispatcherLayout";
import DispatcherLogin from "@/pages/dispatcher/auth/DispatcherLogin";
import DispatcherRegister from "@/pages/dispatcher/auth/DispatcherRegister";
import DispatcherDashboard from "@/pages/dispatcher/page/DispatcherDashboard";
import SingleRequestPage from "@/pages/dispatcher/page/SingleRequestPage";

export const dispatcherRoutes = [
  { path: "/dispatcher/login", element: <DispatcherLogin /> },
  { path: "/dispatcher/register", element: <DispatcherRegister /> },
  {
    path: "/dispatcher",
    element: <DispatcherLayout />,
    children: [
      { path: "dashboard", element: <DispatcherDashboard /> },
      { path: "requests/:id", element: <SingleRequestPage /> },
    ],
  },
];
