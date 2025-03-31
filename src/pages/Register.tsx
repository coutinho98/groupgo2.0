import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import CustomTheme from "@/components/CustomTheme";
import { UserPlus } from "lucide-react";

export default function Register() {

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
            <CustomTheme />
            <div className="w-full max-w-sm space-y-4">
                <div className="text-center flex flex-col items-center">
                    <UserPlus className="h-20 w-20 mb-10 text-foreground" />
                    <h1 className="text-5xl">Criar Conta</h1>
                </div>
                <form className="space-y-4">
                    <Input type="email" placeholder="Email" className="bg-muted/50" />
                    <Input type="password" placeholder="Senha" className="bg-muted/50" />
                    <Input type="password" placeholder="Repetir Senha" className="bg-muted/50" />
                    <Button type="submit" className="w-full">
                        Inscrever-se
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