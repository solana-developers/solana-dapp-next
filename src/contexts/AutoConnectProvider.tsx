import { createContext, Dispatch, FC, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';

export interface AutoConnectContextState {
    autoConnect: boolean;
    setAutoConnect: Dispatch<SetStateAction<boolean>>;
}

export const AutoConnectContext = createContext<AutoConnectContextState>({} as AutoConnectContextState);

export function useAutoConnect(): AutoConnectContextState {
    return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [autoConnect, setAutoConnect] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false
          const value = localStorage.getItem('auto-connect')
    
          return value ? JSON.parse(value) : false
    });

    useEffect(() => {
        localStorage.setItem('auto-connect', JSON.stringify(autoConnect))
    },[autoConnect])

    return (
        <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>{children}</AutoConnectContext.Provider>
    );
};
