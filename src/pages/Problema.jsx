export default function Problema() {
  return (
    <section className="min-h-screen px-8 py-24 max-w-7xl mx-auto">
      <p className="section-kicker mb-4">
        O PROBLEMA
      </p>

      <h1 className="section-title max-w-4xl mb-10">
        Estamos perdendo o <em>céu noturno</em>.
      </h1>

      <div className="divider-line mb-12"></div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="panel p-8 rounded-xl">
          <h2 className="text-2xl mb-4">
            A corrida espacial mudou o céu
          </h2>

          <p className="text-gray-300 mb-6">
            Desde 2019, empresas como SpaceX, Amazon e OneWeb iniciaram
            o lançamento de megaconstelações de satélites em órbita baixa.
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
            Observatórios profissionais já reportam imagens científicas
            comprometidas pela passagem de satélites. Em alguns casos,
            uma parcela significativa das observações precisa ser
            descartada ou corrigida.
          </p>

          <p className="text-gray-300">
            Para astrônomos amadores e fotógrafos, uma única passagem
            pode arruinar horas de planejamento e uma noite inteira de
            observação.
          </p>
        </div>
      </div>

      <div className="panel p-10 rounded-xl mt-12">
        <h2 className="text-3xl mb-6">
          O crescimento do problema
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-5xl font-bold text-cyan-400 mb-2">
              6.000+
            </h3>
            <p className="text-gray-400">
              Satélites Starlink ativos.
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400 mb-2">
              100.000+
            </h3>
            <p className="text-gray-400">
              Satélites previstos em órbita nesta década.
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400 mb-2">
              30%
            </h3>
            <p className="text-gray-400">
              Das imagens astronômicas podem sofrer interferências.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center max-w-4xl mx-auto">
        <p className="text-2xl leading-relaxed text-gray-300">
          A humanidade está lançando milhares de satélites para explorar
          o espaço, mas essa mesma expansão está tornando cada vez mais
          difícil observar as estrelas da Terra.
        </p>

        <h2 className="section-title mt-8">
          É exatamente esse problema que o <em>DarkSky</em> resolve.
        </h2>
      </div>
    </section>
  );
}