import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("auth", "routes/auth.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("setup", "routes/setup.tsx"),
  
  // Services routes (simplified)
  route("services", "routes/services.tsx"),
  route("services/new", "routes/services.new.tsx"),
  
  // Clients route
  route("clients", "routes/clients.tsx"),
  
  // Report route
  route("report", "routes/report.tsx"),
] satisfies RouteConfig;
