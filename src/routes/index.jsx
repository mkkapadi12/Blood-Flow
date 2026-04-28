import dispatcherRoutes from "./dispatcherRoutes";
import requesterRoutes from "./requesterRoutes";

const appRoutes = [...requesterRoutes, ...dispatcherRoutes];

export default appRoutes;
