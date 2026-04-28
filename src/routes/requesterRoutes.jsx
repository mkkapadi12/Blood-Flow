import RequesterLayout from "@/components/layouts/RequesterLayout";
import RequesterLogin from "@/pages/requester/auth/RequesterLogin";
import RequesterRegister from "@/pages/requester/auth/RequesterRegister";
import RequesterDashboard from "@/pages/requester/page/RequesterDashboard";
import MyRequests from "@/pages/requester/page/MyRequests";
import RequestDetails from "@/pages/requester/page/RequestDetails";
// import NewRequest from "@/pages/requester/page/NewRequest";

export const requesterRoutes = [
  { path: "/requester/login", element: <RequesterLogin /> },
  { path: "/requester/register", element: <RequesterRegister /> },
  {
    path: "/requester",
    element: <RequesterLayout />, // ← Layout wraps all protected pages
    children: [
      { path: "dashboard", element: <RequesterDashboard /> },
      { path: "requests", element: <MyRequests /> },
      { path: "requests/:id", element: <RequestDetails /> },
      // { path: "new-request", element: <NewRequest /> },
    ],
  },
];
