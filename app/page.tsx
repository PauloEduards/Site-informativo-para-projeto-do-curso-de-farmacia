// 👇 PASSO 1: Importar o 'useRef' junto com o 'useState'
'use client';

// 👇 PASSO 2: Importar o 'useState', 'useRef' e o tipo de resultado
import { useState, useRef } from 'react';
import InfoCard from "./components/infoCard"; // Seu import
import Questionario, { ResultadoDoencas } from "./components/Questionario"; // Importar o Questionário E o tipo

export default function Home() {
  // O estado "chefe"
  const [resultados, setResultados] = useState<ResultadoDoencas | null>(null);

  // 👇 PASSO 3: Criar a "Referência" (um "gancho" para o elemento dos cards)
  const infoContainerRef = useRef<HTMLDivElement>(null);

  // 👇 PASSO 4: MODIFICAR A FUNÇÃO para usar a Referência
  const handleCalculoCompleto = (resultadoCalculado: ResultadoDoencas) => {
    setResultados(resultadoCalculado); // Armazena o resultado no estado
    
    // ANTES (com o número fixo 630):
    // window.scrollTo({ top: 630, behavior: 'smooth' });

    // AGORA (dinâmico e correto):
    // Verifica se o "gancho" está anexado a um elemento
    if (infoContainerRef.current) {
      // Manda o navegador rolar suavemente até aquele elemento
      infoContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start" // 'start' alinha o topo do container com o topo da tela
      });
    }
  };

  // Função para o botão "Refazer"
  const handleReiniciar = () => {
    setResultados(null); // Limpa o estado, o que fará o questionário reaparecer
  };

  return (
    <main className='fonte' style={{ maxWidth: '1200px', margin: 'auto', padding: '2rem'}}>

      <header style={{ textAlign: 'center', marginBottom: '3rem'}}>
        <div className='card-inicial'>

          <h1 className='Titulo-pricipal'>Conheça as Doenças Parasitárias: Um Guia Rápido para sua Saúde</h1>
          <br />
          {/* Texto dinâmico */}
          <p className='paragrafo'>Você sabe a diferença entre Ascaridíase, Amebíase e Giardíase? Essas infecções são muito comuns, mas nem sempre fáceis de identificar.</p>
          
          <p className='paragrafo'>Criamos este espaço para você aprender, de forma rápida e segura, o que são essas doenças, como elas são transmitidas e quais sinais o seu corpo pode dar.</p>
          
          <p className='paragrafo'>Navegue pelos quadros abaixo para conhecer cada uma. Diante disso, criamos um questionário interativo. Se você está com sintomas, ele pode servir como uma triagem inicial.
            Se você é estudante, pode usá-lo como uma ferramenta de simulação para testar diferentes combinações de sintomas e entender os possíveis diagnósticos.</p>
            
          {!resultados ? (
            <p className='sub-texto'>Leia sobre as infecções e, em seguida, responda ao questionário.</p>
          ) : (
            <p className='sub-texto'>Confira a análise de probabilidade com base nas suas respostas!</p>
          )}
        </div>
      </header>

      {/* ======= CONTAINER DOS CARDS (SEMPRE VISÍVEL) ======= */}
      
      {/* 👇 PASSO 5: "Anexar" a referência ao seu contêiner de cards */}
      <div className="info-container" ref={infoContainerRef}>

        <InfoCard
          titulo="Amebíase"
          imagemSrc="https://www.mdsaude.com/wp-content/uploads/ameba-ilustracao.jpg"
          porcentagem={resultados?.amebiase}
        >
          <p >
            A Amebíase é uma infecção causada pelo protozoário Entamoeba histolytica, que se aloja principalmente no intestino grosso.
            A transmissão acontece pela ingestão de cistos (a forma resistente do parasita)
            encontrados em água ou alimentos contaminados. Muitas vezes, a infecção não causa sintomas.
            No entanto, quando sintomática, pode variar de uma diarreia leve até um quadro grave de disenteria
            (com muco e sangue nas fezes).
          </p>
        </InfoCard>

        <InfoCard
          titulo="Giardíase"
          imagemSrc="https://www.mdsaude.com/wp-content/uploads/giardia-lamblia-1.jpg"
          porcentagem={resultados?.giardiase}
        >
          <p >
            A Giardíase é causada pelo parasita Giardia lamblia e afeta o intestino delgado.
            A transmissão ocorre pela via fecal-oral, através do consumo de água ou alimentos contaminados.
            O quadro agudo é marcado por diarreia explosiva e dores abdominais.
            O quadro crônico pode levar à má absorção de nutrientes, perda de peso e esteatorreia
            (presença de gordura nas fezes).
          </p>
        </InfoCard>

        <InfoCard
          titulo="Ascaridíase"
          imagemSrc="https://www.mdsaude.com/wp-content/uploads/ascaris-imagem.jpg"
          porcentagem={resultados?.ascaridiase}
        >
          <p >
            Conhecida como "lombriga", a Ascaridíase é causada pelo verme Ascaris lumbricoides.
            A infecção ocorre ao ingerir os ovos do parasita (solo, água ou alimentos).
            Possui uma fase pulmonar, durante a migração das larvas, que pode causar tosse e febre;
            e a fase intestinal, com os vermes adultos, que pode gerar dor abdominal, náuseas e diarreia.
          </p>
        </InfoCard>

      </div>
      {/* Fim do info-container */}

      <hr style={{ margin: '2rem 0' }} />

      {/* ======= ÁREA DO QUESTIONÁRIO (CONDICIONAL) ======= */}

      {/* Se NÃO houver resultados, mostre o Questionário */}
      {!resultados && (
        <Questionario onResultadoCalculado={handleCalculoCompleto} />
      )}

      {/* Se HOUVER resultados, mostre o Aviso e o botão "Refazer" */}
      {resultados && (
        <div className="resultado-bloco" style={{ textAlign: 'center' }}>
          <h3>Questionário Concluído!</h3>
          <p>Os resultados foram aplicados aos cards acima.</p>

          <p className="aviso-medico" style={{
            fontSize: '0.9rem',
            fontStyle: 'italic',
            opacity: 0.8,
            margin: '2rem 0',
            padding: '1rem',
            borderTop: '1px solid #43460',
            borderBottom: '1px solid #434960',
          }}>
            <strong>Aviso:</strong> Este é um resultado ilustrativo e não
            substitui uma avaliação médica.
          </p>

          <button onClick={handleReiniciar} className="btn btn-secondary">
            Refazer Questionário
          </button>
        </div>
      )}
      <hr style={{ margin: '2rem 0' }} />
      <div className='card-inicial' style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className='Titulo-doença'>Guia de Prevenção</h1>
        <p className='paragrafo2'>
          A profilaxia para essas condições envolve um conjunto de medidas para evitar a ingestão dos ovos ou cistos dos parasitas, focando em três áreas principais:
        </p>
        <h2 className='sub-titulo'style={{ marginLeft: '10%' }}>1. Higiene Pessoal e Sanitária</h2>
        <div style={{ textAlign: 'start', marginLeft: '15%', marginRight: '20%', }}>
          <li>
            É fundamental o aumento da higiene pessoal e a adoção de medidas de higiene sanitária.
          </li>
          <li>
            Isso inclui a lavagem adequada das mãos.
          </li>
        </div>
        <h2 className='sub-titulo'style={{ marginLeft: '10%' }}>2. Água e Alimentos Seguros</h2>
        <div style={{ textAlign: 'start', marginLeft: '15%' }}>

          <li>
            Garantir o consumo de água tratada. Em locais onde não há tratamento, a água deve ser fervida.
          </li>
          <li>
            Realizar a correta higienização dos alimentos, incluindo a lavagem de alimentos.

          </li>
          <li>
            É importante fazer a lavagem e desinfecção de frutas e verduras.
          </li>
          <li>
            Deve-se evitar consumir alimentos crus ou mal lavados.

          </li>
        </ div>
        <h2 className='sub-titulo'style={{ marginLeft: '10%' }}>3. Saneamento e Educação</h2>
        <div style={{ textAlign: 'start', marginLeft: '15%' }}>

        <li>
          Garantir condições de saneamento básico adequado.
        </li>
        <li>
          Evitar o contato com fezes humanas.
        </li>
        </div>
      </div>

    </main>
  );
}