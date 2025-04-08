import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import CustomTheme from "@/components/CustomTheme";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from 'sonner'
import { useEffect, useState } from "react";
import { useReward } from 'react-rewards';
import { Card } from "@/components/ui/card";

interface FormData {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
}

interface PasswordValidation {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    passwordsMatch: boolean;
}

interface EmailValidation {
    hasValidFormat: boolean;
    hasDomain: boolean;
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

    const [emailValidation, setEmailValidation] = useState<EmailValidation>({
        hasValidFormat: false,
        hasDomain: false
    })

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);
    const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confettiReward', 'confetti', {
        elementCount: 50,
        elementSize: 17,
        colors: ['#00bba7', '#ff53ac', '#5733FF', '#b79700'],
        position: 'fixed',
        fps: 60,
        spread: 70,
        lifetime: 400,
    });
    const navigate = useNavigate();

    useEffect(() => {
        validatePassword(formData.password, formData.repeatPassword);
    }, [formData.password, formData.repeatPassword]);

    useEffect(() => {
        validateEmail(formData.email);
    }, [formData.email])

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

    const isEmailValid = () => {
        return Object.values(emailValidation).every(value => value === true);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const parts = email.split('.');
        const hasValidDomain = parts.length > 1 && parts[parts.length - 1].length >= 2;

        setEmailValidation({
            hasValidFormat: emailRegex.test(email),
            hasDomain: hasValidDomain
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isEmailValid()) {
            setErrors("O e-mail não é válido");
            toast.error("O e-mail não é válido", {
                duration: 3000,
                position: "top-center"
            });
            return;
        }

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
            <Card className="relative w-full max-w-md p-8 space-y-6 bg-card/30 backdrop-blur-md border-muted/20">
                <button>
                    <Link to="/">
                        <ArrowLeft className="" />
                    </Link>
                </button>
                <div className="text-center flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4 backdrop-blur-sm">
                        <UserPlus className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Criar Conta</h1>
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
            </Card>
        </div>
    );
}