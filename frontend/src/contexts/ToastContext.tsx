import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

type ToastType = "success" | "error";

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={styles.toastContainer}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            style={{
              ...styles.toast,
              ...(toast.type === "success" ? styles.toastSuccess : styles.toastError)
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  toastContainer: {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 9999,
    pointerEvents: "none", // Toasts shouldn't block clicks beneath them
  },
  toast: {
    padding: "12px 24px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    pointerEvents: "auto",
    animation: "slideUp 0.3s ease-out forwards",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  },
  toastError: {
    backgroundColor: "#ef4444",
  },
  toastSuccess: {
    backgroundColor: "#10b981",
  }
};

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
