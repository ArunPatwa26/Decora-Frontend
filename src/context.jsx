import { createContext, useContext } from "react";

export const BackendContext = createContext();

// Backend URL from `.env` file
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://decora-backend.vercel.app";

export const BackendProvider = ({ children }) => {
  return (
    <BackendContext.Provider value={{ BACKEND_URL }}>
      {children}
    </BackendContext.Provider>
  );
};

// Custom Hook to use Backend URL
export const useBackend = () => {
  return useContext(BackendContext);
};
