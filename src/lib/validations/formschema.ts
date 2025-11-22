import { z } from "zod";

// --- Schemas de Autenticação ---

// Schema para o formulário de Login
export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

// Schema para o formulário de Cadastro (Signup)
export const signupSchema = z
  .object({
    name: z.string().min(3, "O nome é obrigatório"),
    email: z.string().email("Por favor, insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], // Caminho do campo que receberá a mensagem de erro
  });

// Schema para "Esqueci a Senha"
export const forgotPasswordSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido para recuperar sua senha."),
});

// --- Schemas do TaskFlow (Requisitos do Trabalho) ---

// Schema para Sub-tarefa (Requisito 5)
export const subtaskSchema = z.object({
  id: z.string().optional(), // ID pode não existir ao criar
  title: z.string().min(1, "O título da sub-tarefa é obrigatório."),
  completed: z.boolean().default(false),
});

// Schema para Tarefa (Requisito 5)
export const taskSchema = z.object({
  id: z.string().optional(), // ID do documento
  title: z.string().min(3, "O título é obrigatório."),
  description: z.string().optional(),
  // Usamos string para o input type="date"
  dueDate: z.string().min(1, "A data de vencimento é obrigatória."), 
  priority: z.enum(['baixa', 'média', 'alta'], {
      errorMap: () => ({ message: "Selecione uma prioridade válida." })
  }),
  status: z.enum(['todo', 'doing', 'done']).optional().default('todo'), // Para o Kanban
  subtasks: z.array(subtaskSchema).optional().default([]),
});

// --- Tipos Inferidos ---

// Tipos de Autenticação
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Tipos do TaskFlow
export type TaskFormData = z.infer<typeof taskSchema>;
export type SubtaskFormData = z.infer<typeof subtaskSchema>;