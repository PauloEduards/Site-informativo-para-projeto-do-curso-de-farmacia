import React from 'react';

// Tipagem para as propriedades do componente
interface InfoProps {
  titulo: string;
  children: React.ReactNode; // Permite passar parágrafos, listas, etc.
}

export default function InformacaoSection({ titulo, children }: InfoProps) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}