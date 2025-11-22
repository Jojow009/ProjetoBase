"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/lib/actions/authcontext";
import { useRouter } from "next/navigation";
// As actions já estão importadas
import { getTasksAction, updateTaskStatusAction } from "@/lib/actions/taskActions";
import { type TaskFormData } from "@/lib/validations/formschema";

// --- Tipos ---
type TaskStatus = "todo" | "doing" | "done";
type Task = TaskFormData & { id: string; createdAt: any; userId: string };
type Columns = Record<TaskStatus, Task[]>;

// --- Componente 1: TaskCard (Sem alterações) ---
function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  const priorityColors = {
    baixa: "border-l-green-500",
    média: "border-l-yellow-500",
    alta: "border-l-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-white rounded-lg shadow border-l-4 ${
        priorityColors[task.priority]
      } mb-4 touch-none`}
    >
      <h3 className="font-semibold text-slate-800">{task.title}</h3>
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
        {task.description || "Sem descrição"}
      </p>
      <p className="text-xs text-slate-400 mt-2">{task.dueDate}</p>
    </div>
  );
}

// --- Componente 2: KanbanColumn (Sem alterações) ---
function KanbanColumn({ title, status, tasks }: { title: string; status: TaskStatus; tasks: Task[] }) {
  return (
    <div className="flex-1 p-4 bg-slate-100 rounded-lg min-h-[400px]">
      <h2 className="text-lg font-bold text-slate-700 mb-4 capitalize">{title}</h2>
      <SortableContext
        id={status}
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

// --- Componente 3: A Página Principal do Kanban ---
export default function KanbanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  const [columns, setColumns] = useState<Columns>({
    todo: [],
    doing: [],
    done: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- CORRIGIDO: Busca de Dados ---
  const fetchTasks = async () => {
    // Só busca se o usuário estiver carregado e logado
    if (!user) {
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
        const allTasks = result.data as Task[];
        setColumns({
          todo: allTasks.filter((t) => t.status === "todo"),
          doing: allTasks.filter((t) => t.status === "doing"),
          done: allTasks.filter((t) => t.status === "done"),
        });
      } else {
        toast.error(result.error || "Falha ao buscar tarefas.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de autenticação ao buscar tarefas.");
    }
    setIsLoadingTasks(false);
  };

  // Proteção da rota e busca inicial (Sem alterações)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);


  // --- CORRIGIDO: Lógica do Drag-and-Drop (onDragEnd) ---
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Se não soltou sobre uma coluna válida, não faz nada
    if (!over) return;
    
    // CORRIGIDO: Precisa estar logado para mover
    if (!user) {
      toast.error("Você precisa estar logado para mover tarefas.");
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const oldStatus = Object.keys(columns).find((status) =>
      columns[status as TaskStatus].some((task) => task.id === taskId)
    ) as TaskStatus | undefined;

    if (!oldStatus || oldStatus === newStatus) {
      return;
    }

    // 1. Atualização Otimista (Muda o estado local IMEDIATAMENTE)
    setColumns((prev) => {
      const taskToMove = prev[oldStatus].find((t) => t.id === taskId);
      if (!taskToMove) return prev;
      const oldColumn = prev[oldStatus].filter((t) => t.id !== taskId);
      const newColumn = [...prev[newStatus], { ...taskToMove, status: newStatus }];
      return {
        ...prev,
        [oldStatus]: oldColumn,
        [newStatus]: newColumn,
      };
    });

    // 2. Chama a Server Action (em segundo plano)
    try {
      // 1. Pega o token
      const token = await user.getIdToken();
      // 2. Passa o token para a action
      const result = await updateTaskStatusAction(taskId, newStatus, token);

      // 3. Trata o resultado
      if (result.success) {
        toast.success("Tarefa movida!");
      } else {
        toast.error(result.error || "Falha ao salvar. Atualizando...");
        fetchTasks(); // Se falhar, reverte a UI
      }
    } catch (error) {
      toast.error("Erro ao salvar. Atualizando...");
      fetchTasks(); // Reverte em caso de erro
    }
  }
  
  // --- Renderização da Página (Sem alterações) ---
  if (loading || isLoadingTasks) {
    return <div className="flex h-screen items-center justify-center"><p>Carregando...</p></div>;
  }
  
  return (
    <>
      <Toaster richColors position="top-right" />
      <main className="container mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Quadro Kanban
        </h1>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <KanbanColumn title="A Fazer" status="todo" tasks={columns.todo} />
            <KanbanColumn title="Fazendo" status="doing" tasks={columns.doing} />
            <KanbanColumn title="Concluído" status="done" tasks={columns.done} />
          </div>
        </DndContext>
      </main>
    </>
  );
}