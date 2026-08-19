import { createContext, useContext, useMemo, useState } from "react";

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const value = useMemo(
    () => ({ navigationOpen, openNavigation: () => setNavigationOpen(true), closeNavigation: () => setNavigationOpen(false), toggleNavigation: () => setNavigationOpen((open) => !open) }),
    [navigationOpen],
  );
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
}
