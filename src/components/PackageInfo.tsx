export function PackageInfo() {
  return (
    <section className="package-info">
      <div className="pay-hero">
        <p className="tiny">O que entra no anual</p>
        <h2>Antes do valor, o que você recebe</h2>
        <p className="muted">
          O pacote Guardian Proteção é anual. Por 12 meses o painel Limpa e Protege fica
          ativo: limpa, protege e acompanha — 24 horas, sem parar.
        </p>
      </div>

      <div className="pillars">
        <article className="card pillar">
          <div className="ico">▣</div>
          <h3>Dados, fotos e documentos</h3>
          <p>
            O escudo cobre arquivos, fotos e documentos da conta. O painel mostra o
            estado da proteção e o log da leitura.
          </p>
        </article>
        <article className="card pillar">
          <div className="ico">◈</div>
          <h3>Sua empresa</h3>
          <p>
            A narrativa de proteção vale para a operação: máquina, acessos e o
            cotidiano da empresa, não só o computador de casa.
          </p>
        </article>
        <article className="card pillar">
          <div className="ico">◎</div>
          <h3>Site e rede</h3>
          <p>
            Cuidado do site contra ataques, hackers, malwares e trojans. O pacote
            não é só a tela do painel — cobre o que você usa para aparecer online.
          </p>
        </article>
      </div>

      <div className="info-grid">
        <article className="card info-block">
          <p className="tiny">Sistema Guardião</p>
          <h3>Escudo 24 horas no painel</h3>
          <p className="muted">
            O Guardião acompanha a máquina, o diagnóstico e o pacote. Depois de
            ativar, o painel fica em estado protegido pelo ano inteiro.
          </p>
        </article>
        <article className="card info-block">
          <p className="tiny">Destrava acessos</p>
          <h3>Voltar ao que o vírus travou</h3>
          <p className="muted">
            Sessão bloqueada, arquivo que não abre, login que recusa. O serviço
            de destravar devolve o caminho da conta e da máquina.
          </p>
        </article>
        <article className="card info-block">
          <p className="tiny">Drivers</p>
          <h3>Estabilidade para o escudo</h3>
          <p className="muted">
            Driver velho trava impressora, vídeo, rede e áudio. Atualizar drivers
            entra no cuidado contínuo do Limpa e Protege.
          </p>
        </article>
        <article className="card info-block">
          <p className="tiny">Softwares</p>
          <h3>Fechar a porta do malware</h3>
          <p className="muted">
            Navegador, escritório, Java, PDF e o próprio sistema. Software parado
            no tempo é o atalho favorito de trojan e golpe.
          </p>
        </article>
      </div>

      <article className="card info-steps">
        <p className="tiny">Como funciona</p>
        <h3>Da conta ao escudo ligado</h3>
        <ol>
          <li>Você cria a conta com nome, CPF, WhatsApp e e-mail — ou entra com o Google.</li>
          <li>No painel, informa a máquina e marca os sintomas do diagnóstico.</li>
          <li>O console mostra a leitura e o log do Guardião.</li>
          <li>No checkout, você ativa o anual. A cobrança sai pela Stripe, em nome da Guardian Proteção.</li>
          <li>Depois do pagamento, o painel fica protegido por 12 meses.</li>
        </ol>
      </article>
    </section>
  );
}
