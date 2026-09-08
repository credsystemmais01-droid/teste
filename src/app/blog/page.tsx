import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { POSTS, formatPostDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Limpa e Protege",
  description:
    "Artigos do Sistema Guardião: destrava acessos, atualiza drivers, atualiza softwares, checkout e proteção 24 horas.",
};

export default function BlogPage() {
  return (
    <main className="wrap">
      <SiteNav />

      <section className="pay-hero">
        <p className="tiny">Sistema Guardião</p>
        <h1>Blog Limpa e Protege</h1>
        <p className="muted">
          Quem quiser conhecer o produto lê aqui. Cada artigo detalha um serviço: destravar
          acessos, atualizar drivers, atualizar softwares, fazer o checkout e ligar o Guardião.
        </p>
      </section>

      <section className="blog-grid">
        {POSTS.map((post) => (
          <article className="card blog-card" key={post.slug}>
            <p className="tiny">{post.category}</p>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="muted">{post.excerpt}</p>
            <p className="blog-meta">
              {formatPostDate(post.date)} · {post.readMinutes} min
            </p>
            <Link className="btn btn-purple" href={`/blog/${post.slug}`}>
              Ler artigo
            </Link>
          </article>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
