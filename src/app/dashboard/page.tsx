'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/actions/authcontext';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { Plus, X } from 'lucide-react';

// Nossas actions e componentes
import TaskForm from '@/components/tasks/TaskForm'; // O formulário que criamos
import { createTaskAction } from '@/lib/actions/taskActions';
import { type TaskFormData } from '@/lib/validations/formschema';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proteção de Rota
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Função para lidar com a CRIAÇÃO da tarefa
  const handleCreateTask = async (data: TaskFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para criar uma tarefa.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Pega o token
      const token = await user.getIdToken();
      // 2. Chama a Server Action de criação
      const result = await createTaskAction(data, token);

      if (result.success) {
        toast.success(result.message || 'Tarefa criada com sucesso!');
        setIsModalOpen(false); // Fecha o modal
        // Você pode adicionar uma função para 'revalidar' os dados do dashboard aqui
      } else {
        toast.error(result.error || 'Falha ao criar tarefa.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o formulário.');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null; // A proteção de rota cuidará do redirecionamento
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <main className="container mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard Principal
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={18} />
            Nova Tarefa
          </button>
        </div>

        {/* --- ÁREA DOS GRÁFICOS (REQUISITO 4) --- */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Métricas
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Aqui é onde você vai inserir os componentes do TREMOR 
              (Requisito 4)
              Ex: <Card>, <BarChart>, <DonutChart>
            */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-gray-500">Tarefas Pendentes</h3>
              <p className="text-3xl font-bold">12</p>
              {/* TODO: Carregar dados reais */}
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-gray-500">Concluídas na Semana</h3>
              <p className="text-3xl font-bold">5</p>
              {/* TODO: Carregar dados reais */}
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-gray-500">Tarefas Vencidas</h3>
              <p className="text-3xl font-bold text-red-600">2</p>
              {/* TODO: Carregar dados reais */}
            </div>
          </div>
          
          <div className="mt-6 rounded-lg bg-white p-6 shadow">
             <h3 className="text-lg font-semibold mb-4">Gráfico de Tarefas (Placeholder)</h3>
             {/* <BarChart ... /> (TREMOR VAI AQUI) */}
             <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                <p className="text-gray-500">Gráfico do Tremor (Req 4)</p>
             </div>
          </div>
        </div>
      </main>

      {/* --- Modal de Criação de Tarefa --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Criar Nova Tarefa</h2>

            <TaskForm
              onFormSubmit={handleCreateTask}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </>
  );
}