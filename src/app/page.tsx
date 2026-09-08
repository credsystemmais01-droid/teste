import Link from "next/link";

export default function HomePage() {
  return (
    <main className="wrap">
      <header className="site-header">
        <div className="brand">
          Limpa e <span>Protege</span>
        </div>
        <Link className="btn btn-ghost" href="/login">
          Já tenho conta
        </Link>
      </header>

      <section className="hero">
        <h1>Limpa e Protege o seu computador 24 horas. Sem parar.</h1>
        <p className="muted">
          Seus dados, fotos e documentos ficam sob escudo. Sua empresa e o seu site,
          fora do alcance de hackers, malwares e trojans.
        </p>
        <div className="cta-row">
          <Link className="btn btn-blue" href="/cadastro">
            Criar conta
          </Link>
          <Link className="btn btn-purple" href="/login">
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="pillars">
        <article className="card pillar">
          <h3>Dados, fotos e documentos</h3>
          <p>Protege seus dados, fotos e documentos.</p>
        </article>
        <article className="card pillar">
          <h3>Sua empresa</h3>
          <p>Protege sua empresa.</p>
        </article>
        <article className="card pillar">
          <h3>Site e rede</h3>
          <p>Protege seu site de ataques, hackers, malwares e trojans.</p>
        </article>
      </section>

      <footer className="site-footer">
        <span className="muted">Limpa e Protege</span>
        <span className="muted">Seu computador 24 horas. Sem parar.</span>
      </footer>
    </main>
  );
}
