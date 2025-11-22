// /components/tasks/ProgressBar.tsx

"use client";

import { useMemo } from "react";
import { type SubtaskFormData } from "@/lib/validations/formschema";

interface ProgressBarProps {
  subtasks: SubtaskFormData[];
}

export default function ProgressBar({ subtasks }: ProgressBarProps) {
  const { completed, total, percentage } = useMemo(() => {
    const total = subtasks.length;
    const completed = subtasks.filter((s) => s.completed).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  }, [subtasks]);

  if (total === 0) {
    return null; // Não mostra a barra se não houver sub-tarefas
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-indigo-700">
          Progresso da Sub-tarefa
        </span>
        <span className="text-sm font-medium text-indigo-700">
          {completed} de {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}