import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Copyright } from "@/components/Copyright";
import { COMPANY, SUPPORT_EMAIL } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Brand />
      <nav className="footer-nav">
        <Link href="/blog">Blog</Link>
        <Link href="/privacidade">Privacidade</Link>
        <Link href="/termos">Termos</Link>
        <Link href="/suporte">Atendimento</Link>
        <Link href="/cadastro">Criar conta</Link>
        <Link href="/login">Entrar</Link>
      </nav>
      <span className="muted">
        {COMPANY} · Contato:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </span>
      <Copyright />
    </footer>
  );
}
