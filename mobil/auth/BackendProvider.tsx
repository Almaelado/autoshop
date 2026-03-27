import React, { createContext, useContext, useState } from "react";
import { api } from "@/api/api";

type BackendContextType = {
  backendUrl: string;
  setBackendUrl: (url: string) => void;
};

const BackendContext = createContext<BackendContextType | null>(null);

export function BackendProvider({ children }: { children: React.ReactNode }) {
  const [backendUrl, setBackendUrlState] = useState("");

  const setBackendUrl = (url: string) => {
    // A felhasznalo altal beirt backend cim az axios instance-re is rogton raul.
    setBackendUrlState(url);
    api.defaults.baseURL = url;
  };

  return (
    <BackendContext.Provider value={{ backendUrl, setBackendUrl }}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const ctx = useContext(BackendContext);
  if (!ctx) throw new Error("useBackend must be inside BackendProvider");
  return ctx;
}
