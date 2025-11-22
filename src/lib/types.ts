// Em /lib/types.ts

// Interface para Sub-tarefa
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// Interface para Tarefa Principal
export interface Task {
  id: string; // ID do documento no Firestore
  userId: string; // UID do usuário dono da tarefa
  title: string;
  description: string;
  dueDate: string; // ou Timestamp, se preferir
  priority: 'baixa' | 'média' | 'alta';
  status: 'todo' | 'doing' | 'done'; // Para o Kanban
  subtasks: Subtask[];
  createdAt: any; // Firestore Timestamp
}