import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 py-4 text-center text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center justify-center gap-1">
        <span>© {year} — Todos os direitos reservados.</span>
        <span>Desenvolvido por</span>
        <Link
          href="https://pauloaraujo-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Paulo Araujo Dev
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
