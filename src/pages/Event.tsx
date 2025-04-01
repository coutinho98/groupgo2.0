import { useState, useEffect } from 'react';

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
                setError(err instanceof Error ? err.message : 'deu erro na bagaça');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 ">dados brutos</h1>
            <pre className="bg-black text-white p-4 rounded-lg overflow-auto">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}