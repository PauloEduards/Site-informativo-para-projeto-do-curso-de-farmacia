'use client';

import React, { useState } from 'react';
import './Questionario.css'; // 👈 Seu CSS

// --- Definindo Tipos ---
type Pergunta = {
  id: string;
  texto: string;
  opcoes: string[];
};

// Objeto que será "emitido" para o componente pai
export type ResultadoDoencas = {
  amebiase: number;
  giardiase: number;
  ascaridiase: number;
};

// Props que o Questionário vai receber
interface QuestionarioProps {
  // Função "callback" que será chamada quando o quiz terminar
  onResultadoCalculado: (resultado: ResultadoDoencas) => void;
}

// --- Constantes ---
const NENHUMA_OPT = 'Nenhuma das alternativas acima';

// --- PERGUNTAS (O CORPO DO QUIZ) ---
const perguntasDoQuiz: Pergunta[] = [
  {
    id: 'etapa1',
    texto: 'Você está sentindo algum dos sintomas abaixo? (Marque todas as opções que se aplicam)',
    opcoes: [
      'Dor abdominal, cólicas ou flatulência (gases)',
      'Diarreia aquosa, explosiva e com muitos gases', // Específico Giardíase
      'Diarreia com presença de muco ou sangue', // Específico Amebíase
      'Náuseas ou vômitos',
      NENHUMA_OPT,
    ],
  },
  {
    id: 'etapa2',
    texto: 'Você observou alguma alteração nas suas fezes?',
    opcoes: [
      'Aparência de gordura (Esteatorréia: fezes que boiam, muito fedorentas)',
      'Constipação (intestino preso)',
      'Viu vermes (lombrigas) nas fezes ou vômito', // Específico Ascaridíase
      NENHUMA_OPT,
    ],
  },
  {
    id: 'etapa3',
    texto: 'Além dos sintomas intestinais, você notou algum destes?',
    opcoes: [
      'Perda de peso ou perda de apetite',
      'Tosse, febre ou dificuldade para respirar',
      'dor na parte superior direita da barriga (região do figado)', // Específico Ascaridíase
      'Cansaço (fadiga)',
      NENHUMA_OPT,
    ],
  },
  {
    id: 'etapa4',
    texto: 'Nos últimos 30 dias, você passou por alguma destas situações de risco?',
    opcoes: [
      'Bebeu água não tratada (poço, rio, fonte não confiável)', // Específico Giardíase
      'Contato com solo que poderia estar contaminado (jardinagem, terra)', // Específico Ascaridíase
      NENHUMA_OPT,
    ],
  },

];

// --- MATRIZ DE PONTUAÇÃO (O "CÉREBRO" DA LÓGICA) ---
const MATRIZ_PONTUACAO: {
  [sintoma: string]: { amebiase: number; giardiase: number; ascaridiase: number };
} = {
  // Etapa 1
  'Dor abdominal, cólicas ou flatulência (gases)': {
    amebiase: 5,
    giardiase: 10,
    ascaridiase: 5,
  },
  'Diarreia aquosa, explosiva e com muitos gases': {
    amebiase: 5,
    giardiase: 20,
    ascaridiase: 5,
  },
  'Diarreia com presença de muco ou sangue': {
    amebiase: 30,
    giardiase: 0,
    ascaridiase: 0,
  },
  'Náuseas ou vômitos': { 
    amebiase: 5,
    giardiase: 5,
    ascaridiase: 10 },
  // Etapa 2
  'Aparência de gordura (Esteatorréia: fezes que boiam, muito fedorentas)': {
    amebiase: 0,
    giardiase: 30,
    ascaridiase: 0,
  },
  'Constipação (intestino preso)': { 
    amebiase: 0, 
    giardiase: 0, 
    ascaridiase: 5 
  },

  'Viu vermes (lombrigas) nas fezes ou vômito': {
    amebiase: 0,
    giardiase: 0,
    ascaridiase: 100, // Quase confirmatório
  },
  // Etapa 3
  'Perda de peso ou perda de apetite': {
    amebiase: 10,
    giardiase: 15,
    ascaridiase: 5,
  },
  'Tosse, febre ou dificuldade para respirar': {
    amebiase: 0,
    giardiase: 0,
    ascaridiase: 30,
  },
  'dor na parte superior direita da barriga (região do figado)':{
    amebiase: 35,
    giardiase: 0,
    ascaridiase: 0,
  },
  'Cansaço (fadiga)': { 
    amebiase: 10, 
    giardiase: 5, 
    ascaridiase: 5 
  },
  // Etapa 4
  'Bebeu água não tratada (poço, rio, fonte não confiável)': {
    amebiase: 10,
    giardiase: 20,
    ascaridiase: 5,
  },
  'Contato com solo que poderia estar contaminado (jardinagem, terra)': {
    amebiase: 0,
    giardiase: 0,
    ascaridiase: 20,
  },
};

// --- COMPONENTE ---
// 👇 Recebe a prop 'onResultadoCalculado'
export default function Questionario({ onResultadoCalculado }: QuestionarioProps) {
  const [respostas, setRespostas] = useState<{ [key: string]: string[] }>({});
  
  // (O estado 'resultado' foi removido daqui)

  // Lógica de seleção
  const handleOpcaoChange = (perguntaId: string, opcao: string) => {
    setRespostas((prev) => {
      const respostasAnteriores = prev[perguntaId] || [];
      let novasRespostas: string[];
      if (opcao === NENHUMA_OPT) {
        novasRespostas = respostasAnteriores.includes(NENHUMA_OPT)
          ? []
          : [NENHUMA_OPT];
      } else {
        if (respostasAnteriores.includes(opcao)) {
          novasRespostas = respostasAnteriores.filter((item) => item !== opcao);
        } else {
          novasRespostas = [
            ...respostasAnteriores.filter((item) => item !== NENHUMA_OPT),
            opcao,
          ];
        }
      }
      return { ...prev, [perguntaId]: novasRespostas };
    });
  };

  // --- LÓGICA DE SUBMISSÃO ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let totalAmebiase = 0;
    let totalGiardiase = 0;
    let totalAscaridiase = 0;
    const todasRespostas = Object.values(respostas).flat();

    // 1. Soma os pontos
    for (const resposta of todasRespostas) {
      const pontos = MATRIZ_PONTUACAO[resposta]; // Busca na matriz
      if (pontos) {
        totalAmebiase += pontos.amebiase;
        totalGiardiase += pontos.giardiase;
        totalAscaridiase += pontos.ascaridiase;
      }
    }

    const somaGeral = totalAmebiase + totalGiardiase + totalAscaridiase;

    let resultadosFinais: ResultadoDoencas;

    // 2. Verifica o caso 0%
    if (somaGeral === 0) {
      resultadosFinais = { amebiase: 0, giardiase: 0, ascaridiase: 0 };
    } else {
      // 3. Calcula as porcentagens
      resultadosFinais = {
        amebiase: (totalAmebiase / somaGeral) * 100,
        giardiase: (totalGiardiase / somaGeral) * 100,
        ascaridiase: (totalAscaridiase / somaGeral) * 100,
      };
    }

    // 4. "Emite" o resultado para o componente pai
    onResultadoCalculado(resultadosFinais);
  };

  // --- RENDERIZAÇÃO (JSX) ---
  return (
    <section className="questionario-container">
      <h2>Questionário de Sintomas</h2>

      <form onSubmit={handleSubmit}>
        {perguntasDoQuiz.map((pergunta) => {
          // Lógica para pular Etapa 2
          const pularEtapa2 = respostas['etapa1']?.includes(NENHUMA_OPT) || false;
          if (pergunta.id === 'etapa2' && pularEtapa2) {
            return null;
          }

          return (
            <div key={pergunta.id} className="pergunta-bloco">
              <p>
                <strong>{pergunta.texto}</strong>
              </p>

              <div className="opcoes-wrapper">
                {pergunta.opcoes.map((opcao, index) => {
                  const inputId = `${pergunta.id}-${index}`;
                  return (
                    // O JSX do checkbox animado
                    <div key={inputId} className="checkbox-wrapper-37">
                      <input
                        type="checkbox"
                        id={inputId}
                        name={pergunta.id}
                        value={opcao}
                        onChange={() => handleOpcaoChange(pergunta.id, opcao)}
                        checked={
                          respostas[pergunta.id]?.includes(opcao) || false
                        }
                        style={{ display: 'none' }}
                      />
                      <label htmlFor={inputId} className="terms-label">
                        <svg
                          className="checkbox-svg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 25.6 25.6"
                        >
                          <path
                            className="checkbox-box"
                            d="M23.1,0.5H2.5c-1.1,0-2,0.9-2,2v20.1c0,1.1,0.9,2,2,2h20.6c1.1,0,2-0.9,2-2V2.5C25.1,1.4,24.2,0.5,23.1,0.5z"
                            strokeWidth="2"
                          />
                          <polyline
                            className="checkbox-tick"
                            points="4.8,12.7 10.3,18.2 20.8,7.7"
                            fill="none"
                            strokeWidth="2"
                          />
                        </svg>
                        <span className="label-text">{opcao}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button type="submit" className="btn btn-primary">
          Verificar Resultado
        </button>
      </form>
    </section>
  );
}