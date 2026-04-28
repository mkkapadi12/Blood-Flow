import RequesterLogin from "@/page/requester/auth/RequesterLogin";
import RequesterRegister from "@/page/requester/auth/RequesterRegister";
import Dashboard from "@/page/requester/page/Dashboard";
import MyRequests from "@/page/requester/page/MyRequests";
import RequestDetails from "@/page/requester/page/RequestDetails";

const requesterRoutes = [
  {
    path: "/requester/register",
    element: <RequesterRegister />,
  },
  {
    path: "/requester/login",
    element: <RequesterLogin />,
  },
  {
    path: "/requester/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/requester/requests",
    element: <MyRequests />,
  },
  {
    path: "/requester/requests/:id",
    element: <RequestDetails />,
  },
];

export default requesterRoutes;
