import { useState, useEffect } from 'react';
import { Crown, Loader2, Calendar, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CustomTheme from '@/components/CustomTheme';
import { Badge } from '@/components/ui/badge';

interface User {
    id: string;
    username: string;
    name: string | null;
    nickname: string;
    email: string;
    password: string;
    created_at: string;
}

interface ManagedEvent {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    admin: User;
    guests?: User[];
}

interface GuestEvent {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    guests: User[];
}

interface ApiResponse {
    managedEvents: ManagedEvent[];
    guestEvents: GuestEvent[];
}

export default function Events() {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://groupgo.onrender.com/event', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const rawData: ApiResponse = await response.json();
                setData(rawData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while fetching events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const allEvents = [
        ...(data?.managedEvents || []).map(event => ({ ...event, isManaged: true })),
        ...(data?.guestEvents || []).map(event => ({ ...event, isManaged: false })),
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando os eventos</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-card-foreground mb-2">Error</h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <div className="fixed top-0 left-0 h-screen w-64 bg-sidebar shadow-lg">
                <Sidebar />
            </div>

            <div className="flex-1 ml-64 p-8">
                <CustomTheme />
                <div className="w-full">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Meus Eventos</h1>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allEvents.length > 0 ? (
                            allEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-border"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                                                {event.name}
                                                {event.isManaged && (
                                                    <Crown className="h-5 w-5 text-primary" />
                                                )}
                                            </h2>
                                        </div>

                                        <div className="space-y-4">
                                            {event.isManaged && 'admin' in event && (
                                                <div className="flex items-center text-muted-foreground">
                                                    <Badge>
                                                        @{event.admin.username}
                                                    </Badge>
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center text-muted-foreground mb-2">
                                                </div>
                                            </div>
                                            <div className="flex items-center text-muted-foreground justify-between">
                                                <Badge variant="secondary">
                                                    <p>20 DEZ, 17:00</p>
                                                </Badge>
                                                {event.guests && event.guests.length > 0 ? (
                                                    <div className="pl-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            {event.guests.map((guest) => (
                                                                <span
                                                                    key={guest.id}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                                                                >
                                                                    {guest.username}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground pl-6">Sem convidados</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-left py-12">
                                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum evento encontrado</h3>
                                <p className="text-muted-foreground">Crie seu primeiro evento para começar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}