import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
const { PROD } = import.meta.env;

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            {
                !PROD &&
                <TanStackRouterDevtools />
            }
        </>
    )
})