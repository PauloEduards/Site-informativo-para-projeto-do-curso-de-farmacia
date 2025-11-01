// Arquivo: components/infoCard.tsx (Verifique se está assim)

import React from 'react';
import Image from 'next/image';
import './infoCard.css'; // 👈 Importando o CSS que acabamos de corrigir

interface InfoCardProps {
  titulo: string;
  imagemSrc: string;
  porcentagem?: number;
  children: React.ReactNode;
}

export default function InfoCard({ titulo, imagemSrc, porcentagem, children }: InfoCardProps) {
  const temResultado = typeof porcentagem === 'number' && porcentagem >= 0;

  return (
    // 👇 Este é o 'display: flex; flex-direction: column;'
    <div className={`info-card ${temResultado ? 'com-resultado' : ''}`}>
      
      {/* Estes são os filhos normais */}
      <h3 className='Titulo-doença'>{titulo}</h3>
      <Image
        src={imagemSrc}
        alt={titulo}
        width={400}
        height={250}
        style={{
          // Recomendo mudar width para 100% para responsividade
          width: '100%', 
          height: 'auto', 
          objectFit: 'cover',
          // Tire o borderRadius se quiser a imagem "colada" no topo
          // borderRadius: "5px", 
          display: 'block', 
        }}
      />
      <div className="info-card-content">
        {children}
      </div>
      
      {/* 👇 Este é o filho com 'margin-top: auto;' */}
      {temResultado && (
        <div className="info-card-resultado">
          <span className="porcentagem-valor">{porcentagem.toFixed(0)}%</span>
          <div className="porcentagem-barra-fundo">
            <div 
              className="porcentagem-barra-preenchimento" 
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}