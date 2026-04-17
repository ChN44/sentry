import React, { useState } from 'react';
import { 
  LayoutDashboard, Receipt, Wallet, LineChart, 
  Settings, Bell, Send, Sparkles, Search, Plus, X, Trash2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

const DADOS_GRAFICO = [
  { mes: 'Jan', entrou: 4500, saiu: 3200 },
  { mes: 'Fev', entrou: 5200, saiu: 3800 },
  { mes: 'Mar', entrou: 4800, saiu: 4100 },
  { mes: 'Abr', entrou: 6100, saiu: 3900 },
];



interface Transacao {
  id: number;
  data: string;
  nome: string;
  categoria: string;
  valor: number;
}

export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState('inicio');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: 1, data: '16/04/2024', nome: 'Mercado', categoria: 'Arroz e Feijão', valor: -45.00 },
    { id: 2, data: '15/04/2024', nome: 'Sentry Pay', categoria: 'Trampo', valor: 8500.00 },
    { id: 3, data: '14/04/2024', nome: 'Posto Shell', categoria: 'Gasolina', valor: -200.00 }
  ]);

  const [form, setForm] = useState({
    data: '',
    nome: '',
    categoria: '',
    valor: ''
  });

  const validarForm = (): boolean => {
    setErro('');
    if (!form.data.trim()) {
      setErro('Data é obrigatória');
      return false;
    }
    if (!form.nome.trim()) {
      setErro('Descrição é obrigatória');
      return false;
    }
    if (!form.categoria.trim()) {
      setErro('Categoria é obrigatória');
      return false;
    }
    if (!form.valor.trim() || isNaN(parseFloat(form.valor))) {
      setErro('Valor inválido');
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErro('');
  };

  const adicionarTransacao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validarForm()) return;

    setCarregando(true);
    
    const partesData = form.data.split('-');
    const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

    const novaTransacao: Transacao = {
      id: Date.now(),
      data: dataFormatada,
      nome: form.nome,
      categoria: form.categoria,
      valor: parseFloat(form.valor)
    };

    setTransacoes([novaTransacao, ...transacoes]);
    setForm({ data: '', nome: '', categoria: '', valor: '' });
    setMostrarForm(false);
    setErro('');
    setCarregando(false);
  };

  const removerTransacao = (id: number) => {
    setTransacoes(transacoes.filter(t => t.id !== id));
  };

  const transacoesFiltradas = transacoes.filter(t =>
    t.nome.toLowerCase().includes(busca.toLowerCase()) ||
    t.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container-geral">
      <aside className="menu-lateral">
        <div className="logo-do-app">
          <div className="logo-container">
            <img
              src="src/assets/imagens/logo.png"
              alt="Logo Sentry"
              className="project-logo"
              onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/40?text=S'}}
            />
          </div>
        </div>
        <nav className="links-navegacao">
          <button className={`item-menu ${abaAtiva === 'inicio' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('inicio')}>
            <LayoutDashboard size={20}/> Início
          </button>
          <button className={`item-menu ${abaAtiva === 'extrato' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('extrato')}>
            <Receipt size={20}/> Extrato
          </button>
          <button className="item-menu"><Wallet size={20}/> Planejamento</button>
          <button className="item-menu"><LineChart size={20}/> Investimentos</button>
          <button className="item-menu"><Settings size={20}/> Ajustes</button>
        </nav>
      </aside>
      
      <main className="conteudo-principal">
        <header className="topo-da-pagina">
          <div className="saudacao-usuario">
            <h1>Fala, Sentry!</h1>
            <p>Gerencie seus gastos de forma livre.</p>
          </div>
          <div className="botoes-topo">
            <button className="botao-circular"><Bell size={20}/></button>
            <div className="foto-perfil">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sentry" alt="Perfil" />
            </div>
          </div>
        </header>
        
        <div className="layout-do-painel">
          <div className="coluna-financeira">
            {abaAtiva === 'inicio' ? (
              <>
                <section className="grade-resumo">
                  <div className="cartao-info">
                    <span className="titulo-cartao">Saldo Atual</span>
                    <h2 className="valor-cartao">R$ 24.500,00</h2>
                  </div>
                  <div className="cartao-info">
                    <span className="titulo-cartao">Entrou no mês</span>
                    <h2 className="valor-cartao cor-verde">R$ 6.100,00</h2>
                  </div>
                  <div className="cartao-info">
                    <span className="titulo-cartao">Gastos do mês</span>
                    <h2 className="valor-cartao cor-vermelha">R$ 3.900,00</h2>
                  </div>
                </section>
                
                <div className="area-do-grafico cartao-info">
                  <h3 className="titulo-sessao">Fluxo de Caixa</h3>
                  <div className="espaco-grafico">
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={DADOS_GRAFICO}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                        <XAxis dataKey="mes" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="entrou" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lista-transacoes cartao-info">
                  <div className="topo-lista">
                    <h3 className="titulo-sessao">Últimas movimentações</h3>
                    <button className="botao-link" onClick={() => setAbaAtiva('extrato')}>
                      Ver tudo
                    </button>
                  </div>
                  <table className="tabela-financeira">
                    <tbody>
                      {transacoes.slice(0, 3).map(t => (
                        <tr key={t.id}>
                          <td>{t.nome}</td>
                          <td><span className="etiqueta-generica">{t.categoria}</span></td>
                          <td className={`texto-direita ${t.valor < 0 ? 'cor-vermelha' : 'cor-verde'}`}>
                            {t.valor < 0 ? `- R$ ${Math.abs(t.valor).toFixed(2)}` : `+ R$ ${t.valor.toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="extrato-completo cartao-info">
                <div className="topo-lista-extrato">
                  <h3 className="titulo-sessao">Histórico de Transações</h3>
                  <div className="acoes-extrato">
                    <button className="botao-adicionar" onClick={() => setMostrarForm(!mostrarForm)} aria-expanded={mostrarForm}>
                      {mostrarForm ? <X size={16} /> : <Plus size={16} />}
                      {mostrarForm ? 'Cancelar' : 'Novo Registo'}
                    </button>
                    <div className="busca-extrato">
                      <Search size={16} />
                      <input 
                        type="text" 
                        placeholder="Procurar um gasto..." 
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        aria-label="Procurar transação"
                      />
                    </div>
                  </div>
                </div>

                {mostrarForm && (
                  <form onSubmit={adicionarTransacao} className="formulario-transacao">
                    {erro && <div className="erro-mensagem" role="alert">{erro}</div>}
                    
                    <div className="campo-formulario">
                      <label htmlFor="data">Data:</label>
                      <input 
                        type="date" 
                        id="data"
                        name="data" 
                        value={form.data} 
                        onChange={handleInputChange}
                        aria-label="Data da transação"
                        required 
                      />
                    </div>
                    
                    <div className="campo-formulario">
                      <label htmlFor="nome">Descrição:</label>
                      <input 
                        type="text" 
                        id="nome"
                        name="nome" 
                        placeholder="Ex: Mercado" 
                        value={form.nome} 
                        onChange={handleInputChange}
                        aria-label="Descrição da transação"
                        required 
                      />
                    </div>
                    
                    <div className="campo-formulario">
                      <label htmlFor="categoria">Categoria:</label>
                      <input 
                        type="text" 
                        id="categoria"
                        name="categoria" 
                        placeholder="Ex: Alimentação" 
                        value={form.categoria} 
                        onChange={handleInputChange}
                        aria-label="Categoria da transação"
                        required 
                      />
                    </div>
                    
                    <div className="campo-formulario">
                      <label htmlFor="valor">Valor:</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        id="valor"
                        name="valor" 
                        placeholder="Ex: -50.00" 
                        value={form.valor} 
                        onChange={handleInputChange}
                        aria-label="Valor da transação"
                        required 
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn-salvar"
                      disabled={carregando}
                      aria-busy={carregando}
                    >
                      {carregando ? 'Salvando...' : 'Salvar'}
                    </button>
                  </form>
                )}
                
                <table className="tabela-financeira">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Categoria</th>
                      <th className="texto-direita">Valor</th>
                      <th style={{ width: '40px' }}><span className="sr-only">Ações</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoesFiltradas.length > 0 ? (
                      transacoesFiltradas.map(t => (
                        <tr key={t.id}>
                          <td>{t.data}</td>
                          <td className="fonte-bold">{t.nome}</td>
                          <td>
                            <span className="etiqueta-generica">
                              {t.categoria}
                            </span>
                          </td>
                          <td className={`texto-direita ${t.valor < 0 ? 'cor-vermelha' : 'cor-verde'}`}>
                            {t.valor < 0 ? `- R$ ${Math.abs(t.valor).toFixed(2)}` : `+ R$ ${t.valor.toFixed(2)}`}
                          </td>
                          <td className="texto-direita">
                            <button 
                              className="botao-excluir" 
                              onClick={() => removerTransacao(t.id)}
                              title="Eliminar movimentação"
                              aria-label={`Deletar transação de ${t.nome}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="texto-vazio">Nenhuma transação encontrada</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside className="coluna-ia">
            <div className="caixa-chat-ia">
              <div className="topo-chat">
                <Sparkles size={18} /> <span>Papo com a IA</span>
              </div>
              <div className="historico-mensagens">
                <div className="msg-ia">E aí, Sentry! Precisas de ajuda com o teu extrato?</div>
              </div>
              <div className="campo-texto-chat">
                <input type="text" placeholder="Manda a tua dúvida..." className="input-chat" />
                <button className="botao-enviar-chat"><Send size={16} /></button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}