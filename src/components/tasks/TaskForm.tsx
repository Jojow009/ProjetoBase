'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '@/lib/validations/formschema';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// NOTA: Você precisará instalar e configurar o ShadCN UI 
// para 'Button', 'Input', 'Label', 'Textarea', 'Select', 'Popover', 'Calendar'
// Por enquanto, usarei classes genéricas do Tailwind.
// Recomendo usar os componentes do ShadCN ou Tailwind nativo.

interface TaskFormProps {
  // Se 'defaultValues' for fornecido, o formulário está em modo "Edição"
  defaultValues?: Partial<TaskFormData>;
  // A função que será chamada no submit
  onFormSubmit: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function TaskForm({
  defaultValues,
  onFormSubmit,
  isLoading = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Usaremos para a data
    watch, // Usaremos para a data
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      ...defaultValues,
      // Garante que a data esteja no formato YYYY-MM-DD para o input
      dueDate: defaultValues?.dueDate
        ? format(new Date(defaultValues.dueDate), 'yyyy-MM-dd')
        : '',
    },
  });

  // Função interna para lidar com o loading
  const onSubmit = async (data: TaskFormData) => {
    await onFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Título */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Título da Tarefa
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descrição (Opcional)
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Data de Vencimento */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Data de Vencimento
          </label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        {/* Prioridade */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Prioridade
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      {/* NOTA: O 'status' e 'subtasks' (Req 5) não estão neste formulário
        base. Adicionaremos o 'status' na página de detalhes (Req 8)
        e as sub-tarefas em uma atualização futura.
      */}

      {/* Botão de Submit */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
        >
          {isLoading
            ? 'Salvando...'
            : defaultValues
            ? 'Salvar Alterações'
            : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
}