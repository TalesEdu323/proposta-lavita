export interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  data_cadastro: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  tipo: 'unico' | 'recorrente';
}

export interface ModeloProposta {
  id: string;
  nome: string;
  elementos: any[];
  servicos: string[]; // IDs dos serviços
  contratoTexto?: string;
  chavePix?: string;
  linkPagamento?: string;
  data_criacao: string;
}

export interface Proposta {
  id: string;
  cliente_id: string;
  cliente_nome: string;
  modelo_id?: string;
  servicos: string[]; // IDs dos serviços selecionados
  valor: number;
  desconto?: number;
  recorrente?: boolean;
  ciclo_recorrencia?: string;
  duracao_recorrencia?: number;
  data_envio?: string;
  data_validade?: string;
  status: 'pendente' | 'aprovada' | 'recusada';
  data_criacao: string;
  elementos: any[];
  contratoTexto?: string;
  chavePix?: string;
  linkPagamento?: string;
}

export const store = {
  getClientes: (): Cliente[] => {
    try {
      return JSON.parse(localStorage.getItem('propez_clientes') || '[]');
    } catch {
      return [];
    }
  },
  saveClientes: (clientes: Cliente[]) => {
    localStorage.setItem('propez_clientes', JSON.stringify(clientes));
  },
  
  getServicos: (): Servico[] => {
    try {
      return JSON.parse(localStorage.getItem('propez_servicos') || '[]');
    } catch {
      return [];
    }
  },
  saveServicos: (servicos: Servico[]) => {
    localStorage.setItem('propez_servicos', JSON.stringify(servicos));
  },

  getModelos: (): ModeloProposta[] => {
    try {
      return JSON.parse(localStorage.getItem('propez_modelos') || '[]');
    } catch {
      return [];
    }
  },
  saveModelos: (modelos: ModeloProposta[]) => {
    localStorage.setItem('propez_modelos', JSON.stringify(modelos));
  },

  getPropostas: (): Proposta[] => {
    try {
      return JSON.parse(localStorage.getItem('propez_propostas') || '[]');
    } catch {
      return [];
    }
  },
  savePropostas: (propostas: Proposta[]) => {
    localStorage.setItem('propez_propostas', JSON.stringify(propostas));
  },
};
