import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  login: (newToken: string, rememberMe: boolean) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = (newToken: string, rememberMe: boolean): void => {
    setToken(newToken);
    if (rememberMe) {
      localStorage.setItem('authToken', newToken);
      sessionStorage.removeItem('authToken');
    } else {
      sessionStorage.setItem('authToken', newToken);
      localStorage.removeItem('authToken');
    }
  };

  const logout = (): void => {
    setToken(null);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  };

  const contextValue: AuthContextType = {
    token,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}