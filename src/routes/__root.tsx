import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { PostHogProvider, usePostHog } from "posthog-js/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { TabBar } from "@/components/TabBar";
import { currentAccount, onAccountChange, type AuthAccount } from "@/lib/auth";
import { startSync } from "@/lib/sync";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const posthog = usePostHog();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    posthog?.captureException?.(error, {
      boundary: "tanstack_root_error_component",
    });
    posthog?.logger?.error?.("root route error boundary rendered", {
      boundary: "tanstack_root_error_component",
    });
  }, [error, posthog]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Bloom" },
      { name: "theme-color", content: "#f1eeea" },
      { title: "Bloom — Gym garden" },
      { name: "description", content: "Gym tracker that grows a flower garden with every workout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function PostHogIdentity() {
  const posthog = usePostHog();
  const identifiedAccountId = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog) return;
    let active = true;
    let receivedAuthStateChange = false;

    const syncIdentity = (account: AuthAccount | null) => {
      if (!active || !posthog) return;

      if (!account) {
        if (identifiedAccountId.current) {
          posthog.reset();
          identifiedAccountId.current = null;
        }
        return;
      }

      if (identifiedAccountId.current === account.id) return;

      if (identifiedAccountId.current) {
        posthog.reset();
      }

      posthog.identify(account.id, {
        email: account.email,
        first_name: account.firstName,
        last_name: account.lastName,
        name: account.fullName,
      });
      identifiedAccountId.current = account.id;
      posthog.logger.info("authenticated account session identified");
    };

    const unsubscribe = onAccountChange((account) => {
      receivedAuthStateChange = true;
      syncIdentity(account);
    });

    void currentAccount().then((account) => {
      if (!receivedAuthStateChange) syncIdentity(account);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [posthog]);

  return null;
}

function RootShell({ children }: { children: ReactNode }) {
  const projectToken =
    (import.meta.env["VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"] as string | undefined) ||
    "phc_rVYUkJtMt8LnjT5yANrynCFHK6ad5A4DTHQGTJyY92nB";
  const posthogHost =
    (import.meta.env["VITE_PUBLIC_POSTHOG_HOST"] as string | undefined) ||
    "https://us.i.posthog.com";
  const document = (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );

  if (!projectToken || !posthogHost) {
    if (typeof window !== "undefined" && import.meta.env.DEV) {
      console.warn(
        "PostHog project token or host is missing; skipping analytics initialization.",
      );
    }

    return document;
  }

  return (
    <PostHogProvider
      apiKey={projectToken}
      options={{
        api_host: posthogHost,
        defaults: "2025-05-24",
        capture_exceptions: true,
        debug: import.meta.env.DEV,
        logs: {
          serviceName: "garden-grow-fit-web",
          environment: import.meta.env.MODE,
        },
      }}
    >
      <PostHogIdentity />
      {document}
    </PostHogProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Keeps this phone and your account's copy of the garden in step.
  useEffect(() => startSync(), []);

  const app = (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto min-h-screen max-w-md pb-28 pt-[env(safe-area-inset-top)] font-sans">
        <Outlet />
      </div>
      <TabBar />
    </QueryClientProvider>
  );

  return app;
}
