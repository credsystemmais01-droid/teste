import Link from "next/link";
import { Brand } from "@/components/Brand";

type Props = {
  brandHref?: string;
  extra?: "login" | "panel" | "none";
};

export function SiteNav({ brandHref = "/", extra = "login" }: Props) {
  return (
    <header className="site-header">
      <Brand href={brandHref} />
      <nav className="header-nav">
        <Link className="btn btn-ghost" href="/blog">
          Blog
        </Link>
        {extra === "login" ? (
          <Link className="btn btn-ghost" href="/login">
            Já tenho conta
          </Link>
        ) : null}
        {extra === "panel" ? (
          <Link className="btn btn-ghost" href="/painel">
            Painel
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
