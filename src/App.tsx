import React, { useState } from 'react';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X, Plus, Layers, Briefcase } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Propostas from './pages/Propostas';
import PropezFluido from './pages/PropezFluido';
import VisualizarProposta from './pages/VisualizarProposta';
import Servicos from './pages/Servicos';
import Modelos from './pages/Modelos';
import CriarModelo from './pages/CriarModelo';

export default function App() {
  const [route, setRoute] = useState('dashboard');
  const [routeParams, setRouteParams] = useState<any>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = (newRoute: string, params: any = {}) => {
    setRoute(newRoute);
    setRouteParams(params);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (route) {
      case 'dashboard':
        return <Dashboard navigate={navigate} />;
      case 'clientes':
        return <Clientes navigate={navigate} />;
      case 'propostas':
        return <Propostas navigate={navigate} />;
      case 'servicos':
        return <Servicos navigate={navigate} />;
      case 'modelos':
        return <Modelos navigate={navigate} />;
      case 'criar-modelo':
        return <CriarModelo navigate={navigate} initialData={routeParams} />;
      case 'propez-fluido':
        return <PropezFluido navigate={navigate} initialData={routeParams} />;
      case 'visualizar-proposta':
        return <VisualizarProposta navigate={navigate} id={routeParams.id} />;
      default:
        return <Dashboard navigate={navigate} />;
    }
  };

  // Se a rota for o builder (propez-fluido, criar-modelo) ou visualizar-proposta, não mostra a sidebar para dar mais espaço
  if (route === 'propez-fluido' || route === 'visualizar-proposta' || route === 'criar-modelo') {
    return renderContent();
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'clientes', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { id: 'servicos', label: 'Serviços', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'modelos', label: 'Modelos', icon: <Layers className="w-5 h-5" /> },
    { id: 'propostas', label: 'Propostas', icon: <FileText className="w-5 h-5" /> },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-[#f5f5f7] font-sans overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-zinc-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">P</span>
              PropEZ
            </h1>
          </div>
          
          <div className="px-4 pb-4">
            <button 
              onClick={() => navigate('propez-fluido')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" /> Nova Proposta
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  route === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {renderContent()}
      </main>
    </div>
  );
}
