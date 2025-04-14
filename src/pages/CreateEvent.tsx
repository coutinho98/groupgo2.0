import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, ArrowLeft } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import CustomTheme from '@/components/CustomTheme';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface EventData {
  name: string;
  guests: string[];
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();

  const [eventName, setEventName] = useState('');
  const [participant, setParticipant] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddParticipant = () => {
    if (participant && !participants.includes(participant)) {
      setParticipants([...participants, participant]);
      setParticipant('');
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Usuário não autenticado. Faça login novamente.');
      navigate('/');
      setLoading(false);
      return;
    }

    const eventData: EventData = {
      name: eventName,
      guests: participants,
    };

    try {
      console.log("Dados enviados ao backend:", eventData);
      const response = await fetch('https://groupgo.onrender.com/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar o evento');
      }

      toast.success('Evento criado com sucesso!');
      navigate('/event');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error(error || 'Erro ao criar o evento');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-roboto">
      <CustomTheme />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-[var(--background)]">
          <div className="max-w-lg">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              onClick={() => navigate('/perfil')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>

            <h1 className="text-2xl font-medium text-[var(--foreground)] mb-6">Criar Evento</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Nome do Evento</label>
                <Input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Digite o nome do evento"
                  className="bg-[var(--muted)]/50 text-[var(--foreground)] border-[var(--border)]"
                  required
                />
              </div>

              {/*   <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Data do Evento</label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-[var(--muted)]/50 text-[var(--foreground)] border-[var(--border)]"
                  required
                />
              </div> */}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Participantes</label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={participant}
                    onChange={(e) => setParticipant(e.target.value)}
                    placeholder="Digite o e-mail do participante"
                    className="bg-[var(--muted)]/50 text-[var(--foreground)] border-[var(--border)]"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                    onClick={handleAddParticipant}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {participants.map((email) => (
                    <div
                      key={email}
                    >
                      <HoverCard>
                        <HoverCardTrigger><button
                          type="button"
                          onClick={() => handleRemoveParticipant(email)}
                          className='cursor-pointer'
                        >
                          <Badge>{email} </Badge>
                        </button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          deseja remover {email}?
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="text-[var(--destructive)] text-sm">{error}</p>}

              <Button
                type="submit"
                className="cursor-pointer w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Evento'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}