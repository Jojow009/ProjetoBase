'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app'; // Importante para erros
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa a função do CLIENTE
import { auth } from '@/lib/firestore/firebaseconfig'; // Importa o 'auth' do CLIENTE

import {
  loginSchema,
  type LoginFormData,
} from '@/lib/validations/formschema';

// NÃO PRECISAMOS MAIS DA signInAction
// import { signInAction } from '@/lib/actions/useauth';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // A função de submit AGORA faz a chamada direta ao Firebase
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // --- LÓGICA MOVIDA PARA CÁ ---
      // Tenta fazer o login no NAVEGADOR (cliente)
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // Sucesso! O AuthContext vai detectar e o redirecionamento vai funcionar
      router.push('/dashboard'); // Pode ser /kanban ou /calendar
    
    } catch (error) {
      setIsLoading(false);
      // --- Tratamento de Erro ---
      let errorMessage = 'E-mail ou senha inválidos.';
      if (error instanceof FirebaseError) {
        // Erros específicos do Firebase
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          errorMessage = 'E-mail ou senha inválidos.';
        } else {
          // Outro erro
          errorMessage = 'Ocorreu um erro ao tentar fazer login.';
        }
      }
      setServerError(errorMessage);
    }
    // Não precisa de setIsLoading(false) aqui se o login for sucesso,
    // pois a página vai redirecionar.
  };

  // O RESTO DO SEU JSX CONTINUA IGUAL...
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-slate-800">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Entrar na sua conta
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Senha
            </label>
  _           <input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Mensagens de Erro do Servidor */}
          {serverError && (
            <p className="text-center text-sm text-red-600">{serverError}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-slate-400">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}