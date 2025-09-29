import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import { AuthProvider } from "~/lib/auth";
import { ThemeProvider } from "~/lib/ThemeProvider";
import { ClientThemeHandler } from "~/components/ClientThemeHandler";
import { PWAInstallPrompt } from "~/components/PWAInstallPrompt";
import "./app.css";
import "./lib/i18n";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
  { rel: "apple-touch-icon-precomposed", href: "/icons/apple-touch-icon.png" },
  { rel: "mask-icon", href: "/icons/apple-touch-icon.png", color: "#10B981" },
  { rel: "manifest", href: "/manifest.webmanifest" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="theme-color" content="#10B981" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#10B981" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#059669" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TrackServ" />
        <meta name="application-name" content="TrackServ" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TrackServ" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10B981" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
        <meta name="description" content="Gestión de comisiones de proveedores de servicios" />
        <meta name="keywords" content="comisiones, proveedores, servicios, TrackServ" />
        <meta name="og:title" content="TrackServ" />
        <meta name="og:description" content="Gestión de comisiones de proveedores de servicios" />
        <meta name="og:image" content="/favicon.ico" />
        <meta name="og:url" content="https://trackserv.com" />
        <meta name="og:type" content="website" />


        <title>TrackServ</title>
        <Meta />
        <Links />
        
      </head>
      <body className="ios-safe-area app-container">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {

  useEffect(() => {
    // iOS Safari address bar hiding - only in standalone mode
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && window.matchMedia('(display-mode: standalone)').matches) {
      const hideAddressBar = () => {
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 100);
      };
      
      // Hide address bar on load
      hideAddressBar();
      
      // Hide address bar on orientation change
      window.addEventListener('orientationchange', hideAddressBar);
      
      return () => {
        window.removeEventListener('orientationchange', hideAddressBar);
      };
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientThemeHandler />
        <PWAInstallPrompt />
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
