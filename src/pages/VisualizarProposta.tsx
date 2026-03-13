import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { store, Proposta } from '../lib/store';
import { RenderElement } from '../components/Builder';

export default function VisualizarProposta({ navigate, id }: { navigate: (route: string) => void, id: string }) {
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [viewState, setViewState] = useState<'proposal' | 'contract'>('proposal');

  useEffect(() => {
    const p = store.getPropostas().find(p => p.id === id);
    if (p) {
      setProposta(p);
      if (p.status === 'aprovada') {
        setViewState('contract');
      }
    }
  }, [id]);

  const servicos = store.getServicos();

  const getServicosNomes = (ids: string[]) => {
    if (!ids || ids.length === 0) return 'Nenhum serviço';
    const nomes = ids.map(id => servicos.find(s => s.id === id)?.nome).filter(Boolean);
    return nomes.length > 0 ? nomes.join(', ') : 'Serviços não encontrados';
  };

  const handleApprove = () => {
    if (!proposta) return;
    const updatedPropostas = store.getPropostas().map(p => 
      p.id === proposta.id ? { ...p, status: 'aprovada' as const } : p
    );
    store.savePropostas(updatedPropostas);
    setProposta({ ...proposta, status: 'aprovada' });
    setViewState('contract');
  };

  const handleReject = () => {
    if (!proposta) return;
    const updatedPropostas = store.getPropostas().map(p => 
      p.id === proposta.id ? { ...p, status: 'recusada' as const } : p
    );
    store.savePropostas(updatedPropostas);
    setProposta({ ...proposta, status: 'recusada' });
    alert('Proposta recusada.');
  };

  if (!proposta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Proposta não encontrada</h2>
          <button onClick={() => navigate('propostas')} className="text-blue-600 hover:underline">Voltar para Propostas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header (Only visible to the user viewing it in the app, not the final client) */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-zinc-200 flex items-center px-6 z-50">
        <button 
          onClick={() => navigate('propostas')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Voltar
        </button>
        <div className="ml-auto text-sm font-medium text-zinc-500">
          Visualizando Proposta: {proposta.cliente_nome} - {getServicosNomes(proposta.servicos)}
        </div>
      </div>

      <div className="pt-14">
        {proposta.elementos.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] text-zinc-400">
            Esta proposta está vazia.
          </div>
        ) : viewState === 'proposal' ? (
          <div className="pb-24">
            {proposta.elementos.map((el) => (
              <RenderElement key={el.id} element={el} previewMode={true} />
            ))}

            {/* Ações da Proposta */}
            <div className="max-w-4xl mx-auto mt-16 p-8 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-sm text-center">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">O que achou da proposta?</h2>
              {proposta.status === 'pendente' ? (
                <div className="flex items-center justify-center gap-4">
                  <button onClick={handleReject} className="px-6 py-3 bg-white border border-zinc-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors">
                    Recusar Proposta
                  </button>
                  <button onClick={handleApprove} className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors">
                    Aprovar e Continuar
                  </button>
                </div>
              ) : proposta.status === 'aprovada' ? (
                <div>
                  <p className="text-emerald-600 font-medium mb-4">Esta proposta já foi aprovada!</p>
                  <button onClick={() => setViewState('contract')} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
                    Ver Contrato e Pagamento
                  </button>
                </div>
              ) : (
                <p className="text-red-600 font-medium">Esta proposta foi recusada.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto pt-16 pb-24 px-6">
            <button onClick={() => setViewState('proposal')} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 font-medium">
              <ChevronLeft className="w-5 h-5" /> Voltar para a Proposta
            </button>
            <h1 className="text-3xl font-bold text-zinc-900 mb-8">Contrato e Pagamento</h1>
            
            {(proposta.contratoTexto || proposta.chavePix || proposta.linkPagamento) ? (
              <div className="space-y-8">
                {proposta.contratoTexto && (
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800 mb-3">Termos do Contrato</h3>
                    <div className="prose prose-zinc max-w-none bg-white p-6 rounded-xl border border-zinc-200 shadow-sm whitespace-pre-wrap text-sm text-zinc-600">
                      {proposta.contratoTexto}
                    </div>
                  </div>
                )}

                {(proposta.chavePix || proposta.linkPagamento) && (
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800 mb-3">Opções de Pagamento</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {proposta.chavePix && (
                        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-zinc-900 mb-1">Chave PIX</h4>
                          <p className="text-sm text-zinc-500 mb-3 break-all">{proposta.chavePix}</p>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(proposta.chavePix || '');
                              alert('Chave PIX copiada!');
                            }}
                            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-sm font-medium transition-colors w-full"
                          >
                            Copiar Chave
                          </button>
                        </div>
                      )}

                      {proposta.linkPagamento && (
                        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-zinc-900 mb-1">Link de Pagamento</h4>
                          <p className="text-sm text-zinc-500 mb-3">Pague de forma segura online</p>
                          <a 
                            href={proposta.linkPagamento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors w-full inline-block"
                          >
                            Acessar Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
                Nenhuma informação de contrato ou pagamento foi configurada para esta proposta.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
