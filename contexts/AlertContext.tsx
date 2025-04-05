"use client"
import { createContext, useState, useContext, ReactNode } from "react";

// Definição dos tipos do alerta
type AlertType = "success" | "danger" | "default" | "primary" | "secondary" | "warning" | undefined;

interface AlertContextProps {
  mensagem: string | null;
  tipoAlerta: AlertType;
  showAlert: (mensagem: string, tipo: AlertType) => void;
  hideAlert: () => void;
}

// Criando o contexto do alerta
const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// Hook para usar o contexto do alerta em qualquer página
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert deve ser usado dentro de um AlertProvider");
  }
  return context;
};

// Provedor do alerta (envOLVE toda a aplicação)
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoAlerta, setTipoAlerta] = useState<AlertType>(undefined);

  const showAlert = (msg: string, tipo: AlertType) => {
    setMensagem(msg);
    setTipoAlerta(tipo);
    
    // Remove o alerta automaticamente após 3 segundos
    setTimeout(() => {
      setMensagem(null);
      setTipoAlerta(undefined);
    }, 3000);
  };

  const hideAlert = () => {
    setMensagem(null);
    setTipoAlerta(undefined);
  };

  return (
    <AlertContext.Provider value={{ mensagem, tipoAlerta, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
