import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { POSTS, formatPostDate, getPost } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artigo | Limpa e Protege" };
  return {
    title: `${post.title} | Limpa e Protege`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = POSTS.filter((item) => item.slug !== post.slug);

  return (
    <main className="wrap">
      <SiteNav extra="login" />

      <article className="article">
        <p className="tiny">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="blog-meta">
          {formatPostDate(post.date)} · {post.readMinutes} min de leitura
        </p>

        {post.body.map((block, index) => {
          if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
          if (block.type === "ul") {
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          return <p key={index}>{block.text}</p>;
        })}

        <div className="cta-row" style={{ marginTop: 32 }}>
          <Link className="btn btn-blue" href="/cadastro">
            Criar conta
          </Link>
          <Link className="btn btn-ghost" href="/blog">
            Voltar ao blog
          </Link>
        </div>
      </article>

      <section className="blog-more">
        <p className="tiny">Continue lendo</p>
        <div className="blog-grid">
          {others.map((item) => (
            <article className="card blog-card" key={item.slug}>
              <p className="tiny">{item.category}</p>
              <h2>
                <Link href={`/blog/${item.slug}`}>{item.title}</Link>
              </h2>
              <p className="muted">{item.excerpt}</p>
              <Link className="btn btn-ghost" href={`/blog/${item.slug}`}>
                Ler
              </Link>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
