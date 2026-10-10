import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ShieldVisual } from "@/components/ShieldVisual";
import { PackageInfo } from "@/components/PackageInfo";
import { PlanGrid } from "@/components/PlanGrid";
import { POSTS } from "@/lib/blog";
import { DEFAULT_TRIAL_DAYS } from "@/lib/trial";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main className="wrap">
      <section className="hero">
        <div>
          <p className="tiny">Escudo contínuo</p>
          <p className="price-badge">3 assinaturas de segurança</p>
          <h1>
            Limpa e Protege o seu computador{" "}
            <span className="glow">24 horas. Sem parar.</span>
          </h1>
          <p className="muted">
            Escolha a assinatura que cobre o seu computador, a sua empresa e o seu site.
            Criptografia dos dados, fotos e documentos, com o Guardião vigiando 24 horas
            enquanto o plano estiver ativo. Hackers, malwares e trojans ficam do lado de fora.
          </p>
          <div className="cta-row">
            <Link className="btn btn-blue" href="/cadastro?next=/painel">
              Criar conta e testar {DEFAULT_TRIAL_DAYS} dias grátis
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
              <b>{DEFAULT_TRIAL_DAYS} dias</b>
              <span className="muted">grátis, sem cartão</span>
            </div>
            <div className="stat">
              <b>3 planos</b>
              <span className="muted">mensal ou anual</span>
            </div>
            <div className="stat">
              <b>Stripe</b>
              <span className="muted">pagamento seguro</span>
            </div>
          </div>
        </div>
        <ShieldVisual />
      </section>

      <PackageInfo />

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

      <section className="plans-intro">
        <div className="pay-hero">
          <p className="tiny">Assinaturas</p>
          <h2>Três planos de segurança</h2>
          <p className="muted">
            Criptografia Security para o computador de casa, Guardian Proteção para empresa e
            site, e Security z1 para um ano inteiro de escudo contínuo.
          </p>
        </div>
        <PlanGrid includeTest />
      </section>

      <SiteFooter />
      </main>
    </>
  );
}
