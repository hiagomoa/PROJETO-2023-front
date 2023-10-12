import { getSession } from "next-auth/react";
import { checkPermission } from "./checkPermission";

export function withPermission(handler, role) {
  return async (ctx) => {
    const session = await getSession(ctx);

    if (!session || !checkPermission(session.user, role)) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return await handler(ctx);
  };
}
