import { AuthProvider } from "./context/AuthContext";
import { LayoutProvider } from "./context/LayoutContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <LayoutProvider><AppRoutes /></LayoutProvider>
    </AuthProvider>
  );
}
