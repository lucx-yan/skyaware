export default function Impacto() {
  return (
    <section className="min-h-screen px-8 py-24 max-w-7xl mx-auto">
      <p className="section-kicker mb-4">
        IMPACTO GLOBAL
      </p>

      <h1 className="section-title max-w-4xl mb-10">
        O impacto vai além da <em>astronomia.</em>
      </h1>

      <div className="divider-line mb-12"></div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="panel p-8 rounded-xl">
          <h2 className="text-2xl mb-4">
            Astronomia Científica
          </h2>

          <p className="text-gray-300">
            Observatórios profissionais enfrentam um aumento constante
            de imagens contaminadas por rastros de satélites. Cada nova
            constelação reduz a eficiência das observações e aumenta os
            custos de pesquisa.
          </p>
        </div>

        <div className="panel p-8 rounded-xl">
          <h2 className="text-2xl mb-4">
            Astrofotografia
          </h2>

          <p className="text-gray-300">
            Uma única passagem de satélite pode comprometer horas de
            preparação e uma noite inteira de captura. O problema se
            torna ainda maior em fotografias de longa exposição.
          </p>
        </div>

        <div className="panel p-8 rounded-xl">
          <h2 className="text-2xl mb-4">
            Observação Amadora
          </h2>

          <p className="text-gray-300">
            Milhões de pessoas observam o céu por lazer, educação ou
            paixão pela astronomia. A crescente presença de satélites
            altera completamente essa experiência.
          </p>
        </div>
      </div>

      <div className="panel p-10 rounded-xl mt-12">
        <h2 className="text-3xl mb-8">
          O crescimento da interferência orbital
        </h2>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-bold text-cyan-400 mb-2">
              30%
            </h3>

            <p className="text-gray-400">
              Das imagens científicas podem sofrer interferências
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400 mb-2">
              42.000
            </h3>

            <p className="text-gray-400">
              Satélites Starlink aprovados
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400 mb-2">
              648+
            </h3>

            <p className="text-gray-400">
              Satélites OneWeb
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-cyan-400 mb-2">
              100.000+
            </h3>

            <p className="text-gray-400">
              Objetos previstos em órbita nesta década
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="panel p-10 rounded-xl">
          <h2 className="text-3xl mb-6">
            O que está em jogo?
          </h2>

          <p className="text-gray-300 mb-6">
            O céu noturno sempre foi uma das maiores fontes de
            conhecimento da humanidade. Das primeiras navegações aos
            observatórios modernos, nossa compreensão do universo começou
            olhando para cima.
          </p>

          <p className="text-gray-300">
            Hoje, a própria indústria espacial está criando um novo tipo
            de poluição: a poluição luminosa orbital. Se nada for feito,
            futuras gerações poderão crescer sem nunca experimentar um
            céu verdadeiramente escuro.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <div className="panel p-10 rounded-xl">
          <h2 className="text-3xl mb-8">
            Por que o DarkSky é importante?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-3">
                Sem DarkSky
              </h3>

              <p className="text-gray-400">
                Astrônomos e fotógrafos dependem de aplicativos
                fragmentados, previsões incompletas e tentativa e erro
                para encontrar boas janelas de observação.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-3">
                Com DarkSky
              </h3>

              <p className="text-gray-400">
                Dados orbitais reais, condições atmosféricas e sensores
                locais são combinados em um único indicador simples:
                o Sky Observation Score.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-20 max-w-4xl mx-auto">
        <h2 className="section-title mb-6">
          O espaço está ficando mais conectado.
        </h2>

        <p className="text-xl text-gray-300">
          O DarkSky existe para garantir que a humanidade não perca de
          vista as estrelas enquanto corre em direção a elas.
        </p>
      </div>
    </section>
  );
}