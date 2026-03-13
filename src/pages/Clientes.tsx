import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Mail, Phone, Users } from 'lucide-react';
import { store, Cliente } from '../lib/store';

export default function Clientes({ navigate }: { navigate: (route: string, params?: any) => void }) {
  const [clientes, setClientes] = useState<Cliente[]>(store.getClientes());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Cliente>>({});

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) return;

    const newCliente: Cliente = {
      id: formData.id || Math.random().toString(36).substr(2, 9),
      nome: formData.nome,
      empresa: formData.empresa || '',
      email: formData.email,
      telefone: formData.telefone || '',
      data_cadastro: formData.data_cadastro || new Date().toISOString(),
    };

    let updatedClientes;
    if (formData.id) {
      updatedClientes = clientes.map(c => c.id === formData.id ? newCliente : c);
    } else {
      updatedClientes = [...clientes, newCliente];
    }

    setClientes(updatedClientes);
    store.saveClientes(updatedClientes);
    setIsModalOpen(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      const updated = clientes.filter(c => c.id !== id);
      setClientes(updated);
      store.saveClientes(updated);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Clientes</h1>
          <p className="text-zinc-500 mt-1">Gerencie sua carteira de clientes.</p>
        </div>
        <button 
          onClick={() => { setFormData({}); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 w-fit"
        >
          <Plus className="w-5 h-5" /> Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Buscar por nome, empresa ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {filteredClientes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-1">Nenhum cliente encontrado</h3>
            <p className="text-zinc-500 mb-6">Comece adicionando seu primeiro cliente.</p>
            <button 
              onClick={() => { setFormData({}); setIsModalOpen(true); }}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Adicionar Cliente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Contato</th>
                  <th className="px-6 py-4 font-medium">Cadastro</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{cliente.nome}</div>
                      <div className="text-sm text-zinc-500">{cliente.empresa || 'Sem empresa'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-600 mb-1">
                        <Mail className="w-4 h-4 text-zinc-400" /> {cliente.email}
                      </div>
                      {cliente.telefone && (
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Phone className="w-4 h-4 text-zinc-400" /> {cliente.telefone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(cliente.data_cadastro).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setFormData(cliente); setIsModalOpen(true); }}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cliente.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900">
                {formData.id ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nome Completo *</label>
                <input 
                  type="text" 
                  required
                  value={formData.nome || ''}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Empresa</label>
                <input 
                  type="text" 
                  value={formData.empresa || ''}
                  onChange={e => setFormData({...formData, empresa: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">E-mail *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email || ''}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  value={formData.telefone || ''}
                  onChange={e => setFormData({...formData, telefone: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
