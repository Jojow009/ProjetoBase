import Link from 'next/link';
import { BarChart, List, TrendingUp, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <header className="relative bg-gray-50 pt-32 pb-20 md:pt-40 md:pb-28">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
         <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                Transforme sua relação com o dinheiro
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Nós fornecemos as melhores ferramentas para você e sua família alcançarem o sucesso financeiro. Simples e intuitivo.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                 <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
                    Começar Agora
                 </Link>
                 <Link href="#features" className="px-6 py-3 bg-white text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                    Saber mais &rarr;
                 </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
               {/* Placeholder para uma imagem ou ilustração do produto */}
               <div className="w-full max-w-sm h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-2xl flex items-center justify-center">
                  <p className="text-gray-500">[Imagem do Dashboard FinTrack]</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Funcionalidades Incríveis</h2>
          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">Tudo o que você precisa para uma gestão financeira pessoal eficiente e sem complicações.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <BarChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Inteligente</h3>
              <p className="text-gray-600 text-sm">
                Visualize suas finanças de forma clara e interativa.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <List className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gerencie Transações</h3>
              <p className="text-gray-600 text-sm">
                Cadastre receitas e despesas com facilidade e rapidez.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Relatórios e Insights</h3>
              <p className="text-gray-600 text-sm">
                Entenda seus hábitos e tome decisões mais inteligentes.
              </p>
            </div>
             {/* Feature 4 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
              <p className="text-gray-600 text-sm">
                Seus dados são privados e protegidos com criptografia de ponta.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} FinTrack. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
