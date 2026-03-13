import React from 'react';
import { FileText, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { store } from '../lib/store';

export default function Dashboard({ navigate }: { navigate: (route: string, params?: any) => void }) {
  const propostas = store.getPropostas();
  const clientes = store.getClientes();

  const servicos = store.getServicos();

  const getServicosNomes = (ids: string[]) => {
    if (!ids || ids.length === 0) return 'Nenhum serviço';
    const nomes = ids.map(id => servicos.find(s => s.id === id)?.nome).filter(Boolean);
    return nomes.length > 0 ? nomes.join(', ') : 'Serviços não encontrados';
  };

  const metrics = [
    { label: 'Propostas Enviadas', value: propostas.length, icon: <FileText className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Clientes Ativos', value: clientes.length, icon: <Users className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Aprovadas', value: propostas.filter(p => p.status === 'aprovada').length, icon: <CheckCircle className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-50' },
    { label: 'Taxa de Conversão', value: propostas.length > 0 ? `${Math.round((propostas.filter(p => p.status === 'aprovada').length / propostas.length) * 100)}%` : '0%', icon: <TrendingUp className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Visão geral das suas propostas e clientes.</p>
        </div>
        <button 
          onClick={() => navigate('propez-fluido')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Criar Proposta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}>
              {metric.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{metric.label}</p>
              <p className="text-2xl font-bold text-zinc-900">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Propostas Recentes</h2>
          {propostas.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              Nenhuma proposta criada ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-sm text-zinc-500">
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Serviço</th>
                    <th className="pb-3 font-medium">Valor</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {propostas.slice(0, 5).map((p) => (
                    <tr key={p.id} className="border-b border-zinc-50 last:border-0">
                      <td className="py-4 font-medium text-zinc-900">{p.cliente_nome}</td>
                      <td className="py-4 text-zinc-600 truncate max-w-[200px]">{getServicosNomes(p.servicos)}</td>
                      <td className="py-4 font-medium text-zinc-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.status === 'aprovada' ? 'bg-emerald-100 text-emerald-700' :
                          p.status === 'recusada' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('propez-fluido')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors">
              Nova Proposta
            </button>
            <button onClick={() => navigate('clientes')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors">
              Adicionar Cliente
            </button>
            <button onClick={() => navigate('propostas')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors">
              Ver Todas Propostas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
