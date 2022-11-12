import { createContext, FC, ReactNode, useContext, useState } from 'react';

export interface AutoConnectContextState {
    autoConnect: boolean;
    handleAutoConnect(checked: boolean): void;
}

export const AutoConnectContext = createContext<AutoConnectContextState>({} as AutoConnectContextState);

export function useAutoConnect(): AutoConnectContextState {
    return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [autoConnect, setAutoConnect] = useState<boolean>(() => {
      if (typeof window !== 'undefined') {
        const value = JSON.parse(localStorage.getItem('auto-connect'))
  
        if (value) return value
      }

      return false
    });


  const handleAutoConnect = (checked: boolean) => {
    localStorage.setItem('auto-connect', JSON.stringify(checked))
    setAutoConnect(checked)
  }

    return (
        <AutoConnectContext.Provider value={{ autoConnect, handleAutoConnect }}>{children}</AutoConnectContext.Provider>
    );
};
