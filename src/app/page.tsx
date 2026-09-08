import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ShieldVisual } from "@/components/ShieldVisual";
import { POSTS } from "@/lib/blog";
import { ANNUAL, INSTALLMENT_LABEL, PRICE_LABEL } from "@/lib/pricing";

export default function HomePage() {
  return (
    <main className="wrap">
      <SiteNav />

      <section className="hero">
        <div>
          <p className="tiny">Escudo contínuo</p>
          <h1>
            Limpa e Protege o seu computador{" "}
            <span className="glow">24 horas. Sem parar.</span>
          </h1>
          <p className="muted">
            Seus dados, fotos e documentos ficam sob escudo. Sua empresa e o seu site,
            fora do alcance de hackers, malwares e trojans.
          </p>
          <div className="cta-row">
            <Link className="btn btn-blue" href="/cadastro">
              Criar conta
            </Link>
            <Link className="btn btn-ghost" href="/login">
              Entrar no painel
            </Link>
            <Link className="btn btn-purple" href="/blog">
              Blog
            </Link>
          </div>
          <div className="stats">
            <div className="stat">
              <b>24h</b>
              <span className="muted">sem pausa</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span className="muted">camadas de narrativa</span>
            </div>
            <div className="stat">
              <b>Neon</b>
              <span className="muted">painel ao vivo</span>
            </div>
          </div>
        </div>
        <ShieldVisual />
      </section>

      <section className="pillars">
        <article className="card pillar">
          <div className="ico">▣</div>
          <h3>Dados, fotos e documentos</h3>
          <p>Protege seus dados, fotos e documentos.</p>
        </article>
        <article className="card pillar">
          <div className="ico">◈</div>
          <h3>Sua empresa</h3>
          <p>Protege sua empresa.</p>
        </article>
        <article className="card pillar">
          <div className="ico">◎</div>
          <h3>Site e rede</h3>
          <p>Protege seu site de ataques, hackers, malwares e trojans.</p>
        </article>
      </section>

      <section className="price-home">
        <article className="card price-card">
          <p className="tiny">Preço único · uso anual</p>
          <h2>Limpa e Protege Anual</h2>
          <p className="price-big">{PRICE_LABEL}</p>
          <p className="price-note">
            ou {ANNUAL.installmentCount}x de {INSTALLMENT_LABEL}
          </p>
          <p className="muted">{ANNUAL.promise}</p>
          <div className="cta-row">
            <Link className="btn btn-blue" href="/cadastro">
              Assinar agora
            </Link>
            <Link className="btn btn-ghost" href="/pagamento">
              Ir ao checkout
            </Link>
          </div>
        </article>
      </section>

      <section className="blog-home">
        <div className="pay-hero">
          <p className="tiny">Sistema Guardião</p>
          <h2>Quer conhecer e ler mais?</h2>
          <p className="muted">
            O blog detalha cada serviço: destrava acessos, atualiza drivers, atualiza
            softwares, faz o checkout e explica o Guardião 24 horas.
          </p>
        </div>
        <div className="blog-grid">
          {POSTS.map((post) => (
            <article className="card blog-card" key={post.slug}>
              <p className="tiny">{post.category}</p>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="muted">{post.excerpt}</p>
              <Link className="btn btn-ghost" href={`/blog/${post.slug}`}>
                Ler artigo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
