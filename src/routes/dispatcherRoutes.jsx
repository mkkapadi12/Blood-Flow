import DispatcherLogin from "@/page/dispatcher/auth/Login";
import DispatcherRegister from "@/page/dispatcher/auth/Register";
import Dashboard from "@/page/dispatcher/page/Dashboard";
import SingleRequest from "@/page/dispatcher/page/singleRequest";

const dispatcherRoutes = [
  {
    path: "/dispatcher/login",
    element: <DispatcherLogin />,
  },
  {
    path: "/dispatcher/register",
    element: <DispatcherRegister />,
  },
  {
    path: "/dispatcher/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dispatcher/requests/:id",
    element: <SingleRequest />,
  },
];

export default dispatcherRoutes;
