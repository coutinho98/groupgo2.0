import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { UsersRound } from "lucide-react";
import CustomTheme from "@/components/CustomTheme"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground relative">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/50"
                        required
                    />
                    <div className="space-y-1">
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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