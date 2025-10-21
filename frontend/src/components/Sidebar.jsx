import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  // 1. Get the 'auth' object
  const { auth } = useAuth();

  const menu = {
    user: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Mood Tracking", to: "/mood" },
      { label: "Alerts", to: "/alerts" },
    ],
    guardian: [
      { label: "Dashboard", to: "/guardian" },
      { label: "Reports", to: "/reports" },
      { label: "Alerts", to: "/alerts" },
    ],
    doctor: [
      { label: "Dashboard", to: "/doctor" },
      { label: "Patients", to: "/patients" },
      { label: "Reports", to: "/reports" },
    ],
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <nav className="space-y-2">
        {/* 2. Check for auth.user and use auth.user.role */}
        {auth && auth.user &&
          menu[auth.user.role]?.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-4 py-2 rounded hover:bg-blue-100"
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}