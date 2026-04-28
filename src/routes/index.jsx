// import AuthLayout from "@/components/layouts/AuthLayout";
import { dispatcherRoutes } from "./dispatcherRoutes";
import { requesterRoutes } from "./requesterRoutes";

export const appRoutes = [
  {
    // element: <AuthLayout />,
    children: [...requesterRoutes, ...dispatcherRoutes],
  },
];
