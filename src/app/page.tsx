import Link from "next/link";
import { Brand } from "@/components/Brand";
import { ShieldVisual } from "@/components/ShieldVisual";

export default function HomePage() {
  return (
    <main className="wrap">
      <header className="site-header">
        <Brand />
        <Link className="btn btn-ghost" href="/login">
          Já tenho conta
        </Link>
      </header>

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

      <footer className="site-footer">
        <Brand />
        <span className="muted">Seu computador 24 horas. Sem parar.</span>
      </footer>
    </main>
  );
}
