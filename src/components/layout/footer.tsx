// components/layout/Footer.tsx

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-800  py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mb-4">
          <a href="#" className="text-gray-100 hover:text-blue-600 hover:underline">Sobre Nós</a>
          <a href="#" className="text-gray-100 hover:text-blue-600 hover:underline">Contato</a>
          <a href="#" className="text-gray-100 hover:text-blue-600 hover:underline">Privacidade</a>
  S         <a href="#" className="text-gray-100 hover:text-blue-600 hover:underline">Termos de Uso</a>
        </div>
        <p className="text-sm text-gray-400 border-t-2 border-gray-100 pt-4">
          © {currentYear} TaskFlow. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}