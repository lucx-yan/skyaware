export default function Problema() {
  return (
    <section className="min-h-screen px-8 py-24 max-w-7xl mx-auto">
      <p className="section-kicker mb-4">
        O PROBLEMA
      </p>

      <h1 className="section-title max-w-5xl mb-10">
        Estamos perdendo o <em>céu noturno</em>.
      </h1>

      <div className="divider-line mb-12"></div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="panel p-8 rounded-xl">
          <h2 className="text-2xl mb-4">
            A corrida espacial mudou o céu
          </h2>

          <p className="text-gray-300 mb-6">
            Desde 2019, empresas como SpaceX, Amazon e OneWeb iniciaram o
            lançamento de megaconstelações de satélites em órbita baixa.
            Apenas a Starlink já possui milhares de satélites ativos e
            autorização para expandir sua frota para dezenas de milhares
            nos próximos anos.
          </p>

          <p className="text-gray-300">
            O resultado é um aumento sem precedentes da poluição luminosa
            orbital, criando rastros brilhantes que atravessam observações
            astronômicas e fotografias do céu.
          </p>
        </div>

        <div className="panel p-8 rounded-xl">
          <h2 className="text-2xl mb-4">
            Impacto na astronomia
          </h2>

          <p className="text-gray-300 mb-6">
            Observatórios profissionais já registram imagens científicas
            comprometidas pela passagem constante de satélites. Em alguns
            casos, observações precisam ser descartadas ou corrigidas.
          </p>

          <p className="text-gray-300">
            Para astrônomos amadores e astrofotógrafos, uma única passagem
            pode comprometer horas de planejamento e uma noite inteira de
            observação.
          </p>
        </div>
      </div>

      <div className="panel p-10 rounded-xl mt-12">
        <h2 className="text-3xl mb-8">
          O crescimento da interferência orbital
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-6xl font-bold text-red-400 mb-3">
              30%
            </h3>

            <p className="text-gray-400">
              Das imagens astronômicas podem sofrer interferências
              causadas por satélites.
            </p>
          </div>

          <div>
            <h3 className="text-6xl font-bold text-cyan-400 mb-3">
              6.000+
            </h3>

            <p className="text-gray-400">
              Satélites Starlink já estão ativos em órbita baixa.
            </p>
          </div>

          <div>
            <h3 className="text-6xl font-bold text-cyan-400 mb-3">
              100.000+
            </h3>

            <p className="text-gray-400">
              Objetos previstos em órbita ainda nesta década.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl mb-8">
          Uma noite de observação
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="panel p-8 rounded-xl border border-red-500/20">
            <span className="section-kicker text-red-400">
              SEM SKYAWARE
            </span>

            <h3 className="text-2xl mt-4 mb-6">
              Planejamento incerto
            </h3>

            <div className="space-y-4 text-gray-300">
              <p>• Horário escolhido sem previsão orbital.</p>
              <p>• Passagens de satélites inesperadas.</p>
              <p>• Fotografias comprometidas por rastros luminosos.</p>
              <p>• Necessidade de consultar várias plataformas.</p>
              <p>• Tempo perdido procurando uma janela adequada.</p>
            </div>
          </div>

          <div className="panel p-8 rounded-xl border border-cyan-500/20">
            <span className="section-kicker">
              COM SKYAWARE
            </span>

            <h3 className="text-2xl mt-4 mb-6">
              Planejamento inteligente
            </h3>

            <div className="space-y-4 text-gray-300">
              <p>• Melhor janela calculada automaticamente.</p>
              <p>• Previsão de satélites em tempo real.</p>
              <p>• Sky Observation Score instantâneo.</p>
              <p>• Dados orbitais combinados com sensores locais.</p>
              <p>• Mais tempo observando e menos tempo planejando.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-10 rounded-xl mt-16">
        <h2 className="text-3xl mb-6">
          O que está em jogo?
        </h2>

        <p className="text-gray-300 mb-4">
          Durante milhares de anos, a humanidade utilizou o céu noturno
          para navegação, ciência, cultura e inspiração.
        </p>

        <p className="text-gray-300">
          Hoje, a própria expansão da atividade espacial está alterando
          essa experiência. O desafio não é impedir a evolução da indústria
          espacial, mas garantir que continuemos capazes de observar o
          universo enquanto avançamos em direção a ele.
        </p>
      </div>

      <div className="mt-24 text-center max-w-5xl mx-auto">
        <h2 className="section-title">
          O espaço está ficando mais conectado.
          <br />
          <em>O céu está ficando mais congestionado.</em>
        </h2>

        <p className="text-gray-300 mt-8 text-lg leading-relaxed">
          O SkyAware transforma dados espaciais complexos em informações
          simples e acionáveis, ajudando astrônomos, fotógrafos e
          entusiastas a encontrarem o momento ideal para observar o céu.
        </p>
      </div>
    </section>
  );
}