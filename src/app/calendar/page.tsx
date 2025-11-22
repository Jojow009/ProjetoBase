'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/actions/authcontext';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { X } from 'lucide-react';

// --- Imports do FullCalendar ---
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// CORRIGIDO: Tipos importados de '@fullcalendar/core'
import type { EventInput, EventClickArg } from '@fullcalendar/core';

// --- CSS CORRIGIDO ---
// 1. IMPORTAÇÃO DO CSS PRINCIPAL (CORE) - USANDO O CAMINHO CORRETO (@fullcalendar/core/main.css)
import '@fullcalendar/core/main.css';
// 2. IMPORTAÇÃO DO CSS DO PLUGIN DAYGRID - Caminho simplificado para o padrão
import '@fullcalendar/daygrid/main.css';
// 3. A linha errada "import '@fullcalendar/common/dist/main.css';" foi REMOVIDA/CORRIGIDA.


// --- Nossas Actions e Componentes ---
import { getTasksAction, updateTaskAction } from '@/lib/actions/taskActions';
import TaskForm from '@/components/tasks/TaskForm';
import { type TaskFormData } from '@/lib/validations/formschema';

// Tipo para a tarefa vinda do Firestore
type Task = TaskFormData & {
  id: string;
  createdAt: any; // idealmente: Timestamp | string
  userId: string;
};

// --- Componente da Página ---
export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- Estado do Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // --- 1. Busca de Dados ---
  const fetchTasks = async () => {
    if (!user) {
      // Só busca se o usuário estiver logado
      setIsLoadingTasks(false);
      return;
    }

    setIsLoadingTasks(true);
    try {
      // 1. Pega o token
      const token = await user.getIdToken();
      // 2. Passa o token para a action
      const result = await getTasksAction(token);

      if (result.success) {
        setTasks(result.data as Task[]);
      } else {
        toast.error(result.error || 'Falha ao buscar tarefas.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro de autenticação ao buscar tarefas.');
    }
    setIsLoadingTasks(false);
  };

  // Proteção de Rota
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);

  // --- 2. Formatar Tarefas para o Calendário ---
  const calendarEvents: EventInput[] = useMemo(() => {
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      date: task.dueDate,
      color:
        task.priority === 'alta'
          ? '#ef4444' // red-500
          : task.priority === 'média'
          ? '#f59e0b' // yellow-500
          : '#22c55e', // green-500
      extendedProps: { ...task },
    }));
  }, [tasks]);

  // --- 3. Ação de Clique no Evento ---
  const handleEventClick = (clickInfo: EventClickArg) => {
    const taskData = clickInfo.event.extendedProps as Task;
    setSelectedTask(taskData);
    setIsModalOpen(true);
  };

  // --- 4. Handler para Editar Tarefa (Modal) ---
  const handleUpdateTask = async (data: TaskFormData) => {
    if (!user || !selectedTask) {
      toast.error('Erro: Usuário não logado ou tarefa não selecionada.');
      return;
    }

    try {
      // 1. Pega o token
      const token = await user.getIdToken();
      // 2. Passa o ID da tarefa, os dados E o token
      const result = await updateTaskAction(selectedTask.id, data, token);

      if (result.success) {
        toast.success('Tarefa atualizada!');
        setIsModalOpen(false);
        fetchTasks(); // Atualiza o calendário
      } else {
        toast.error(result.error || 'Falha ao atualizar tarefa.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar a tarefa.');
    }
  };

  // --- 5. Renderização ---
  if (loading || isLoadingTasks) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <main className="container mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Calendário de Tarefas
        </h1>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek',
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto" // Deixa o calendário fluido
            locale="pt-br"
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
            }}
          />
        </div>
      </main>

      {/* --- Modal de Edição de Tarefa --- */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Editar Tarefa</h2>

            <TaskForm
              defaultValues={selectedTask}
              onFormSubmit={handleUpdateTask}
            />
          </div>
        </div>
      )}
    </>
  );
}