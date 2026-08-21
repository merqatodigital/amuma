import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type TenantContext = {
  siteId: string | null;
  siteSlug: string | null;
  isPlatform: boolean;
};

/**
 * Resolves the current tenant from the request hostname.
 *
 * - "merqato.digital" or "www.merqato.digital" → platform (no tenant)
 * - "myrestaurant.merqato.digital" → tenant slug "myrestaurant"
 * - "custom.com" → custom domain lookup (handled in store)
 */
export const tenantMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const host = request?.headers?.get("host") ?? "";
    const hostname = host.split(":")[0]; // strip port

    const BASE_DOMAINS = [
      "merqato.digital",
      "www.merqato.digital",
      "localhost",
    ];

    // Platform routes — no tenant
    const isPlatform = BASE_DOMAINS.some(
      (d) => hostname === d || hostname === `www.${d}`,
    );

    let siteSlug: string | null = null;

    if (!isPlatform && hostname) {
      // Extract subdomain: "myrestaurant.merqato.digital" → "myrestaurant"
      const parts = hostname.split(".");
      if (parts.length >= 3) {
        siteSlug = parts[0];
      } else if (parts.length === 2) {
        // Could be a custom domain — handle later in store
        siteSlug = null;
      }
    }

    return next({
      context: {
        tenant: {
          siteId: null, // resolved in store after DB lookup
          siteSlug,
          isPlatform,
        } satisfies TenantContext,
      },
    });
  },
);
