import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, Image as ImageIcon, MousePointerClick, AlignLeft, 
  Trash2, ArrowUp, ArrowDown, Settings, Plus, LayoutTemplate,
  Minus, Maximize2, Youtube, Layout, BarChart, List, Sparkles,
  ChevronDown, PlayCircle, Filter, ListChecks, DollarSign, 
  MessageSquareQuote, GitCommit, CheckCircle2, Quote,
  Navigation, GalleryHorizontal, Grid3X3, Columns, Menu,
  Eye, EyeOff, Download, Upload, Trash, Layers, Box,
  Timer, MessageCircle, FolderOpen, Activity, Star, MapPin, Table, Images, Bell, Save, ChevronLeft
} from 'lucide-react';

// --- Types & Default Configurations ---
export type ElementType = 
  | 'heading' | 'paragraph' | 'button' | 'image' 
  | 'divider' | 'spacer' | 'video' | 'card' 
  | 'stats' | 'accordion' | 'animated_text'
  | 'funnel' | 'icon_list' | 'pricing' | 'testimonial' | 'timeline'
  | 'navbar' | 'slider' | 'feature_grid' | 'gallery' | 'grid' | 'container' | 'column'
  | 'countdown' | 'whatsapp_button' | 'tabs' | 'progress_bar' | 'star_rating'
  | 'google_map' | 'comparison_table' | 'image_carousel' | 'toast_notification';

export interface ElementData {
  id: string;
  type: ElementType;
  props: Record<string, any>;
  children?: ElementData[];
}

const DEFAULT_PROPS: Record<ElementType, Record<string, any>> = {
  heading: { text: 'Novo Título', color: '#18181b', align: 'left', size: 'text-4xl', weight: 'font-bold' },
  paragraph: { text: 'Digite seu texto aqui. Você pode editar as propriedades na barra lateral.', color: '#52525b', align: 'left', size: 'text-base' },
  button: { text: 'Clique Aqui', bgColor: '#dc2626', textColor: '#ffffff', align: 'center', radius: 'rounded-md', animation: 'none' },
  image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', alt: 'Imagem', width: '100%', radius: 'rounded-xl', shadow: 'shadow-none' },
  divider: { color: '#e5e7eb', thickness: '2', style: 'solid' },
  spacer: { height: '64' },
  video: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', radius: 'rounded-xl', shadow: 'shadow-lg' },
  card: { title: 'Título do Cartão', description: 'Uma breve descrição sobre o benefício ou recurso.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', buttonText: 'Saiba Mais', bgColor: '#ffffff', radius: 'rounded-2xl', shadow: 'shadow-xl' },
  stats: { value: '100', label: 'Clientes Satisfeitos', suffix: '%', color: '#dc2626' },
  accordion: { title: 'Como funciona o serviço?', content: 'Nós oferecemos uma solução completa de ponta a ponta para o seu negócio crescer de forma escalável e previsível.', bgColor: '#ffffff' },
  animated_text: { text: 'Texto com Animação', animation: 'fade-up', color: '#dc2626', size: 'text-5xl', align: 'center', weight: 'font-extrabold' },
  funnel: { 
    stages: [
      { name: 'Visitantes', value: '10.000' },
      { name: 'Leads', value: '500' },
      { name: 'Oportunidades', value: '150' },
      { name: 'Vendas', value: '50' }
    ],
    color: '#dc2626'
  },
  icon_list: {
    items: ['Design Responsivo e Moderno', 'Otimizado para SEO e Conversão', 'Integração com CRM e Automação'],
    iconColor: '#10b981',
    textColor: '#52525b'
  },
  pricing: {
    title: 'Plano Profissional',
    price: 'R$ 997',
    period: '/mês',
    items: ['Acesso Completo à Plataforma', 'Suporte Prioritário 24/7', 'Atualizações Gratuitas', 'Consultoria Mensal'],
    buttonText: 'Assinar Agora',
    buttonColor: '#18181b',
    bgColor: '#ffffff'
  },
  testimonial: {
    quote: 'Esta ferramenta mudou completamente a forma como criamos páginas. É incrivelmente rápida, intuitiva e os resultados são fantásticos.',
    author: 'Maria Silva',
    role: 'Diretora de Marketing',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bgColor: '#f8fafc'
  },
  timeline: {
    steps: [
      { title: 'Passo 1: Planejamento', desc: 'Definição de metas, público-alvo e estratégia de comunicação.' },
      { title: 'Passo 2: Execução', desc: 'Criação das campanhas, landing pages e automações.' },
      { title: 'Passo 3: Escala', desc: 'Otimização contínua, testes A/B e aumento de verba.' }
    ],
    color: '#3b82f6'
  },
  navbar: {
    logoText: 'Minha Marca',
    links: ['Início', 'Sobre', 'Serviços', 'Contato'],
    buttonText: 'Falar com Especialista',
    bgColor: '#ffffff',
    textColor: '#18181b'
  },
  slider: {
    slides: [
      { title: 'Design Moderno', desc: 'Crie interfaces incríveis com facilidade.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
      { title: 'Alta Conversão', desc: 'Focado em resultados e performance.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop' }
    ],
    height: '400'
  },
  feature_grid: {
    columns: '3',
    features: [
      { title: 'Rápido', desc: 'Carregamento otimizado' },
      { title: 'Responsivo', desc: 'Funciona em qualquer tela' },
      { title: 'Seguro', desc: 'Proteção de ponta a ponta' }
    ],
    bgColor: '#ffffff'
  },
  gallery: {
    columns: '3',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop'
    ],
    gap: '16',
    radius: 'rounded-xl'
  },
  grid: {
    columns: '2',
    gap: '16',
    padding: '16',
    bgColor: 'transparent',
    radius: 'rounded-none'
  },
  container: {
    padding: '16',
    bgColor: 'transparent',
    radius: 'rounded-none',
    shadow: 'shadow-none',
    align: 'left'
  },
  column: {
    padding: '16',
    bgColor: 'transparent',
    radius: 'rounded-none',
    shadow: 'shadow-none',
    align: 'left'
  },
  countdown: {
    targetDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    targetTime: '23:59',
    color: '#dc2626',
    bgColor: '#ffffff',
    labelColor: '#52525b',
    expiredText: 'Oferta Encerrada!'
  },
  whatsapp_button: {
    link: 'https://wa.me/5511999999999',
    position: 'bottom-right',
    bgColor: '#25D366',
    iconColor: '#ffffff'
  },
  tabs: {
    tabs: [
      { title: 'Aba 1', content: 'Conteúdo da primeira aba.' },
      { title: 'Aba 2', content: 'Conteúdo da segunda aba.' },
      { title: 'Aba 3', content: 'Conteúdo da terceira aba.' }
    ],
    activeColor: '#3b82f6',
    bgColor: '#ffffff'
  },
  progress_bar: {
    percentage: '75',
    label: 'Vagas Preenchidas',
    color: '#10b981',
    bgColor: '#e5e7eb',
    height: '16'
  },
  star_rating: {
    rating: '5',
    maxStars: '5',
    color: '#fbbf24',
    size: '24',
    align: 'center'
  },
  google_map: {
    address: 'Av. Paulista, 1000, São Paulo, SP',
    height: '400',
    zoom: '15',
    radius: 'rounded-xl'
  },
  comparison_table: {
    title: 'Comparativo de Planos',
    headers: ['Recurso', 'Nosso Plano', 'Concorrente'],
    rows: [
      { feature: 'Suporte 24/7', us: true, them: false },
      { feature: 'Atualizações', us: true, them: true },
      { feature: 'Treinamento', us: true, them: false }
    ],
    color: '#10b981',
    bgColor: '#ffffff'
  },
  image_carousel: {
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
    ],
    height: '400',
    radius: 'rounded-xl',
    autoPlay: true,
    interval: '3000'
  },
  toast_notification: {
    name: 'João S.',
    action: 'acabou de comprar o plano Pro',
    timeAgo: 'há 2 minutos',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    position: 'bottom-left',
    bgColor: '#ffffff',
    textColor: '#18181b'
  }
};

const ALIGN_OPTIONS = [
  { label: 'Esq', value: 'left' },
  { label: 'Centro', value: 'center' },
  { label: 'Dir', value: 'right' }
];

const ANIMATION_OPTIONS = [
  { label: 'Nenhuma', value: 'none' },
  { label: 'Fade Up', value: 'fade-up' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Bounce', value: 'bounce' },
  { label: 'Scale In', value: 'scale' }
];

export default function Builder({ 
  initialElements, 
  onSave, 
  onBack 
}: { 
  initialElements?: ElementData[], 
  onSave?: (elements: ElementData[]) => void, 
  onBack?: () => void 
}) {
  const [elements, setElements] = useState<ElementData[]>(() => {
    if (initialElements) return initialElements;
    const saved = localStorage.getItem('taggo_builder_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');

  // Auto-save
  useEffect(() => {
    localStorage.setItem('taggo_builder_data', JSON.stringify(elements));
  }, [elements]);

  // Export/Import
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "taggo_landing_page.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setElements(json);
      } catch (err) {
        alert("Arquivo inválido!");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData('elementType', type);
  };

  const addElementToParent = (items: ElementData[], parentId: string, newEl: ElementData): ElementData[] => {
    return items.map(item => {
      if (item.id === parentId) {
        return { ...item, children: [...(item.children || []), newEl] };
      }
      if (item.children) {
        return { ...item, children: addElementToParent(item.children, parentId, newEl) };
      }
      return item;
    });
  };

  const handleDrop = (e: React.DragEvent, parentId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData('elementType') as ElementType;
    if (!type) return;

    const newElement: ElementData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      props: { ...DEFAULT_PROPS[type] },
      ...(type === 'grid' || type === 'container' || type === 'column' ? { children: [] } : {})
    };

    if (type === 'grid') {
      const colsCount = parseInt(DEFAULT_PROPS.grid.columns || '2');
      newElement.children = Array.from({ length: colsCount }).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        type: 'column',
        props: { ...DEFAULT_PROPS.column },
        children: []
      }));
    }

    if (parentId) {
      setElements(addElementToParent(elements, parentId, newElement));
    } else {
      setElements([...elements, newElement]);
    }
    setSelectedId(newElement.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // --- Element Actions ---
  const updateElementRecursive = (items: ElementData[], id: string, newProps: Record<string, any>): ElementData[] => {
    return items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, props: { ...item.props, ...newProps } };
        
        if (item.type === 'grid' && newProps.columns) {
          const newColCount = parseInt(newProps.columns);
          const currentCols = item.children || [];
          if (newColCount > currentCols.length) {
            const colsToAdd = newColCount - currentCols.length;
            const newCols = Array.from({ length: colsToAdd }).map(() => ({
              id: Math.random().toString(36).substr(2, 9),
              type: 'column' as ElementType,
              props: { ...DEFAULT_PROPS.column },
              children: []
            }));
            updatedItem.children = [...currentCols, ...newCols];
          } else if (newColCount < currentCols.length) {
            updatedItem.children = currentCols.slice(0, newColCount);
          }
        }
        
        return updatedItem;
      }
      if (item.children) {
        return { ...item, children: updateElementRecursive(item.children, id, newProps) };
      }
      return item;
    });
  };

  const deleteElementRecursive = (items: ElementData[], id: string): ElementData[] => {
    return items.filter(item => item.id !== id).map(item => {
      if (item.children) {
        return { ...item, children: deleteElementRecursive(item.children, id) };
      }
      return item;
    });
  };

  const moveElementRecursive = (items: ElementData[], id: string, direction: 'up' | 'down'): ElementData[] => {
    const index = items.findIndex(el => el.id === id);
    if (index !== -1) {
      const newItems = [...items];
      if (direction === 'up' && index > 0) {
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      } else if (direction === 'down' && index < newItems.length - 1) {
        [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      }
      return newItems;
    }
    return items.map(item => {
      if (item.children) {
        return { ...item, children: moveElementRecursive(item.children, id, direction) };
      }
      return item;
    });
  };

  const updateElement = (id: string, newProps: Record<string, any>) => {
    setElements(updateElementRecursive(elements, id, newProps));
  };

  const deleteElement = (id: string) => {
    setElements(deleteElementRecursive(elements, id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    setElements(moveElementRecursive(elements, id, direction));
  };

  const findElementRecursive = (items: ElementData[], id: string): ElementData | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findElementRecursive(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selectedElement = selectedId ? findElementRecursive(elements, selectedId) : undefined;

  const renderElementNode = (el: ElementData) => {
    const isSelected = selectedId === el.id;
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        key={el.id}
        onClick={(e) => { e.stopPropagation(); if(!previewMode) setSelectedId(el.id); }}
        className={`relative group transition-all duration-200 ${previewMode ? '' : 'border-2 rounded-lg p-2'} ${!previewMode && isSelected ? 'border-red-500 shadow-md z-10' : !previewMode ? 'border-transparent hover:border-zinc-200 hover:bg-zinc-50/50' : ''}`}
      >
        {/* Hover/Active Controls */}
        {!previewMode && (isSelected || true) && (
          <div className={`absolute -top-4 right-4 bg-zinc-900 text-white rounded-md shadow-lg flex items-center overflow-hidden transition-opacity z-20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 border-r border-zinc-700 text-zinc-400">
              {el.type}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setActiveTab('layers'); setSelectedId(el.id); }} className="p-1.5 hover:bg-zinc-700 border-r border-zinc-700" title="Ver na Estrutura"><Layers className="w-3.5 h-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); moveElement(el.id, 'up'); }} className="p-1.5 hover:bg-zinc-700" title="Mover para cima"><ArrowUp className="w-3.5 h-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); moveElement(el.id, 'down'); }} className="p-1.5 hover:bg-zinc-700 border-l border-zinc-700" title="Mover para baixo"><ArrowDown className="w-3.5 h-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }} className="p-1.5 hover:bg-red-600 border-l border-zinc-700 text-red-400 hover:text-white" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
        
        {/* Render Element */}
        <div className={`${(el.type === 'grid' || el.type === 'container' || el.type === 'column') && !previewMode ? '' : 'pointer-events-none'} ${el.type === 'button' ? `flex justify-${el.props.align === 'left' ? 'start' : el.props.align === 'right' ? 'end' : 'center'}` : ''} ${el.type === 'column' ? 'h-full' : ''}`}>
          {el.type === 'grid' ? (
            <div 
              className={`grid ${el.props.columns === '1' ? 'grid-cols-1' : el.props.columns === '2' ? 'grid-cols-2' : el.props.columns === '3' ? 'grid-cols-3' : el.props.columns === '4' ? 'grid-cols-4' : el.props.columns === '5' ? 'grid-cols-5' : 'grid-cols-6'} ${el.props.radius}`}
              style={{ 
                gap: `${el.props.gap}px`, 
                padding: `${el.props.padding}px`,
                backgroundColor: el.props.bgColor 
              }}
            >
              {(!el.children || el.children.length === 0) && !previewMode ? (
                <div 
                  className="col-span-full p-8 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50"
                  onDrop={(e) => handleDrop(e, el.id)}
                  onDragOver={handleDragOver}
                >
                  <Plus className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Arraste elementos para este Grid</span>
                </div>
              ) : (
                el.children?.map(child => renderElementNode(child))
              )}
            </div>
          ) : el.type === 'container' || el.type === 'column' ? (
            <div 
              className={`flex flex-col ${el.props.radius} ${el.props.shadow} h-full`}
              style={{ 
                padding: `${el.props.padding}px`,
                backgroundColor: el.props.bgColor,
                alignItems: el.props.align === 'center' ? 'center' : el.props.align === 'right' ? 'flex-end' : 'flex-start'
              }}
              onDrop={(e) => handleDrop(e, el.id)}
              onDragOver={handleDragOver}
            >
              {(!el.children || el.children.length === 0) && !previewMode ? (
                <div className="w-full h-full min-h-[120px] border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50">
                  <Plus className="w-6 h-6 mb-2 opacity-50" />
                  <span className="text-xs font-medium text-center px-2">Arraste para esta {el.type === 'column' ? 'coluna' : 'área'}</span>
                </div>
              ) : (
                el.children?.map(child => renderElementNode(child))
              )}
            </div>
          ) : (
            <RenderElement element={el} previewMode={previewMode} />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen w-full flex bg-zinc-100 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR: WIDGETS */}
      {!previewMode && (
        <div className="w-72 bg-zinc-900 text-zinc-300 flex flex-col border-r border-zinc-800 z-10 shadow-xl transition-all">
          <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
            <LayoutTemplate className="w-6 h-6 text-red-500" />
            <h1 className="font-bold text-white tracking-wide">Taggo Builder</h1>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            
            <WidgetCategory title="Layout & Navegação">
            <DraggableWidget type="navbar" icon={<Navigation />} label="Menu (Navbar)" onDragStart={handleDragStart} />
            <DraggableWidget type="feature_grid" icon={<Columns />} label="Grid de Colunas" onDragStart={handleDragStart} />
            <DraggableWidget type="gallery" icon={<Grid3X3 />} label="Galeria" onDragStart={handleDragStart} />
            <DraggableWidget type="slider" icon={<GalleryHorizontal />} label="Slider" onDragStart={handleDragStart} />
          </WidgetCategory>

          <WidgetCategory title="Básicos">
            <DraggableWidget type="heading" icon={<Type />} label="Título" onDragStart={handleDragStart} />
            <DraggableWidget type="paragraph" icon={<AlignLeft />} label="Texto" onDragStart={handleDragStart} />
            <DraggableWidget type="button" icon={<MousePointerClick />} label="Botão" onDragStart={handleDragStart} />
            <DraggableWidget type="image" icon={<ImageIcon />} label="Imagem" onDragStart={handleDragStart} />
          </WidgetCategory>

          <WidgetCategory title="Estrutura & Mídia">
            <DraggableWidget type="grid" icon={<Grid3X3 />} label="Grid / Seção" onDragStart={handleDragStart} />
            <DraggableWidget type="container" icon={<Box />} label="Contêiner" onDragStart={handleDragStart} />
            <DraggableWidget type="divider" icon={<Minus />} label="Divisor" onDragStart={handleDragStart} />
            <DraggableWidget type="spacer" icon={<Maximize2 />} label="Espaço" onDragStart={handleDragStart} />
            <DraggableWidget type="video" icon={<Youtube />} label="Vídeo" onDragStart={handleDragStart} />
            <DraggableWidget type="card" icon={<Layout />} label="Cartão" onDragStart={handleDragStart} />
          </WidgetCategory>

          <WidgetCategory title="Avançados & Conversão">
            <DraggableWidget type="funnel" icon={<Filter />} label="Funil" onDragStart={handleDragStart} />
            <DraggableWidget type="pricing" icon={<DollarSign />} label="Preço" onDragStart={handleDragStart} />
            <DraggableWidget type="icon_list" icon={<ListChecks />} label="Lista de Ícones" onDragStart={handleDragStart} />
            <DraggableWidget type="timeline" icon={<GitCommit />} label="Linha do Tempo" onDragStart={handleDragStart} />
            <DraggableWidget type="testimonial" icon={<MessageSquareQuote />} label="Depoimento" onDragStart={handleDragStart} />
            <DraggableWidget type="countdown" icon={<Timer />} label="Contador" onDragStart={handleDragStart} />
            <DraggableWidget type="whatsapp_button" icon={<MessageCircle />} label="WhatsApp" onDragStart={handleDragStart} />
            <DraggableWidget type="toast_notification" icon={<Bell />} label="Notificação" onDragStart={handleDragStart} />
          </WidgetCategory>

          <WidgetCategory title="Interativos & Animados">
            <DraggableWidget type="stats" icon={<BarChart />} label="Estatística" onDragStart={handleDragStart} />
            <DraggableWidget type="accordion" icon={<List />} label="Sanfona (FAQ)" onDragStart={handleDragStart} />
            <DraggableWidget type="tabs" icon={<FolderOpen />} label="Abas" onDragStart={handleDragStart} />
            <DraggableWidget type="progress_bar" icon={<Activity />} label="Progresso" onDragStart={handleDragStart} />
            <DraggableWidget type="star_rating" icon={<Star />} label="Avaliação" onDragStart={handleDragStart} />
            <DraggableWidget type="google_map" icon={<MapPin />} label="Mapa" onDragStart={handleDragStart} />
            <DraggableWidget type="comparison_table" icon={<Table />} label="Comparação" onDragStart={handleDragStart} />
            <DraggableWidget type="image_carousel" icon={<Images />} label="Carrossel" onDragStart={handleDragStart} />
            <DraggableWidget type="animated_text" icon={<Sparkles className="text-yellow-400" />} label="Texto Animado" onDragStart={handleDragStart} />
          </WidgetCategory>

          <p className="text-xs text-zinc-500 mt-8 text-center px-4">Arraste os elementos para a área central para construir sua página.</p>
          </div>
        </div>
      )}

      {/* CENTER: CANVAS (DROP ZONE) */}
      <div 
        className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar bg-zinc-200/50"
        onDrop={(e) => handleDrop(e)}
        onDragOver={handleDragOver}
        onClick={() => setSelectedId(null)}
      >
        {/* Top Toolbar */}
        <div className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-zinc-100 text-zinc-700 hover:bg-zinc-200 mr-2">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
            )}
            <button onClick={() => { setPreviewMode(!previewMode); setSelectedId(null); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${previewMode ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}>
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? 'Sair do Preview' : 'Preview'}
            </button>
          </div>
          {!previewMode && (
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-md text-sm font-medium transition-colors cursor-pointer">
                <Upload className="w-4 h-4" /> Importar
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-md text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Exportar
              </button>
              <div className="w-px h-6 bg-zinc-300 mx-1" />
              <button onClick={() => { if(confirm('Tem certeza que deseja limpar tudo?')) setElements([]) }} className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors">
                <Trash className="w-4 h-4" /> Limpar
              </button>
              {onSave && (
                <>
                  <div className="w-px h-6 bg-zinc-300 mx-1" />
                  <button onClick={() => onSave(elements)} className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Salvar Proposta
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className={`min-h-full flex justify-center ${previewMode ? 'p-0' : 'p-8'}`}>
          <div className={`w-full max-w-5xl bg-white min-h-[800px] transition-all ${previewMode ? '' : 'shadow-sm border border-zinc-200 rounded-lg p-8 pb-32'}`}>
            {elements.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl p-12 bg-zinc-50/50">
                <Plus className="w-12 h-12 mb-4 text-zinc-300" />
                <p className="text-lg font-medium text-zinc-600">Sua página está vazia</p>
                <p className="text-sm mt-2">Arraste elementos da barra lateral para começar a construir.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <AnimatePresence>
                  {elements.map((el) => renderElementNode(el))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: PROPERTIES PANEL */}
      {!previewMode && (
        <div className="w-80 bg-white border-l border-zinc-200 flex flex-col z-10 shadow-xl transition-all">
          <div className="flex border-b border-zinc-200 bg-zinc-50 shrink-0">
            <button 
              onClick={() => setActiveTab('properties')}
              className={`flex-1 p-3 flex items-center justify-center gap-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'properties' ? 'border-red-500 text-red-600 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
            >
              <Settings className="w-4 h-4" /> Propriedades
            </button>
            <button 
              onClick={() => setActiveTab('layers')}
              className={`flex-1 p-3 flex items-center justify-center gap-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'layers' ? 'border-red-500 text-red-600 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
            >
              <Layers className="w-4 h-4" /> Estrutura
            </button>
          </div>
        
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'layers' ? (
            elements.length === 0 ? (
              <div className="text-center text-zinc-400 mt-10">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Nenhum elemento na página ainda.</p>
              </div>
            ) : (
              <LayerTree elements={elements} selectedId={selectedId} setSelectedId={setSelectedId} />
            )
          ) : !selectedElement ? (
            <div className="text-center text-zinc-400 mt-10">
              <MousePointerClick className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Selecione um elemento na tela para editar suas propriedades.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                Editando: {selectedElement.type.replace('_', ' ')}
              </div>

              {/* --- DYNAMIC PROPERTY INPUTS --- */}
              
              {/* Text Inputs */}
              {['text', 'title', 'label', 'value', 'suffix', 'buttonText', 'price', 'period', 'quote', 'author', 'role', 'logoText', 'expiredText', 'percentage', 'rating', 'maxStars', 'size', 'address', 'zoom', 'name', 'action', 'timeAgo', 'height'].map(propKey => (
                propKey in selectedElement.props && (
                  <div key={propKey}>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                      {propKey === 'text' ? 'Texto' : propKey === 'title' ? 'Título' : propKey === 'label' ? 'Rótulo' : propKey === 'value' ? 'Valor' : propKey === 'suffix' ? 'Sufixo' : propKey === 'buttonText' ? 'Texto do Botão' : propKey === 'price' ? 'Preço' : propKey === 'period' ? 'Período' : propKey === 'quote' ? 'Citação' : propKey === 'author' ? 'Autor' : propKey === 'role' ? 'Cargo' : propKey === 'logoText' ? 'Texto da Logo' : propKey === 'expiredText' ? 'Texto Expirado' : propKey === 'percentage' ? 'Porcentagem' : propKey === 'rating' ? 'Avaliação' : propKey === 'maxStars' ? 'Máx. Estrelas' : propKey === 'size' ? 'Tamanho' : propKey === 'address' ? 'Endereço' : propKey === 'zoom' ? 'Zoom' : propKey === 'name' ? 'Nome' : propKey === 'action' ? 'Ação' : propKey === 'timeAgo' ? 'Tempo Atrás' : propKey === 'height' ? 'Altura' : propKey}
                    </label>
                    {selectedElement.type === 'paragraph' && propKey === 'text' ? (
                      <textarea 
                        value={selectedElement.props[propKey]} 
                        onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })}
                        className="w-full border border-zinc-300 rounded-md p-2 text-sm min-h-[100px]"
                      />
                    ) : selectedElement.type === 'testimonial' && propKey === 'quote' ? (
                      <textarea 
                        value={selectedElement.props[propKey]} 
                        onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })}
                        className="w-full border border-zinc-300 rounded-md p-2 text-sm min-h-[80px]"
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={selectedElement.props[propKey]} 
                        onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })}
                        className="w-full border border-zinc-300 rounded-md p-2 text-sm"
                      />
                    )}
                  </div>
                )
              ))}

              {/* Date/Time Inputs */}
              {['targetDate', 'targetTime'].map(propKey => (
                propKey in selectedElement.props && (
                  <div key={propKey}>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                      {propKey === 'targetDate' ? 'Data Alvo' : 'Hora Alvo'}
                    </label>
                    <input 
                      type={propKey === 'targetDate' ? 'date' : 'time'} 
                      value={selectedElement.props[propKey]} 
                      onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })}
                      className="w-full border border-zinc-300 rounded-md p-2 text-sm"
                    />
                  </div>
                )
              ))}

              {/* Textareas for Descriptions/Content */}
              {['description', 'content'].map(propKey => (
                propKey in selectedElement.props && (
                  <div key={propKey}>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{propKey === 'description' ? 'Descrição' : 'Conteúdo'}</label>
                    <textarea 
                      value={selectedElement.props[propKey]} 
                      onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })}
                      className="w-full border border-zinc-300 rounded-md p-2 text-sm min-h-[80px]"
                    />
                  </div>
                )
              ))}

              {/* URL Inputs */}
              {['url', 'imageUrl', 'avatarUrl', 'link'].map(propKey => (
                propKey in selectedElement.props && (
                  <div key={propKey}>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">URL da {propKey === 'imageUrl' ? 'Imagem' : propKey === 'avatarUrl' ? 'Avatar' : propKey === 'link' ? 'Link' : selectedElement.type === 'video' ? 'Vídeo (Embed)' : 'Mídia'}</label>
                    <input 
                      type="text" 
                      value={selectedElement.props[propKey]} 
                      onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })}
                      className="w-full border border-zinc-300 rounded-md p-2 text-sm"
                    />
                  </div>
                )
              ))}

              {/* Alignment */}
              {('align' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Alinhamento</label>
                  <div className="flex bg-zinc-100 rounded-md p-1">
                    {ALIGN_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateElement(selectedElement.id, { align: opt.value })}
                        className={`flex-1 py-1.5 text-xs font-medium rounded ${selectedElement.props.align === opt.value ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {['color', 'bgColor', 'textColor', 'iconColor', 'buttonColor', 'labelColor', 'activeColor'].map(propKey => (
                propKey in selectedElement.props && (
                  <div key={propKey}>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                      {propKey === 'color' ? 'Cor Principal' : propKey === 'bgColor' ? 'Cor de Fundo' : propKey === 'iconColor' ? 'Cor do Ícone' : propKey === 'buttonColor' ? 'Cor do Botão' : propKey === 'labelColor' ? 'Cor do Rótulo' : propKey === 'activeColor' ? 'Cor Ativa' : 'Cor do Texto'}
                    </label>
                    <div className="flex gap-2">
                      <input type="color" value={selectedElement.props[propKey]} onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })} className="w-8 h-8 rounded cursor-pointer p-0 border-0" />
                      <input type="text" value={selectedElement.props[propKey]} onChange={(e) => updateElement(selectedElement.id, { [propKey]: e.target.value })} className="flex-1 border border-zinc-300 rounded-md p-2 text-sm font-mono uppercase" />
                    </div>
                  </div>
                )
              ))}

              {/* Selects (Size, Radius, Shadow, Animation, Style) */}
              {('position' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Posição</label>
                  <select value={selectedElement.props.position} onChange={(e) => updateElement(selectedElement.id, { position: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm bg-white">
                    <option value="bottom-right">Inferior Direito</option>
                    <option value="bottom-left">Inferior Esquerdo</option>
                    <option value="top-right">Superior Direito</option>
                    <option value="top-left">Superior Esquerdo</option>
                  </select>
                </div>
              )}

              {('columns' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Colunas</label>
                  <select value={selectedElement.props.columns} onChange={(e) => updateElement(selectedElement.id, { columns: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm bg-white">
                    <option value="1">1 Coluna</option>
                    <option value="2">2 Colunas</option>
                    <option value="3">3 Colunas</option>
                    <option value="4">4 Colunas</option>
                    {selectedElement.type === 'grid' && <option value="5">5 Colunas</option>}
                    {selectedElement.type === 'grid' && <option value="6">6 Colunas</option>}
                  </select>
                </div>
              )}

              {('size' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Tamanho do Texto</label>
                  <select value={selectedElement.props.size} onChange={(e) => updateElement(selectedElement.id, { size: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm bg-white">
                    <option value="text-sm">Pequeno</option>
                    <option value="text-base">Normal</option>
                    <option value="text-xl">Grande</option>
                    <option value="text-3xl">Muito Grande</option>
                    <option value="text-5xl">Gigante</option>
                    <option value="text-7xl">Titã</option>
                  </select>
                </div>
              )}

              {('radius' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Arredondamento</label>
                  <select value={selectedElement.props.radius} onChange={(e) => updateElement(selectedElement.id, { radius: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm bg-white">
                    <option value="rounded-none">Quadrado</option>
                    <option value="rounded-md">Suave</option>
                    <option value="rounded-xl">Arredondado</option>
                    <option value="rounded-2xl">Muito Arredondado</option>
                    <option value="rounded-full">Pílula</option>
                  </select>
                </div>
              )}

              {('shadow' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Sombra</label>
                  <select value={selectedElement.props.shadow} onChange={(e) => updateElement(selectedElement.id, { shadow: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm bg-white">
                    <option value="shadow-none">Sem Sombra</option>
                    <option value="shadow-sm">Pequena</option>
                    <option value="shadow-md">Média</option>
                    <option value="shadow-lg">Grande</option>
                    <option value="shadow-xl">Extra Grande</option>
                  </select>
                </div>
              )}

              {('animation' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Animação</label>
                  <select value={selectedElement.props.animation} onChange={(e) => updateElement(selectedElement.id, { animation: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm bg-white">
                    {ANIMATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              )}

              {('style' in selectedElement.props) && selectedElement.type === 'divider' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Estilo da Linha</label>
                  <select value={selectedElement.props.style} onChange={(e) => updateElement(selectedElement.id, { style: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm bg-white">
                    <option value="solid">Sólida</option>
                    <option value="dashed">Tracejada</option>
                    <option value="dotted">Pontilhada</option>
                  </select>
                </div>
              )}

              {/* Number Inputs (Thickness, Height) */}
              {('gap' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Espaçamento (px)</label>
                  <input type="number" min="0" max="100" value={selectedElement.props.gap} onChange={(e) => updateElement(selectedElement.id, { gap: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm" />
                </div>
              )}

              {('padding' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Padding Interno (px)</label>
                  <input type="number" min="0" max="100" value={selectedElement.props.padding} onChange={(e) => updateElement(selectedElement.id, { padding: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm" />
                </div>
              )}

              {('thickness' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Espessura (px)</label>
                  <input type="number" min="1" max="20" value={selectedElement.props.thickness} onChange={(e) => updateElement(selectedElement.id, { thickness: e.target.value })} className="w-full border border-zinc-300 rounded-md p-2 text-sm" />
                </div>
              )}

              {('height' in selectedElement.props) && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Altura (px)</label>
                  <input type="range" min="10" max="200" value={selectedElement.props.height} onChange={(e) => updateElement(selectedElement.id, { height: e.target.value })} className="w-full accent-red-500" />
                  <div className="text-center text-xs text-zinc-500 mt-1">{selectedElement.props.height}px</div>
                </div>
              )}

              {/* --- ARRAY EDITORS (Lists, Funnels, Timelines) --- */}
              {('links' in selectedElement.props) && (
                <div className="pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Links do Menu</label>
                  <div className="space-y-2">
                    {selectedElement.props.links.map((link: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          value={link} 
                          onChange={(e) => {
                            const newLinks = [...selectedElement.props.links];
                            newLinks[idx] = e.target.value;
                            updateElement(selectedElement.id, { links: newLinks });
                          }}
                          className="flex-1 border border-zinc-300 rounded-md p-2 text-sm"
                        />
                        <button 
                          onClick={() => {
                            const newLinks = selectedElement.props.links.filter((_: any, i: number) => i !== idx);
                            updateElement(selectedElement.id, { links: newLinks });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateElement(selectedElement.id, { links: [...selectedElement.props.links, 'Novo Link'] })}
                      className="w-full py-2 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-md text-sm font-bold hover:border-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Link
                    </button>
                  </div>
                </div>
              )}

              {('images' in selectedElement.props) && (
                <div className="pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Imagens da Galeria</label>
                  <div className="space-y-2">
                    {selectedElement.props.images.map((img: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          value={img} 
                          onChange={(e) => {
                            const newImages = [...selectedElement.props.images];
                            newImages[idx] = e.target.value;
                            updateElement(selectedElement.id, { images: newImages });
                          }}
                          className="flex-1 border border-zinc-300 rounded-md p-2 text-sm"
                          placeholder="URL da Imagem"
                        />
                        <button 
                          onClick={() => {
                            const newImages = selectedElement.props.images.filter((_: any, i: number) => i !== idx);
                            updateElement(selectedElement.id, { images: newImages });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateElement(selectedElement.id, { images: [...selectedElement.props.images, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'] })}
                      className="w-full py-2 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-md text-sm font-bold hover:border-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Imagem
                    </button>
                  </div>
                </div>
              )}

              {('slides' in selectedElement.props) && (
                <div className="pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Slides</label>
                  <div className="space-y-3">
                    {selectedElement.props.slides.map((slide: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-start bg-zinc-50 p-2 rounded-md border border-zinc-200">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" placeholder="URL da Imagem" value={slide.image} 
                            onChange={(e) => {
                              const newSlides = [...selectedElement.props.slides];
                              newSlides[idx].image = e.target.value;
                              updateElement(selectedElement.id, { slides: newSlides });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm"
                          />
                          <input 
                            type="text" placeholder="Título" value={slide.title} 
                            onChange={(e) => {
                              const newSlides = [...selectedElement.props.slides];
                              newSlides[idx].title = e.target.value;
                              updateElement(selectedElement.id, { slides: newSlides });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm font-bold"
                          />
                          <textarea 
                            placeholder="Descrição" value={slide.desc} 
                            onChange={(e) => {
                              const newSlides = [...selectedElement.props.slides];
                              newSlides[idx].desc = e.target.value;
                              updateElement(selectedElement.id, { slides: newSlides });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm min-h-[60px]"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newSlides = selectedElement.props.slides.filter((_: any, i: number) => i !== idx);
                            updateElement(selectedElement.id, { slides: newSlides });
                          }}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-md mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateElement(selectedElement.id, { slides: [...selectedElement.props.slides, { title: 'Novo Slide', desc: 'Descrição', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' }] })}
                      className="w-full py-2 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-md text-sm font-bold hover:border-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Slide
                    </button>
                  </div>
                </div>
              )}

              {('features' in selectedElement.props) && (
                <div className="pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Colunas / Recursos</label>
                  <div className="space-y-3">
                    {selectedElement.props.features.map((feature: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-start bg-zinc-50 p-2 rounded-md border border-zinc-200">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" placeholder="Título" value={feature.title} 
                            onChange={(e) => {
                              const newFeatures = [...selectedElement.props.features];
                              newFeatures[idx].title = e.target.value;
                              updateElement(selectedElement.id, { features: newFeatures });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm font-bold"
                          />
                          <textarea 
                            placeholder="Descrição" value={feature.desc} 
                            onChange={(e) => {
                              const newFeatures = [...selectedElement.props.features];
                              newFeatures[idx].desc = e.target.value;
                              updateElement(selectedElement.id, { features: newFeatures });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm min-h-[60px]"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newFeatures = selectedElement.props.features.filter((_: any, i: number) => i !== idx);
                            updateElement(selectedElement.id, { features: newFeatures });
                          }}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-md mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateElement(selectedElement.id, { features: [...selectedElement.props.features, { title: 'Novo Recurso', desc: 'Descrição' }] })}
                      className="w-full py-2 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-md text-sm font-bold hover:border-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Coluna
                    </button>
                  </div>
                </div>
              )}

              {('items' in selectedElement.props) && (
                <div className="pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Itens da Lista</label>
                  <div className="space-y-2">
                    {selectedElement.props.items.map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => {
                            const newItems = [...selectedElement.props.items];
                            newItems[idx] = e.target.value;
                            updateElement(selectedElement.id, { items: newItems });
                          }}
                          className="flex-1 border border-zinc-300 rounded-md p-2 text-sm"
                        />
                        <button 
                          onClick={() => {
                            const newItems = selectedElement.props.items.filter((_: any, i: number) => i !== idx);
                            updateElement(selectedElement.id, { items: newItems });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateElement(selectedElement.id, { items: [...selectedElement.props.items, 'Novo Item'] })}
                      className="w-full py-2 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-md text-sm font-bold hover:border-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Item
                    </button>
                  </div>
                </div>
              )}

              {('stages' in selectedElement.props) && (
                <div className="pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Estágios do Funil</label>
                  <div className="space-y-3">
                    {selectedElement.props.stages.map((stage: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-start bg-zinc-50 p-2 rounded-md border border-zinc-200">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" placeholder="Nome" value={stage.name} 
                            onChange={(e) => {
                              const newStages = [...selectedElement.props.stages];
                              newStages[idx].name = e.target.value;
                              updateElement(selectedElement.id, { stages: newStages });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm"
                          />
                          <input 
                            type="text" placeholder="Valor" value={stage.value} 
                            onChange={(e) => {
                              const newStages = [...selectedElement.props.stages];
                              newStages[idx].value = e.target.value;
                              updateElement(selectedElement.id, { stages: newStages });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm font-bold"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newStages = selectedElement.props.stages.filter((_: any, i: number) => i !== idx);
                            updateElement(selectedElement.id, { stages: newStages });
                          }}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-md mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateElement(selectedElement.id, { stages: [...selectedElement.props.stages, { name: 'Novo Estágio', value: '0' }] })}
                      className="w-full py-2 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-md text-sm font-bold hover:border-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Estágio
                    </button>
                  </div>
                </div>
              )}

              {('steps' in selectedElement.props) && (
                <div className="pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Passos da Linha do Tempo</label>
                  <div className="space-y-3">
                    {selectedElement.props.steps.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-start bg-zinc-50 p-2 rounded-md border border-zinc-200">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" placeholder="Título" value={step.title} 
                            onChange={(e) => {
                              const newSteps = [...selectedElement.props.steps];
                              newSteps[idx].title = e.target.value;
                              updateElement(selectedElement.id, { steps: newSteps });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm font-bold"
                          />
                          <textarea 
                            placeholder="Descrição" value={step.desc} 
                            onChange={(e) => {
                              const newSteps = [...selectedElement.props.steps];
                              newSteps[idx].desc = e.target.value;
                              updateElement(selectedElement.id, { steps: newSteps });
                            }}
                            className="w-full border border-zinc-300 rounded-md p-1.5 text-sm min-h-[60px]"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newSteps = selectedElement.props.steps.filter((_: any, i: number) => i !== idx);
                            updateElement(selectedElement.id, { steps: newSteps });
                          }}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-md mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateElement(selectedElement.id, { steps: [...selectedElement.props.steps, { title: 'Novo Passo', desc: 'Descrição do passo' }] })}
                      className="w-full py-2 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-md text-sm font-bold hover:border-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Passo
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}

// --- Subcomponents ---

function LayerTree({ elements, selectedId, setSelectedId, level = 0 }: { elements: ElementData[], selectedId: string | null, setSelectedId: (id: string) => void, level?: number }) {
  return (
    <div className="space-y-1">
      {elements.map(el => (
        <div key={el.id}>
          <div 
            onClick={() => setSelectedId(el.id)}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors ${selectedId === el.id ? 'bg-red-50 text-red-700 font-medium' : 'hover:bg-zinc-100 text-zinc-700'}`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            <div className="w-4 h-4 flex items-center justify-center text-zinc-400">
              {el.children && el.children.length > 0 ? <ChevronDown className="w-3 h-3" /> : <Minus className="w-3 h-3 opacity-50" />}
            </div>
            <span className="capitalize">{el.type.replace('_', ' ')}</span>
          </div>
          {el.children && el.children.length > 0 && (
            <LayerTree elements={el.children} selectedId={selectedId} setSelectedId={setSelectedId} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

function WidgetCategory({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 px-2">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {children}
      </div>
    </div>
  );
}

function DraggableWidget({ type, icon, label, onDragStart }: { type: ElementType, icon: React.ReactNode, label: string, onDragStart: (e: React.DragEvent, type: ElementType) => void }) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="flex flex-col items-center justify-center p-3 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 hover:border-red-500/50 rounded-xl cursor-grab active:cursor-grabbing transition-all group"
    >
      <div className="text-zinc-400 group-hover:text-red-400 mb-2 transition-colors">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <span className="text-[11px] font-medium text-center leading-tight">{label}</span>
    </div>
  );
}

// --- Dynamic Renderer ---
export function RenderElement({ element, previewMode }: { element: ElementData, previewMode?: boolean, key?: React.Key }) {
  const { type, props } = element;

  // Animation Helper for specific elements
  const getAnimationProps = (animType: string) => {
    switch (animType) {
      case 'fade-up': return { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };
      case 'scale': return { initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true } };
      case 'pulse': return { animate: { scale: [1, 1.05, 1] }, transition: { repeat: Infinity, duration: 2 } };
      case 'bounce': return { animate: { y: [0, -10, 0] }, transition: { repeat: Infinity, duration: 1.5 } };
      default: return {};
    }
  };

  switch (type) {
    case 'heading':
      return (
        <h2 className={`${props.size} ${props.weight} tracking-tight`} style={{ color: props.color, textAlign: props.align }}>
          {props.text}
        </h2>
      );
    
    case 'paragraph':
      return (
        <p className={`${props.size} leading-relaxed`} style={{ color: props.color, textAlign: props.align }}>
          {props.text}
        </p>
      );
    
    case 'button':
      return (
        <motion.button 
          {...getAnimationProps(props.animation)}
          className={`px-8 py-4 font-bold ${props.radius} shadow-lg hover:opacity-90 transition-opacity`}
          style={{ backgroundColor: props.bgColor, color: props.textColor }}
        >
          {props.text}
        </motion.button>
      );
    
    case 'image':
      return (
        <img 
          src={props.url} 
          alt={props.alt || 'Imagem'} 
          className={`${props.radius} ${props.shadow} object-cover`}
          style={{ width: props.width }}
        />
      );
    
    case 'divider':
      return (
        <div className="w-full flex justify-center py-4">
          <div style={{ width: '100%', borderTopWidth: `${props.thickness}px`, borderTopStyle: props.style, borderTopColor: props.color }} />
        </div>
      );
    
    case 'spacer':
      return <div style={{ height: `${props.height}px`, width: '100%' }} />;
    
    case 'video':
      // Basic check to ensure it's an embed URL if it's youtube
      const videoUrl = props.url.includes('watch?v=') ? props.url.replace('watch?v=', 'embed/') : props.url;
      return (
        <div className={`w-full aspect-video overflow-hidden ${props.radius} ${props.shadow} bg-zinc-100 flex items-center justify-center relative`}>
          {videoUrl ? (
            <iframe src={videoUrl} className="w-full h-full absolute inset-0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          ) : (
            <PlayCircle className="w-16 h-16 text-zinc-300" />
          )}
        </div>
      );
    
    case 'card':
      return (
        <div className={`flex flex-col md:flex-row overflow-hidden ${props.radius} ${props.shadow} border border-zinc-100`} style={{ backgroundColor: props.bgColor }}>
          <div className="md:w-2/5 h-48 md:h-auto bg-zinc-200">
            <img src={props.imageUrl} alt={props.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:w-3/5 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">{props.title}</h3>
            <p className="text-zinc-600 mb-6 leading-relaxed">{props.description}</p>
            <div>
              <button className="px-6 py-2.5 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                {props.buttonText}
              </button>
            </div>
          </div>
        </div>
      );
    
    case 'stats':
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="text-6xl font-black tracking-tighter mb-2"
            style={{ color: props.color }}
          >
            {props.value}<span className="text-4xl ml-1">{props.suffix}</span>
          </motion.div>
          <div className="text-zinc-500 font-bold uppercase tracking-wider text-sm">{props.label}</div>
        </div>
      );
    
    case 'accordion':
      // Note: In builder mode, we show it open or toggleable visually, but keep it simple for preview
      return (
        <div className="border border-zinc-200 rounded-xl overflow-hidden" style={{ backgroundColor: props.bgColor }}>
          <div className="p-5 flex justify-between items-center bg-zinc-50/50 border-b border-zinc-100">
            <h4 className="font-bold text-zinc-800">{props.title}</h4>
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="p-5 text-zinc-600 leading-relaxed">
            {props.content}
          </div>
        </div>
      );
    
    case 'animated_text':
      return (
        <motion.div {...getAnimationProps(props.animation)} className="w-full">
          <h2 className={`${props.size} ${props.weight} tracking-tight`} style={{ color: props.color, textAlign: props.align }}>
            {props.text}
          </h2>
        </motion.div>
      );

    case 'navbar':
      return (
        <div className="flex items-center justify-between py-4 px-6 border-b border-zinc-100" style={{ backgroundColor: props.bgColor }}>
          <div className="font-black text-xl tracking-tight" style={{ color: props.textColor }}>
            {props.logoText}
          </div>
          <div className="hidden md:flex items-center gap-6">
            {props.links.map((link: string, idx: number) => (
              <a key={idx} href="#" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: props.textColor }}>
                {link}
              </a>
            ))}
          </div>
          <button className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-colors">
            {props.buttonText}
          </button>
        </div>
      );

    case 'slider':
      return (
        <div className="w-full relative group overflow-hidden rounded-2xl shadow-lg" style={{ height: `${props.height}px` }}>
          <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory custom-scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {props.slides.map((slide: any, idx: number) => (
              <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                  <h3 className="text-4xl font-bold text-white mb-3">{slide.title}</h3>
                  <p className="text-lg text-white/90 max-w-2xl">{slide.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
            {props.slides.map((_: any, idx: number) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-white/50" />
            ))}
          </div>
        </div>
      );

    case 'feature_grid':
      const gridCols = props.columns === '1' ? 'grid-cols-1' : props.columns === '2' ? 'grid-cols-1 md:grid-cols-2' : props.columns === '4' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';
      return (
        <div className={`grid ${gridCols} gap-8 py-8`} style={{ backgroundColor: props.bgColor }}>
          {props.features.map((feature: any, idx: number) => (
            <div key={idx} className="flex flex-col p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h4>
              <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      );

    case 'gallery':
      const galCols = props.columns === '1' ? 'grid-cols-1' : props.columns === '2' ? 'grid-cols-2' : props.columns === '4' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';
      return (
        <div className={`grid ${galCols} py-4`} style={{ gap: `${props.gap}px` }}>
          {props.images.map((img: string, idx: number) => (
            <div key={idx} className={`relative aspect-square overflow-hidden ${props.radius} shadow-sm group`}>
              <img src={img} alt={`Galeria ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      );

    case 'funnel':
      return (
        <div className="flex flex-col items-center gap-3 w-full py-8">
          {props.stages.map((stage: any, idx: number) => {
            const width = 100 - (idx * (50 / Math.max(1, props.stages.length - 1)));
            return (
              <div 
                key={idx} 
                className="flex items-center justify-between px-6 py-4 rounded-xl text-white shadow-md transition-all hover:scale-[1.02]" 
                style={{ width: `${width}%`, backgroundColor: props.color, opacity: 1 - (idx * 0.15) }}
              >
                <span className="font-bold text-lg">{stage.name}</span>
                <span className="font-black text-2xl">{stage.value}</span>
              </div>
            );
          })}
        </div>
      );

    case 'icon_list':
      return (
        <ul className="space-y-4 py-4">
          {props.items.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" style={{ color: props.iconColor }} />
              <span className="text-lg font-medium" style={{ color: props.textColor }}>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'pricing':
      return (
        <div className="border border-zinc-200 rounded-3xl p-8 shadow-xl max-w-sm mx-auto flex flex-col my-8" style={{ backgroundColor: props.bgColor }}>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2 text-center">{props.title}</h3>
          <div className="text-center mb-8">
            <span className="text-5xl font-black text-zinc-900 tracking-tighter">{props.price}</span>
            <span className="text-zinc-500 font-medium ml-1">{props.period}</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {props.items.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: props.buttonColor }} />
                <span className="text-zinc-600 font-medium">{item}</span>
              </li>
            ))}
          </ul>
          <button 
            className="w-full py-4 rounded-xl font-bold text-white transition-transform hover:scale-105 shadow-lg mt-auto" 
            style={{ backgroundColor: props.buttonColor }}
          >
            {props.buttonText}
          </button>
        </div>
      );

    case 'testimonial':
      return (
        <div className="p-8 md:p-10 rounded-3xl shadow-sm relative mt-8 border border-zinc-100" style={{ backgroundColor: props.bgColor }}>
          <Quote className="absolute -top-6 left-8 w-12 h-12 text-zinc-200 opacity-80" />
          <p className="text-xl md:text-2xl italic text-zinc-700 mb-8 relative z-10 leading-relaxed">
            "{props.quote}"
          </p>
          <div className="flex items-center gap-4">
            <img src={props.avatarUrl} alt={props.author} className="w-14 h-14 rounded-full object-cover shadow-md" />
            <div>
              <h5 className="font-bold text-zinc-900 text-lg">{props.author}</h5>
              <span className="text-sm text-zinc-500 font-medium">{props.role}</span>
            </div>
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div className="relative border-l-2 ml-4 md:ml-8 py-4 space-y-10" style={{ borderColor: props.color }}>
          {props.steps.map((step: any, idx: number) => (
            <div key={idx} className="relative pl-8">
              <div 
                className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm" 
                style={{ backgroundColor: props.color }} 
              />
              <h4 className="text-xl font-bold text-zinc-900 mb-2">{step.title}</h4>
              <p className="text-zinc-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      );

    case 'countdown':
      return (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl shadow-sm" style={{ backgroundColor: props.bgColor }}>
          <div className="flex gap-4 text-center">
            {['Dias', 'Horas', 'Minutos', 'Segundos'].map((label, i) => (
              <div key={label} className="flex flex-col">
                <span className="text-3xl md:text-5xl font-bold font-mono" style={{ color: props.color }}>
                  {['00', '23', '59', '59'][i]}
                </span>
                <span className="text-xs uppercase tracking-wider mt-1" style={{ color: props.labelColor }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'whatsapp_button':
      return (
        <a 
          href={props.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${previewMode ? 'fixed' : 'relative mx-auto'} z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform ${previewMode ? (props.position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6') : ''}`}
          style={{ backgroundColor: props.bgColor }}
        >
          <MessageCircle className="w-8 h-8" style={{ color: props.iconColor }} />
        </a>
      );

    case 'tabs':
      return (
        <div className="w-full rounded-xl overflow-hidden shadow-sm border border-zinc-100" style={{ backgroundColor: props.bgColor }}>
          <div className="flex border-b border-zinc-200">
            {props.tabs.map((tab: any, idx: number) => (
              <button 
                key={idx}
                className={`flex-1 py-4 px-6 text-sm font-bold transition-colors ${idx === 0 ? '' : 'text-zinc-500 hover:text-zinc-700'}`}
                style={idx === 0 ? { color: props.activeColor, borderBottom: `2px solid ${props.activeColor}` } : {}}
              >
                {tab.title}
              </button>
            ))}
          </div>
          <div className="p-6 text-zinc-600 leading-relaxed">
            {props.tabs[0]?.content}
          </div>
        </div>
      );

    case 'progress_bar':
      return (
        <div className="w-full">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-zinc-700">{props.label}</span>
            <span style={{ color: props.color }}>{props.percentage}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ backgroundColor: props.bgColor, height: `${props.height}px` }}>
            <div 
              className="h-full rounded-full transition-all duration-1000" 
              style={{ width: `${props.percentage}%`, backgroundColor: props.color }}
            />
          </div>
        </div>
      );

    case 'star_rating':
      return (
        <div className={`flex gap-1 justify-${props.align === 'left' ? 'start' : props.align === 'right' ? 'end' : 'center'}`}>
          {Array.from({ length: parseInt(props.maxStars) || 5 }).map((_, idx) => (
            <Star 
              key={idx} 
              className={`${idx < parseInt(props.rating) ? 'fill-current' : 'text-zinc-300'}`} 
              style={{ width: `${props.size}px`, height: `${props.size}px`, color: idx < parseInt(props.rating) ? props.color : undefined }} 
            />
          ))}
        </div>
      );

    case 'google_map':
      return (
        <div className={`w-full overflow-hidden shadow-sm ${props.radius}`} style={{ height: `${props.height}px` }}>
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(props.address)}&t=&z=${props.zoom}&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>
      );

    case 'comparison_table':
      return (
        <div className="w-full overflow-x-auto rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: props.bgColor }}>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                {props.headers.map((header: string, idx: number) => (
                  <th key={idx} className="p-4 border-b border-zinc-200 font-bold text-zinc-800 bg-zinc-50/50">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.rows.map((row: any, idx: number) => (
                <tr key={idx} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-700">{row.feature}</td>
                  <td className="p-4 text-center">
                    {row.us ? <CheckCircle2 className="w-6 h-6 mx-auto" style={{ color: props.color }} /> : <Minus className="w-6 h-6 mx-auto text-zinc-300" />}
                  </td>
                  <td className="p-4 text-center">
                    {row.them ? <CheckCircle2 className="w-6 h-6 mx-auto text-zinc-400" /> : <Minus className="w-6 h-6 mx-auto text-zinc-300" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'image_carousel':
      return (
        <div className={`w-full overflow-hidden shadow-sm relative group ${props.radius}`} style={{ height: `${props.height}px` }}>
          <img src={props.images[0]} alt="Carousel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md text-zinc-800 hover:bg-white"><ChevronDown className="w-6 h-6 rotate-90" /></button>
            <button className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md text-zinc-800 hover:bg-white"><ChevronDown className="w-6 h-6 -rotate-90" /></button>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {props.images.map((_: any, idx: number) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      );

    case 'toast_notification':
      return (
        <div 
          className={`${previewMode ? 'fixed' : 'relative mx-auto'} z-50 flex items-center gap-4 p-4 rounded-xl shadow-xl border border-zinc-100 w-80 ${previewMode ? (props.position === 'bottom-left' ? 'bottom-6 left-6' : props.position === 'bottom-right' ? 'bottom-6 right-6' : props.position === 'top-left' ? 'top-6 left-6' : 'top-6 right-6') : ''}`}
          style={{ backgroundColor: props.bgColor, color: props.textColor }}
        >
          <img src={props.avatarUrl} alt={props.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{props.name}</p>
            <p className="text-xs opacity-90 truncate">{props.action}</p>
            <p className="text-[10px] opacity-70 mt-1">{props.timeAgo}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
