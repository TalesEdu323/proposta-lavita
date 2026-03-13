import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { store, Servico } from '../lib/store';

export default function Servicos({ navigate }: { navigate: (route: string) => void }) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    tipo: 'unico' as 'unico' | 'recorrente'
  });

  useEffect(() => {
    setServicos(store.getServicos());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newServico: Servico = {
      id: editingId || crypto.randomUUID(),
      nome: formData.nome,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      tipo: formData.tipo
    };

    let updatedServicos;
    if (editingId) {
      updatedServicos = servicos.map(s => s.id === editingId ? newServico : s);
    } else {
      updatedServicos = [newServico, ...servicos];
    }

    store.saveServicos(updatedServicos);
    setServicos(updatedServicos);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      const updated = servicos.filter(s => s.id !== id);
      store.saveServicos(updated);
      setServicos(updated);
    }
  };

  const openModal = (servico?: Servico) => {
    if (servico) {
      setEditingId(servico.id);
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao,
        valor: servico.valor.toString(),
        tipo: servico.tipo
      });
    } else {
      setEditingId(null);
      setFormData({ nome: '', descricao: '', valor: '', tipo: 'unico' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const filteredServicos = servicos.filter(s => 
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Serviços</h1>
          <p className="text-zinc-500 mt-1">Gerencie seu catálogo de serviços e valores.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100 text-sm text-zinc-500">
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Valor</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredServicos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    Nenhum serviço encontrado.
                  </td>
                </tr>
              ) : (
                filteredServicos.map((servico) => (
                  <tr key={servico.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{servico.nome}</td>
                    <td className="px-6 py-4 text-zinc-600 truncate max-w-xs">{servico.descricao}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        servico.tipo === 'recorrente' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {servico.tipo === 'recorrente' ? 'Recorrente' : 'Único'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(servico)}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(servico.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">
                {editingId ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Ex: Desenvolvimento de Site"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Descrição</label>
                <textarea
                  required
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  placeholder="Descreva o serviço..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Tipo de Cobrança</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as 'unico' | 'recorrente'})}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  >
                    <option value="unico">Pagamento Único</option>
                    <option value="recorrente">Recorrente (Mensal)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
