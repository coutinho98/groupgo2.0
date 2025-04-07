import CustomTheme from "@/components/CustomTheme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground relative">
      <CustomTheme />
      <Card className="w-[400px] bg-card/30 backdrop-blur-md border-muted/20">
        <button>
          <Link to="/">
            <ArrowLeft className="ml-5" />
          </Link>
        </button>
        <CardHeader>
          <CardTitle className="text-4xl whitespace-nowrap">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Digite o e-mail ou @nomedeusuário para alterar sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">e-mail ou @nomedeusuario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="@nomedeusuario ou e-mail"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full cursor-pointer" type="submit">Avançar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}