import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, FileText, Link as LinkIcon, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { store, ModeloProposta, Servico } from '../lib/store';
import Builder from '../components/Builder';

export default function CriarModelo({ navigate, initialData }: { navigate: (route: string) => void, initialData?: any }) {
  const [step, setStep] = useState(1);
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);
  
  const [formData, setFormData] = useState({
    nome: '',
    servicos: [] as string[],
    contratoTexto: '',
    chavePix: '',
    linkPagamento: ''
  });

  const [elementos, setElementos] = useState<any[]>([]);

  useEffect(() => {
    setServicosDisponiveis(store.getServicos());

    if (initialData?.editId) {
      const modelo = store.getModelos().find(m => m.id === initialData.editId);
      if (modelo) {
        setFormData({
          nome: modelo.nome,
          servicos: modelo.servicos,
          contratoTexto: modelo.contratoTexto || '',
          chavePix: modelo.chavePix || '',
          linkPagamento: modelo.linkPagamento || ''
        });
        setElementos(modelo.elementos);
      }
    }
  }, [initialData]);

  const handleSave = (finalElements: any[]) => {
    const newModelo: ModeloProposta = {
      id: initialData?.editId || crypto.randomUUID(),
      nome: formData.nome,
      servicos: formData.servicos,
      contratoTexto: formData.contratoTexto,
      chavePix: formData.chavePix,
      linkPagamento: formData.linkPagamento,
      elementos: finalElements,
      data_criacao: new Date().toISOString()
    };

    const modelos = store.getModelos();
    if (initialData?.editId) {
      store.saveModelos(modelos.map(m => m.id === newModelo.id ? newModelo : m));
    } else {
      store.saveModelos([newModelo, ...modelos]);
    }

    navigate('modelos');
  };

  const toggleServico = (id: string) => {
    setFormData(prev => ({
      ...prev,
      servicos: prev.servicos.includes(id) 
        ? prev.servicos.filter(s => s !== id)
        : [...prev.servicos, id]
    }));
  };

  if (step === 2) {
    return (
      <div className="h-screen w-full bg-white flex flex-col">
        <Builder 
          initialElements={elementos} 
          onSave={handleSave} 
          onBack={() => setStep(1)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('modelos')}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              {initialData?.editId ? 'Editar Modelo' : 'Novo Modelo de Proposta'}
            </h1>
            <p className="text-sm text-zinc-500">Configure as informações base do modelo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white">1</span>
            <span className="text-zinc-900">Configurações</span>
            <div className="w-8 h-px bg-zinc-300 mx-2" />
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-200">2</span>
            <span>Editor Visual</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 space-y-8">
          
          {/* Nome do Modelo */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Nome do Modelo</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
              placeholder="Ex: Proposta Padrão - Desenvolvimento Web"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Serviços Inclusos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Serviços Inclusos
              </h3>
              <p className="text-sm text-zinc-500">Selecione os serviços que farão parte deste modelo.</p>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {servicosDisponiveis.length === 0 ? (
                  <div className="text-sm text-zinc-500 p-4 bg-zinc-50 rounded-xl text-center">
                    Nenhum serviço cadastrado. Vá em "Serviços" para adicionar.
                  </div>
                ) : (
                  servicosDisponiveis.map(servico => (
                    <label 
                      key={servico.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.servicos.includes(servico.id) 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-zinc-200 hover:border-blue-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                        checked={formData.servicos.includes(servico.id)}
                        onChange={() => toggleServico(servico.id)}
                      />
                      <div>
                        <div className="font-medium text-zinc-900">{servico.nome}</div>
                        <div className="text-sm text-zinc-500 mt-0.5">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Configurações de Pagamento e Contrato */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Pagamento e Contrato
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Chave PIX</label>
                    <input
                      type="text"
                      value={formData.chavePix}
                      onChange={(e) => setFormData({...formData, chavePix: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="CNPJ, Email, Telefone ou Chave Aleatória"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Link de Pagamento (Opcional)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="url"
                        value={formData.linkPagamento}
                        onChange={(e) => setFormData({...formData, linkPagamento: e.target.value})}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Termos do Contrato</label>
                    <textarea
                      rows={5}
                      value={formData.contratoTexto}
                      onChange={(e) => setFormData({...formData, contratoTexto: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none text-sm"
                      placeholder="Cole aqui os termos do contrato ou link para o documento..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 flex justify-end">
            <button 
              onClick={() => {
                if (!formData.nome) {
                  alert('Por favor, dê um nome ao modelo.');
                  return;
                }
                setStep(2);
              }}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Ir para o Editor Visual
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
