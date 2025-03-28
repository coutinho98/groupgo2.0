import { Sun, Moon, UsersRound } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "../context/ThemeProvider";

const CustomTheme = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="absolute top-4 right-4 flex items-center space-x-2" >
            <Sun className="h-5 w-5" />
            <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
            />
            <Moon className="h-5 w-5" />
        </div >
    )
}

export default CustomTheme;