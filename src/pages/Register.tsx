import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import CustomTheme from "@/components/CustomTheme";
import { UserPlus } from "lucide-react";
import { toast } from 'sonner'
import { useEffect, useState } from "react";
import { useReward } from 'react-rewards';

interface FormData {
    username: string;
    email: string;
    password: string;
    repeatPassword: string
}

interface PasswordValidation {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    passwordsMatch: boolean
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
        repeatPassword: ""
    })

    const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        passwordsMatch: false
    })

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);
    const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confettiReward', 'confetti');
    const navigate = useNavigate();

    useEffect(() => {
        validatePassword(formData.password, formData.repeatPassword);
    }, [formData.password, formData.repeatPassword]);

    const validatePassword = (password: string, repeatPassword: string) => {
        setPasswordValidation({
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            passwordsMatch: password === repeatPassword && password !== ''
        })
    }

    const isPasswordValid = () => {
        return Object.values(passwordValidation).every(value => value === true);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isPasswordValid()) {
            setErrors("senha lixo")
            toast.error('senha lixo', {
                duration: 3000,
                position: "top-center"
            })
            return;
        }

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
            setErrors(null);
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
                    <div className="space-y-2">
                        <ul className="text-sm text-muted-foreground">
                            <li className={passwordValidation.minLength ? "text-green-500" : ""}>
                                ✓ Mínimo de 8 caracteres
                            </li>
                            <li className={passwordValidation.hasUpperCase ? "text-green-500" : ""}>
                                ✓ Pelo menos uma letra maiúscula
                            </li>
                            <li className={passwordValidation.hasLowerCase ? "text-green-500" : ""}>
                                ✓ Pelo menos uma letra minúscula
                            </li>
                            <li className={passwordValidation.hasNumber ? "text-green-500" : ""}>
                                ✓ Pelo menos um número
                            </li>
                            <li className={passwordValidation.hasSpecialChar ? "text-green-500" : ""}>
                                ✓ Pelo menos um caractere especial
                            </li>
                            <li className={passwordValidation.passwordsMatch ? "text-green-500" : ""}>
                                ✓ As senhas coincidem
                            </li>
                        </ul>
                    </div>
                    {errors && (
                        <p className="text-destructive text-sm text-center">{errors}</p>
                    )}
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