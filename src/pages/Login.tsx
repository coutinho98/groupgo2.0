import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { UsersRound } from "lucide-react";
import CustomTheme from "@/components/CustomTheme";
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from "sonner";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('https://groupgo.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: formData.email,
                    password: formData.password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                const token = data.access_token;

                login(token, formData.rememberMe);

                setTimeout(() => {
                    navigate('/perfil');
                }, 500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'falha');
                toast('Falha ao fazer login', {
                    action: {
                        label: "Undo",
                        onClick: () => console.log("undo")
                    }
                });
            }
        } catch (err) {
            toast('Falha ao fazer login', {
                description: 'Erro de servidor',
                duration: 3000,
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground relative">
            <Toaster richColors position="top-center" />
            <CustomTheme />
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center flex flex-col items-center">
                    <UsersRound className="h-20 w-20 mb-10 text-foreground" />
                    <h1 className="text-5xl">GroupGo</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-muted/50"
                        required
                    />
                    <div className="space-y-1">
                        <Input
                            type="password"
                            placeholder="Senha"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-muted/50"
                            required
                        />
                        <p className="text-right text-sm text-muted-foreground">
                            <Link
                                to="/forgot-password"
                                className="text-primary font-bold hover:underline"
                            >
                                Esqueceu a senha?
                            </Link>
                        </p>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-sm text-muted-foreground">Lembre de mim</label>
                    </div>
                    <Button type="submit" className="w-full">
                        Entrar
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link to="/register" className="text-primary font-bold hover:underline">
                        Inscrever-se
                    </Link>
                </p>
            </div>
        </div>
    );
}