import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, FileText } from 'lucide-react';
import { store, ModeloProposta } from '../lib/store';

export default function Modelos({ navigate }: { navigate: (route: string, params?: any) => void }) {
  const [modelos, setModelos] = useState<ModeloProposta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setModelos(store.getModelos());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      const updated = modelos.filter(m => m.id !== id);
      store.saveModelos(updated);
      setModelos(updated);
    }
  };

  const filteredModelos = modelos.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Modelos de Proposta</h1>
          <p className="text-zinc-500 mt-1">Crie templates base para gerar propostas rapidamente.</p>
        </div>
        <button 
          onClick={() => navigate('criar-modelo')}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Modelo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar modelos..."
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
                <th className="px-6 py-4 font-medium">Nome do Modelo</th>
                <th className="px-6 py-4 font-medium">Serviços Inclusos</th>
                <th className="px-6 py-4 font-medium">Data de Criação</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredModelos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    Nenhum modelo encontrado.
                  </td>
                </tr>
              ) : (
                filteredModelos.map((modelo) => (
                  <tr key={modelo.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      {modelo.nome}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {modelo.servicos.length} serviço(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(modelo.data_criacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate('criar-modelo', { editId: modelo.id })}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(modelo.id)}
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
    </div>
  );
}
