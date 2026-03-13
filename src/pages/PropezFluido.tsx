import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Save, FileText, User, DollarSign, LayoutTemplate, Layers, CheckCircle, Mail } from 'lucide-react';
import { store, Cliente, Proposta, ModeloProposta, Servico } from '../lib/store';

export default function PropezFluido({ navigate, initialData }: { navigate: (route: string, params?: any) => void, initialData?: any }) {
  const [step, setStep] = useState(1);
  const [createdPropostaId, setCreatedPropostaId] = useState<string>('');
  const [clientes] = useState<Cliente[]>(store.getClientes());
  const [modelos] = useState<ModeloProposta[]>(store.getModelos());
  const [servicosDisponiveis] = useState<Servico[]>(store.getServicos());
  
  const [formData, setFormData] = useState({
    modeloId: '',
    clienteId: '',
    clienteNome: '',
    clienteEmail: '',
    servicos: [] as string[],
    valor: '',
    desconto: '',
    recorrente: false,
    cicloRecorrencia: 'mensal',
    duracaoRecorrencia: '12',
    envio: new Date().toISOString().split('T')[0],
    validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    elementos: [] as any[],
    contratoTexto: '',
    chavePix: '',
    linkPagamento: ''
  });

  useEffect(() => {
    if (initialData?.editId) {
      const prop = store.getPropostas().find(p => p.id === initialData.editId);
      if (prop) {
        setFormData(prev => ({
          ...prev,
          modeloId: prop.modelo_id || '',
          clienteId: prop.cliente_id,
          clienteNome: prop.cliente_nome,
          servicos: prop.servicos || [],
          valor: prop.valor.toString(),
          desconto: prop.desconto?.toString() || '',
          recorrente: prop.recorrente || false,
          cicloRecorrencia: prop.ciclo_recorrencia || 'mensal',
          duracaoRecorrencia: prop.duracao_recorrencia?.toString() || '12',
          envio: prop.data_envio || prev.envio,
          validade: prop.data_validade || prev.validade,
          elementos: prop.elementos || [],
          contratoTexto: prop.contratoTexto || '',
          chavePix: prop.chavePix || '',
          linkPagamento: prop.linkPagamento || ''
        }));
        setStep(2); // Skip template selection if editing
      }
    }
  }, [initialData]);

  const handleModeloSelect = (modeloId: string) => {
    const modelo = modelos.find(m => m.id === modeloId);
    if (modelo) {
      // Calculate total value from services
      const totalValor = modelo.servicos.reduce((acc, servicoId) => {
        const servico = servicosDisponiveis.find(s => s.id === servicoId);
        return acc + (servico ? servico.valor : 0);
      }, 0);

      setFormData(prev => ({
        ...prev,
        modeloId,
        servicos: modelo.servicos,
        valor: totalValor.toString(),
        elementos: modelo.elementos,
        contratoTexto: modelo.contratoTexto || '',
        chavePix: modelo.chavePix || '',
        linkPagamento: modelo.linkPagamento || ''
      }));
    }
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const client = clientes.find(c => c.id === id);
    if (client) {
      setFormData({ ...formData, clienteId: id, clienteNome: client.nome, clienteEmail: client.email });
    } else {
      setFormData({ ...formData, clienteId: '', clienteNome: '', clienteEmail: '' });
    }
  };

  const handleSave = () => {
    const newPropostaId = initialData?.editId || Math.random().toString(36).substr(2, 9);
    const newProposta: Proposta = {
      id: newPropostaId,
      cliente_id: formData.clienteId || 'novo',
      cliente_nome: formData.clienteNome,
      modelo_id: formData.modeloId,
      servicos: formData.servicos,
      valor: Number(formData.valor),
      desconto: Number(formData.desconto) || 0,
      recorrente: formData.recorrente,
      ciclo_recorrencia: formData.cicloRecorrencia,
      duracao_recorrencia: Number(formData.duracaoRecorrencia) || 0,
      data_envio: formData.envio,
      data_validade: formData.validade,
      status: 'pendente',
      data_criacao: new Date().toISOString(),
      elementos: formData.elementos,
      contratoTexto: formData.contratoTexto,
      chavePix: formData.chavePix,
      linkPagamento: formData.linkPagamento
    };

    const propostas = store.getPropostas();
    let updated;
    if (initialData?.editId) {
      updated = propostas.map(p => p.id === newProposta.id ? newProposta : p);
    } else {
      updated = [...propostas, newProposta];
    }
    
    store.savePropostas(updated);
    
    // If it's a new client, save it
    if (!formData.clienteId && formData.clienteNome) {
      const newCliente: Cliente = {
        id: newProposta.cliente_id,
        nome: formData.clienteNome,
        empresa: '',
        email: formData.clienteEmail || '',
        telefone: '',
        data_cadastro: new Date().toISOString()
      };
      store.saveClientes([...clientes, newCliente]);
    }

    setCreatedPropostaId(newPropostaId);
    setStep(5);
  };

  const [isSending, setIsSending] = useState(false);

  // Se estiver no passo 5, renderiza a tela de sucesso
  if (step === 5) {
    const handleSendEmail = async () => {
      if (!formData.clienteEmail) {
        alert('Preencha o e-mail do cliente.');
        return;
      }

      setIsSending(true);
      try {
        // Padrão de UI para o envio de e-mail.
        // Aqui você fará a integração manual com o seu backend/SMTP futuramente.
        const proposalLink = `${window.location.origin}/?route=visualizar-proposta&id=${createdPropostaId}`;
        console.log("Enviando e-mail para:", formData.clienteEmail);
        console.log("Link da proposta:", proposalLink);

        // Simulando o tempo de requisição
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert(`Proposta enviada com sucesso para ${formData.clienteEmail}! (Simulação)`);
        navigate('propostas');
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao tentar enviar o e-mail.');
      } finally {
        setIsSending(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Proposta Finalizada!</h2>
          <p className="text-zinc-500 mb-8">Sua proposta foi criada com sucesso e está pronta para ser enviada ao cliente.</p>
          
          <div className="space-y-6 text-left">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Link da Proposta</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/?route=visualizar-proposta&id=${createdPropostaId}`}
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-600 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?route=visualizar-proposta&id=${createdPropostaId}`);
                    alert('Link copiado!');
                  }}
                  className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-xl transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-zinc-500">ou envie por e-mail</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">E-mail do Cliente</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={formData.clienteEmail}
                  onChange={e => setFormData({...formData, clienteEmail: e.target.value})}
                  placeholder="cliente@email.com"
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button 
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  {isSending ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100">
            <button 
              onClick={() => navigate('propostas')}
              className="text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
            >
              Voltar para o Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Modelo', icon: <Layers className="w-5 h-5" /> },
    { id: 2, title: 'Cliente', icon: <User className="w-5 h-5" /> },
    { id: 3, title: 'Serviços', icon: <DollarSign className="w-5 h-5" /> },
    { id: 4, title: 'Prazos e Pagamento', icon: <FileText className="w-5 h-5" /> },
    { id: 5, title: 'Finalização', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('propostas')}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {initialData?.editId ? 'Editar Proposta' : 'Nova Proposta'}
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-100 rounded-full" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3 bg-white px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 ${
                  step >= s.id ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {step > s.id ? <Check className="w-6 h-6" /> : s.icon}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  step >= s.id ? 'text-blue-600' : 'text-zinc-400'
                }`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden relative min-h-[450px] flex flex-col">
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Escolha um Modelo Base</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Modelo de Proposta</label>
                    <select 
                      value={formData.modeloId}
                      onChange={(e) => handleModeloSelect(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="">-- Começar do zero --</option>
                      {modelos.map(m => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                      ))}
                    </select>
                    <p className="text-sm text-zinc-500 mt-2">
                      Selecionar um modelo preencherá automaticamente os serviços, valores, contrato e design da proposta.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Para quem é esta proposta?</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Selecionar Cliente Existente</label>
                    <select 
                      value={formData.clienteId}
                      onChange={handleClientSelect}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="">-- Novo Cliente --</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nome} ({c.empresa || c.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-zinc-500">Ou cadastre um novo</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Nome do Cliente *</label>
                    <input 
                      type="text" 
                      value={formData.clienteNome}
                      onChange={e => setFormData({...formData, clienteNome: e.target.value, clienteId: ''})}
                      placeholder="Ex: João Silva"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">E-mail do Cliente</label>
                    <input 
                      type="email" 
                      value={formData.clienteEmail}
                      onChange={e => setFormData({...formData, clienteEmail: e.target.value, clienteId: ''})}
                      placeholder="Ex: joao@empresa.com"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-bold text-zinc-900 mb-6">O que você está oferecendo?</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Serviços Inclusos *</label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 border border-zinc-200 rounded-xl p-4 bg-zinc-50">
                      {servicosDisponiveis.length === 0 ? (
                        <div className="text-sm text-zinc-500 text-center">Nenhum serviço cadastrado.</div>
                      ) : (
                        servicosDisponiveis.map(servico => (
                          <label key={servico.id} className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={formData.servicos.includes(servico.id)}
                              onChange={() => {
                                const newServicos = formData.servicos.includes(servico.id)
                                  ? formData.servicos.filter(id => id !== servico.id)
                                  : [...formData.servicos, servico.id];
                                
                                const totalValor = newServicos.reduce((acc, servicoId) => {
                                  const s = servicosDisponiveis.find(s => s.id === servicoId);
                                  return acc + (s ? s.valor : 0);
                                }, 0);

                                setFormData({...formData, servicos: newServicos, valor: totalValor.toString()});
                              }}
                              className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-zinc-900">{servico.nome}</span>
                            <span className="text-sm text-zinc-500 ml-auto">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Valor Total (R$) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">R$</span>
                        <input 
                          type="number" 
                          value={formData.valor}
                          onChange={e => setFormData({...formData, valor: e.target.value})}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Desconto (R$)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">R$</span>
                        <input 
                          type="number" 
                          value={formData.desconto}
                          onChange={e => setFormData({...formData, desconto: e.target.value})}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Prazos, Pagamento e Contrato</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Data de Envio</label>
                      <input 
                        type="date" 
                        value={formData.envio}
                        onChange={e => setFormData({...formData, envio: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Validade</label>
                      <input 
                        type="date" 
                        value={formData.validade}
                        onChange={e => setFormData({...formData, validade: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.recorrente}
                        onChange={e => setFormData({...formData, recorrente: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-zinc-900">Este é um serviço recorrente (assinatura)</span>
                    </label>
                  </div>

                  {formData.recorrente && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-2 gap-4 pt-2"
                    >
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Ciclo de Cobrança</label>
                        <select 
                          value={formData.cicloRecorrencia}
                          onChange={e => setFormData({...formData, cicloRecorrencia: e.target.value})}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        >
                          <option value="semanal">Semanal</option>
                          <option value="mensal">Mensal</option>
                          <option value="trimestral">Trimestral</option>
                          <option value="semestral">Semestral</option>
                          <option value="anual">Anual</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Duração (Meses)</label>
                        <input 
                          type="number" 
                          value={formData.duracaoRecorrencia}
                          onChange={e => setFormData({...formData, duracaoRecorrencia: e.target.value})}
                          placeholder="Ex: 12"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-zinc-100 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900">Pagamento e Contrato</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Chave PIX</label>
                      <input
                        type="text"
                        value={formData.chavePix}
                        onChange={(e) => setFormData({...formData, chavePix: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="CNPJ, Email, Telefone ou Chave Aleatória"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Link de Pagamento (Opcional)</label>
                      <input
                        type="url"
                        value={formData.linkPagamento}
                        onChange={(e) => setFormData({...formData, linkPagamento: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Termos do Contrato</label>
                      <textarea
                        rows={5}
                        value={formData.contratoTexto}
                        onChange={(e) => setFormData({...formData, contratoTexto: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none text-sm"
                        placeholder="Cole aqui os termos do contrato ou link para o documento..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <button 
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-600 hover:bg-zinc-200 bg-zinc-100'
              }`}
            >
              Anterior
            </button>
            
            <button 
              onClick={() => {
                if (step === 2 && !formData.clienteNome) {
                  alert('Preencha o nome do cliente.');
                  return;
                }
                if (step === 3 && (!formData.servicos.length || !formData.valor)) {
                  alert('Selecione pelo menos um serviço e preencha o valor.');
                  return;
                }
                if (step === 4 && (!formData.envio || !formData.validade)) {
                  alert('Preencha as datas de envio e validade.');
                  return;
                }
                
                if (step === 4) {
                  handleSave();
                } else {
                  setStep(step + 1);
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              {step === 4 ? 'Finalizar Proposta' : 'Próximo'}
              {step !== 4 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
