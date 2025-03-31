import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import CustomTheme from "@/components/CustomTheme";
import { UserPlus } from "lucide-react";
import { toast } from 'sonner'
import { useState } from "react";
import { useReward } from 'react-rewards';

interface FormData {
    username: string;
    email: string;
    password: string;
    repeatPassword: string
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
        repeatPassword: ""
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);
    const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confettiReward', 'confetti');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("https://groupgo.onrender.com/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            setIsLoading(false);

            if (response.ok) {
                const data: { token: string } = await response.json();
                console.log(data);

                setTimeout(() => {
                    toast.success("conta criada", {
                        duration: 3000,
                        position: "top-center"
                    });
                    confettiReward();

                    setTimeout(() => {
                        navigate('/perfil');
                    }, 3500)
                }, 500)
            } else {
                const errorData: { message?: string } = await response.json();
                setErrors(errorData.message || 'Falha ao criar conta');
                toast.error(errorData.message || 'Falha ao criar conta', {
                    duration: 3000,
                    position: "top-center"
                });
            }
        } catch (err) {
            setIsLoading(false);
            setErrors('Erro no servidor');
            toast.error('Erro no servidor', {
                duration: 3000,
                position: "top-center"
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
            <CustomTheme />
            <div className="w-full max-w-sm space-y-4">
                <div className="text-center flex flex-col items-center">
                    <UserPlus className="h-20 w-20 mb-10 text-foreground" />
                    <h1 className="text-5xl">Criar Conta</h1>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        name="username"
                        placeholder="Usuário"
                        className="bg-muted/50"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="bg-muted/50"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="bg-muted/50"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="repeatPassword"
                        placeholder="Repetir Senha"
                        className="bg-muted/50"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        required
                    />
                    <Button disabled={isConfettiAnimating} type="submit" className="w-full cursor-pointer">
                        Inscrever-se
                        <span id="confettiReward" />
                    </Button>
                </form>
                <p className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link to="/" className="text-primary font-bold hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}