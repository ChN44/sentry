import React, { useState } from 'react';
import { 
  LayoutDashboard, Receipt, Wallet, LineChart, 
  Settings, Bell, Send, Sparkles, Search, Plus, X, Trash2,
  Target, AlertCircle, PackageX, AlertTriangle
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

// Interface para o formato da Meta
interface Meta {
  id: number;
  nome: string;
  categoria: string;
  valorAlvo: number;
  data: string;
  valorGuardado: number;
  prioridade: string;
  anotacoes: string;
}

export default function Dashboard() {
  // Controle de abas da SPA
  const [abaAtiva, setAbaAtiva] = useState('inicio');
  
  // ================= ESTADOS DO EXTRATO =================
  const [mostrarForm, setMostrarForm] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: 1, data: '16/04/2024', nome: 'Mercado', categoria: 'Arroz e Feijão', valor: -45.00 },
    { id: 2, data: '15/04/2024', nome: 'Pagamento', categoria: 'Trampo', valor: 8500.00 },
    { id: 3, data: '14/04/2024', nome: 'Posto Shell', categoria: 'Gasolina', valor: -200.00 }
  ]);

  const [form, setForm] = useState({
    data: '', nome: '', categoria: '', valor: ''
  });

  // ================= ESTADOS DO PLANEJAMENTO =================
  const [metas, setMetas] = useState<Meta[]>([]);
  
  const [formMeta, setFormMeta] = useState({
    nome: '', categoria: '', valorAlvo: '', data: '', 
    valorGuardado: '', prioridade: '', anotacoes: ''
  });

  // ================= FUNÇÕES DO EXTRATO =================
  const validarForm = (): boolean => {
    setErro('');
    if (!form.data.trim()) { setErro('Data é obrigatória'); return false; }
    if (!form.nome.trim()) { setErro('Descrição obrigatória'); return false; }
    if (!form.categoria.trim()) { setErro('Categoria é obrigatória'); return false; }
    if (!form.valor.trim() || isNaN(parseFloat(form.valor))) { setErro('Valor inválido'); return false; }
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

  // ================= FUNÇÕES DO PLANEJAMENTO =================
  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormMeta({ ...formMeta, [name]: value });
  };

  const adicionarMeta = () => {
    if (!formMeta.nome.trim() || !formMeta.valorAlvo.trim()) {
      alert("Preencha pelo menos o nome e o valor alvo!");
      return;
    }

    const novaMeta: Meta = {
      id: Date.now(),
      nome: formMeta.nome,
      categoria: formMeta.categoria,
      valorAlvo: parseFloat(formMeta.valorAlvo),
      data: formMeta.data,
      valorGuardado: formMeta.valorGuardado ? parseFloat(formMeta.valorGuardado) : 0,
      prioridade: formMeta.prioridade,
      anotacoes: formMeta.anotacoes
    };

    setMetas([novaMeta, ...metas]);

    // Limpa o formulário
    setFormMeta({
      nome: '', categoria: '', valorAlvo: '', data: '', 
      valorGuardado: '', prioridade: '', anotacoes: ''
    });
  };

  // ================= CÁLCULOS DO PLANEJAMENTO =================
  
  // 1. Soma todos os "valorGuardado" da lista de metas
  const totalGuardado = metas.reduce((acumulador, meta) => {
    return acumulador + meta.valorGuardado;
  }, 0);

  // 2. Soma todos os "valorAlvo" da lista de metas
  const objetivoTotal = metas.reduce((acumulador, meta) => {
    return acumulador + meta.valorAlvo;
  }, 0);

  // 3. Formata os números para o padrão de dinheiro (R$ 0,00)
  const totalGuardadoFormatado = totalGuardado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const objetivoTotalFormatado = objetivoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  // ================= RENDERIZAÇÃO DA TELA =================
  return (
    <div className="container-geral">
      {/* ================= MENU LATERAL ================= */}
      <aside className="menu-lateral">
        <div className="logo-do-app">
          <div className="logo-container">
            <img
              src="src/assets/imagens/logo.png"
              alt="Logo App"
              className="project-logo"
              onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/40?text=L'}}
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
          <button className={`item-menu ${abaAtiva === 'planejamento' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('planejamento')}>
            <Wallet size={20}/> Planejamento
          </button>
          <button className="item-menu"><LineChart size={20}/> Investimentos</button>
          <button className="item-menu"><Settings size={20}/> Ajustes</button>
        </nav>
      </aside>
      
      <main className="conteudo-principal">
        {/* ================= HEADER ================= */}
        <header className="topo-da-pagina">
          <div className="saudacao-usuario">
            <h1>Olá!</h1>
            <p>Gerencie seus gastos de forma livre.</p>
          </div>
          <div className="botoes-topo">
            <button className="botao-circular"><Bell size={20}/></button>
            <div className="foto-perfil">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Perfil" />
            </div>
          </div>
        </header>
        
        <div className="layout-do-painel">
          <div className="coluna-financeira">
            
            {/* ================= ABA INÍCIO ================= */}
            {abaAtiva === 'inicio' && (
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
            )}

            {/* ================= ABA EXTRATO ================= */}
            {abaAtiva === 'extrato' && (
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
                      />
                    </div>
                  </div>
                </div>
                
                {mostrarForm && (
                  <form onSubmit={adicionarTransacao} className="formulario-transacao">
                    {erro && <div className="erro-mensagem" role="alert">{erro}</div>}
                    <div className="campo-formulario">
                      <label htmlFor="data">Data:</label>
                      <input type="date" id="data" name="data" value={form.data} onChange={handleInputChange} required />
                    </div>
                    <div className="campo-formulario">
                      <label htmlFor="nome">Descrição:</label>
                      <input type="text" id="nome" name="nome" placeholder="Ex: Mercado" value={form.nome} onChange={handleInputChange} required />
                    </div>
                    <div className="campo-formulario">
                      <label htmlFor="categoria">Categoria:</label>
                      <input type="text" id="categoria" name="categoria" placeholder="Ex: Alimentação" value={form.categoria} onChange={handleInputChange} required />
                    </div>
                    <div className="campo-formulario">
                      <label htmlFor="valor">Valor:</label>
                      <input type="number" step="0.01" id="valor" name="valor" placeholder="Ex: -50.00" value={form.valor} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn-salvar" disabled={carregando}>
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
                          <td><span className="etiqueta-generica">{t.categoria}</span></td>
                          <td className={`texto-direita ${t.valor < 0 ? 'cor-vermelha' : 'cor-verde'}`}>
                            {t.valor < 0 ? `- R$ ${Math.abs(t.valor).toFixed(2)}` : `+ R$ ${t.valor.toFixed(2)}`}
                          </td>
                          <td className="texto-direita">
                            <button className="botao-excluir" onClick={() => removerTransacao(t.id)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="texto-vazio">Nenhuma transação encontrada</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ================= ABA PLANEJAMENTO ================= */}
            {abaAtiva === 'planejamento' && (
              <div className="planejamento-container">
                <div className="planejamento-header">
                  <h2><Target size={26} color="#7c3aed" /> Planejamento de Metas</h2>
                  <div className="badges-container">
                    <div className="badge badge-perigo"><AlertCircle size={14} /> 0 Atrasadas</div>
                    <div className="badge badge-alerta"><AlertTriangle size={14} /> Alerta</div>
                  </div>
                </div>

                <div className="planejamento-cards">
                  <div className="card-plan card-roxo">
                    <h3>Total de Metas</h3>
                    <p>{metas.length}</p>
                  </div>
                  <div className="card-plan card-verde">
                    <h3>Valor Guardado</h3>
                    <p>{totalGuardadoFormatado}</p>
                  </div>
                  <div className="card-plan card-laranja">
                    <h3>Objetivo Total</h3>
                    <p>{objetivoTotalFormatado}</p>
                  </div>
                </div>

                <div className="box-tracejado">
                  <h3><Plus size={18} /> Adicionar Nova Meta</h3>
                  <div className="form-planejamento">
                    <input type="text" name="nome" value={formMeta.nome} onChange={handleMetaChange} placeholder="Nome da meta" className="input-plan" />
                    <input type="text" name="categoria" value={formMeta.categoria} onChange={handleMetaChange} placeholder="Categoria" className="input-plan" />
                    <input type="number" name="valorAlvo" value={formMeta.valorAlvo} onChange={handleMetaChange} placeholder="Valor Alvo (R$)" className="input-plan" />
                    <input type="date" name="data" value={formMeta.data} onChange={handleMetaChange} className="input-plan" />
                    <input type="number" name="valorGuardado" value={formMeta.valorGuardado} onChange={handleMetaChange} placeholder="Valor Guardado" className="input-plan" />
                    <input type="text" name="prioridade" value={formMeta.prioridade} onChange={handleMetaChange} placeholder="Prioridade" className="input-plan" />
                    <input type="text" name="anotacoes" value={formMeta.anotacoes} onChange={handleMetaChange} placeholder="Anotações" className="input-plan" />
                    
                    <button className="btn-adicionar-plan" onClick={adicionarMeta}>
                      <Plus size={18} /> Adicionar
                    </button>
                  </div>
                </div>

                <div className="lista-planejamento">
                  <h3>Suas Metas</h3>
                  {metas.length === 0 ? (
                    <div className="estado-vazio">
                      <PackageX size={64} strokeWidth={1} />
                      <p>Nenhuma meta planejada ainda</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {metas.map((meta) => {
                        // Cálculos e formatação específicos para cada card da lista
                        const porcentagem = meta.valorAlvo > 0 
                          ? Math.min(Math.round((meta.valorGuardado / meta.valorAlvo) * 100), 100) 
                          : 0;

                        const valorAlvoCardFormatado = meta.valorAlvo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        const valorGuardadoCardFormatado = meta.valorGuardado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        const dataFormatada = meta.data ? meta.data.split('-').reverse().join('/') : 'Sem prazo definido';

                        return (
                          <div key={meta.id} className="meta-card-item">
                            
                            <div className="meta-card-header">
                              <h4>{meta.nome}</h4>
                              <span className="etiqueta-generica">{meta.categoria || 'Geral'}</span>
                            </div>
                            
                            <div className="meta-card-valores">
                              <div className="valor-grupo">
                                <span className="valor-label">Guardado</span>
                                <span className="valor-atual cor-verde">{valorGuardadoCardFormatado}</span>
                              </div>
                              <div className="valor-grupo texto-direita">
                                <span className="valor-label">Objetivo</span>
                                <span className="valor-atual">{valorAlvoCardFormatado}</span>
                              </div>
                            </div>

                            <div className="barra-progresso-fundo">
                              <div 
                                className="barra-progresso-preenchimento" 
                                style={{ width: `${porcentagem}%` }}
                              ></div>
                            </div>
                            
                            <div className="meta-card-footer">
                              <span>{porcentagem}% concluído</span>
                              <span>📅 {dataFormatada}</span>
                            </div>
                            
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
          
          {/* ================= CHAT IA ================= */}
          <aside className="coluna-ia">
            <div className="caixa-chat-ia">
              <div className="topo-chat">
                <Sparkles size={18} /> <span>Papo com a IA</span>
              </div>
              <div className="historico-mensagens">
                <div className="msg-ia">E aí! Precisa de ajuda com suas finanças?</div>
              </div>
              <div className="campo-texto-chat">
                <input type="text" placeholder="Mande sua dúvida..." className="input-chat" />
                <button className="botao-enviar-chat"><Send size={16} /></button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}