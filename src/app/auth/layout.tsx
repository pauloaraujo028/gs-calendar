// import VisualPanel from "@/features/auth/components/visial-panel";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative flex justify-center items-stretch min-h-screen overflow-hidden">
      <Link
        className="fixed top-6 left-6 z-50 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
        title="Voltar para Home"
        href="/"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Link>
      <section className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md animate-in fade-in duration-700 slide-in-from-bottom-4">
          {children}
        </div>
      </section>

      <section className="hidden lg:flex lg:w-3/5 bg-slate-900 relative overflow-hidden">
        {/* <VisualPanel /> */}
      </section>
    </main>
  );
};

export default AuthLayout;
