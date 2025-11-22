// /lib/validations/formschema.ts

import { z } from "zod";

// Schema para o formulário de Login (O seu já estava bom)
export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

// Schema para o formulário de Cadastro (Signup) - ADAPTADO
export const signupSchema = z
  .object({
    // Campo novo exigido pelo enunciado
    name: z.string().min(3, "O nome é obrigatório"),
    email: z.email("Por favor, insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], // Aplica o erro no campo 'confirmPassword'
  });

// Tipos inferidos
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Os outros schemas (contactFormSchema, addressFormSchema, etc.) podem ser removidos.