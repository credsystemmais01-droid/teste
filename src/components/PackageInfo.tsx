export function PackageInfo() {
  return (
    <section className="package-info">
      <div className="pay-hero">
        <p className="tiny">O que entra na assinatura</p>
        <h2>Antes do plano, o que a segurança cobre</h2>
        <p className="muted">
          As três assinaturas ligam o painel Limpa e Protege enquanto o plano estiver ativo:
          criptografia dos dados, vigilância 24 horas no computador e no notebook, e cuidado
          contra hacker, malware e trojan. O alcance muda conforme o plano escolhido.
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
            A proteção vale para a operação inteira: máquina, acessos e o
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
            O Guardião acompanha a máquina, o diagnóstico e a assinatura. Depois de
            ativar, o painel fica em estado protegido enquanto o plano estiver ativo.
          </p>
        </article>
        <article className="card info-block">
          <p className="tiny">Internet de volta</p>
          <h3>Rede que voltou a responder</h3>
          <p className="muted">
            Vírus que derruba a conexão, DNS sequestrado, proxy estranho e porta
            fechada. O botão Fazer internet voltar refaz esse caminho no painel.
          </p>
        </article>
        <article className="card info-block">
          <p className="tiny">Máquina segura</p>
          <h3>Vigilância no período da assinatura</h3>
          <p className="muted">
            Manter máquina segura deixa o escudo ligado no computador e no notebook
            durante toda a assinatura, no mês ou no ano contratado.
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
          <li>No checkout, você escolhe uma das três assinaturas. A cobrança sai pela Stripe, em nome da Guardian Proteção.</li>
          <li>Depois do pagamento, o painel fica protegido enquanto a assinatura estiver ativa.</li>
        </ol>
      </article>
    </section>
  );
}
