import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative flex justify-center items-stretch min-h-screen overflow-hidden">
      <Link
        className="fixed top-6 left-6 z-50 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary transition-colors"
        title="Voltar para Home"
        href="/"
      >
        <ChevronLeft />
      </Link>
      <section className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-12 ">
        <div className="w-full max-w-md animate-in fade-in duration-700 slide-in-from-bottom-4">
          {children}
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
