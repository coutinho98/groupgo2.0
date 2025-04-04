import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { UsersRound, Github, Mail } from "lucide-react";
import CustomTheme from "@/components/CustomTheme";
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from "sonner";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: formData.email, password: formData.password });
      toast('Login realizado com sucesso!', {
        duration: 3000,
      });
    } catch (err) {
      console.log("Erro capturado no Login.tsx:", err);
      const errorMsg = error || 'Erro desconhecido.';
      if (errorMsg.includes("E-mail")) {
        toast('Erro ao fazer login', {
          description: 'E-mail não encontrado. Verifique o e-mail digitado.',
          duration: 3000,
        });
      } else if (errorMsg.includes("Senha") || errorMsg.includes("password")) {
        toast('Erro ao fazer login', {
          description: 'Senha incorreta. Tente novamente.',
          duration: 3000,
        });
      } else {
        toast('Erro ao fazer login', {
          description: errorMsg,
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground relative">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
      <Toaster richColors position="top-center" />
      <CustomTheme />

      <Card className="relative w-full max-w-md p-8 space-y-6 bg-card/30 backdrop-blur-md border-muted/20">
        <div className="text-center flex flex-col items-center space-y-2">
          <div className="rounded-full bg-primary/10 p-4 backdrop-blur-sm">
            <UsersRound className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">GroupGo</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`bg-background/50 ${error && (error.includes("Senha") || error.includes("password")) ? 'border-destructive' : ''}`}
              required
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lembre de mim
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline font-bold"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="cursor-pointer w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="cursor-pointer bg-background/50 hover:bg-background/80">
            <Github className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline" className="cursor-pointer bg-background/50 hover:bg-background/80">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-primary hover:underline font-bold">
            Inscrever-se
          </Link>
        </p>
      </Card>
    </div>
  );
}