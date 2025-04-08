import { Link, useLocation } from 'react-router';
import { Calendar, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';


export default function Sidebar() {
  const location = useLocation();
  const { user, loading, error, logout } = useAuth();

  const navigation = [
    {
      name: "Eventos",
      href: "/event",
      icon: Calendar,
    },
    {
      name: "Criar Evento",
      href: "/createEvent",
      icon: CalendarPlus,
    },
  ];

  if (loading) {
    return (
      <aside className="flex flex-col w-64 h-screen border-r border-[var(--border)] bg-[var(--background)]">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">GroupGo</h2>
          <p className="text-[var(--muted-foreground)]">Carregando...</p>
        </div>
      </aside>
    );
  }

  if (error || !user) {
    return (
      <aside className="flex flex-col w-64 h-screen border-r border-[var(--border)] bg-[var(--background)]">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">GroupGo</h2>
          <p className="text-[var(--destructive)]">{error || 'Usuário não autenticado'}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-64 h-screen border-r border-[var(--border)] bg-[var(--background)]">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">GroupGo</h2>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-[var(--secondary)] text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/50 hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src="https://github.com/coutinho98.png" />
            <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)]">CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">@{user.username}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer w-full border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          onClick={logout}
        >
          Sair
        </Button>
      </div>
    </aside>
  );
}