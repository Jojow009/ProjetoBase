"use client"; // Este é o componente de cliente

// Importações de Acessibilidade (Requisito 9)
import { ThemeProvider } from "next-themes";
import VLibras from '@djpfs/react-vlibras'; // <-- CORRIGIDO AQUI

// Suas importações originais
import { AuthProvider } from '@/lib/actions/authcontext';
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 1. Provedor de Temas (Requisito 9)
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      
      {/* 2. Provedor de Autenticação */}
      <AuthProvider>
        
        {/* 3. Layout Padrão (Header/Footer) */}
        <div className="flex flex-col min-h-screen">
          <Header />
          {/* Adiciona 'flex-grow' para que o 'main'
            ocupe o espaço e empurre o footer para baixo.
            Adiciona a cor de fundo aqui para o tema.
          */}
          <main className="flex-grow bg-white dark:bg-slate-900">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* 4. Widget VLibras (Requisito 9) */}
        <VLibras forceOnload={true} />

      </AuthProvider>
    </ThemeProvider>
  );
}