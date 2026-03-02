import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="group flex cursor-pointer items-center space-x-2"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary shadow-lg transition-transform group-hover:rotate-45">
        <div className="size-6 -rotate-45 transform rounded-sm bg-white flex items-center justify-center">
          <div className="text-xs font-medium">GS</div>
        </div>
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-900">
        Calendar
      </span>
    </Link>
  );
};
