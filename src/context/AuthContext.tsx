import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

interface UserProfile {
  username: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://groupgo.onrender.com/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Token inválido ou expirado.");
        }
        throw new Error(responseData.message || "Erro ao buscar dados do usuário.");
      }

      const data: UserProfile = responseData;
      setUser(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar usuário.';
      setError(errorMessage);
      setUser(null);
      localStorage.removeItem("token");
      if (!["/", "/register", "/forgot-password"].includes(location.pathname)) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://groupgo.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Erro ao autenticar.";
        if (response.status === 404) {
          throw new Error("E-mail não encontrado.");
        } else if (response.status === 401) {
          throw new Error("Senha incorreta.");
        } else if (response.status === 400 && errorMessage.includes("password")) {
          throw new Error("Senha incorreta.");
        } else {
          throw new Error(errorMessage);
        }
      }

      if (!data.access_token) {
        throw new Error("Token não recebido na resposta da API.");
      }

      localStorage.setItem("token", data.access_token);
      await fetchUserData(data.access_token);
      navigate("/perfil");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao fazer login.';
      setError(errorMessage);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetchUserData(token);
    } else if (!token && !["/", "/register", "/forgot-password"].includes(location.pathname)) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};