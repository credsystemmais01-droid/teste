import Link from "next/link";
import { Brand } from "@/components/Brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Brand />
      <nav className="footer-nav">
        <Link href="/blog">Blog</Link>
        <Link href="/cadastro">Criar conta</Link>
        <Link href="/login">Entrar</Link>
      </nav>
      <span className="muted">Seu computador 24 horas. Sem parar.</span>
    </footer>
  );
}
