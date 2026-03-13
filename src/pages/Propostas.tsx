import React, { useState } from 'react';
import { Plus, Search, FileText, Edit2, Trash2, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';
import { store, Proposta } from '../lib/store';

export default function Propostas({ navigate }: { navigate: (route: string, params?: any) => void }) {
  const [propostas, setPropostas] = useState<Proposta[]>(store.getPropostas());
  const [searchTerm, setSearchTerm] = useState('');

  const servicos = store.getServicos();

  const getServicosNomes = (ids: string[]) => {
    if (!ids || ids.length === 0) return 'Nenhum serviço';
    const nomes = ids.map(id => servicos.find(s => s.id === id)?.nome).filter(Boolean);
    return nomes.length > 0 ? nomes.join(', ') : 'Serviços não encontrados';
  };

  const filteredPropostas = propostas.filter(p => 
    p.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    getServicosNomes(p.servicos).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      const updated = propostas.filter(p => p.id !== id);
      setPropostas(updated);
      store.savePropostas(updated);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'pendente' | 'aprovada' | 'recusada') => {
    const updated = propostas.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setPropostas(updated);
    store.savePropostas(updated);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovada': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'recusada': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'recusada': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Propostas</h1>
          <p className="text-zinc-500 mt-1">Acompanhe e gerencie suas propostas enviadas.</p>
        </div>
        <button 
          onClick={() => navigate('propez-fluido')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 w-fit"
        >
          <Plus className="w-5 h-5" /> Nova Proposta
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Buscar por cliente ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {filteredPropostas.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-1">Nenhuma proposta encontrada</h3>
            <p className="text-zinc-500 mb-6">Comece criando sua primeira proposta comercial.</p>
            <button 
              onClick={() => navigate('propez-fluido')}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Criar Proposta
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Serviço / Valor</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredPropostas.map((proposta) => (
                  <tr key={proposta.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{proposta.cliente_nome}</div>
                      <div className="text-sm text-zinc-500">ID: {proposta.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 truncate max-w-[200px]">{getServicosNomes(proposta.servicos)}</div>
                      <div className="text-sm text-zinc-600 font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposta.valor)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={proposta.status}
                        onChange={(e) => handleStatusChange(proposta.id, e.target.value as any)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border focus:outline-none cursor-pointer appearance-none ${getStatusClass(proposta.status)}`}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="aprovada">Aprovada</option>
                        <option value="recusada">Recusada</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(proposta.data_criacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate('visualizar-proposta', { id: proposta.id })}
                          className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate('propez-fluido', { editId: proposta.id })}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(proposta.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
