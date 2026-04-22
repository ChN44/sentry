/**
 * ========================================
 * ARQUIVO: cadastro.tsx
 * ========================================
 * Descrição: Componente de tela de cadastro
 * Responsabilidades:
 * - Exibir formulário de cadastro com nome, email e CPF
 * - Validar email (formato correto)
 * - Validar CPF
 * - Exibir carousel de imagens com animação automática
 * - Fazer requisição POST para o backend
 * - Navegar para tela de autenticação ao clicar em "Cadastrar"
 * Rota: /cadastro
 * ========================================
 */

import React, { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastrosestilos.css";
// NOVO: Adicionado RefreshCw para o ícone do botão
import { ShieldCheck, RefreshCw } from "lucide-react"; 


import img1 from "../assets/imagens/imagenscadastro/img1.jpg";
import img2 from "../assets/imagens/imagenscadastro/img2.jpg";
import img3 from "../assets/imagens/imagenscadastro/img3.jpg";
import img4 from "../assets/imagens/imagenscadastro/img4.jpg";
import img5 from "../assets/imagens/imagenscadastro/img5.jpg";

import avatar1 from "../assets/icones perfil/capinho.jpg";
import avatar2 from "../assets/icones perfil/cat.jpg";
import avatar3 from "../assets/icones perfil/elefante.jpg";
import avatar4 from "../assets/icones perfil/galinho.jpg";
import avatar5 from "../assets/icones perfil/hipo.jpg";
import avatar6 from "../assets/icones perfil/jacaré.jpg";
import avatar7 from "../assets/icones perfil/onça.jpg";
import avatar8 from "../assets/icones perfil/ratinho.jpg";
import avatar9 from "../assets/icones perfil/spirit.jpg";


// NOVO: Importe aqui as imagens que você vai usar para os avatares
// import avatar1 from "../assets/imagens/avatares/gato1.png";
// import avatar2 from "../assets/imagens/avatares/gato2.png";
// import avatar3 from "../assets/imagens/avatares/gato3.png";

// ===== TIPOS TYPESCRIPT =====
type Palette = { c1: string; c2: string; c3: string };
type CarouselSlide = { src: string; palette: Palette };

// ===== DADOS DO CAROUSEL =====
const slides: CarouselSlide[] = [
  {
    src: img1,
    palette: {
      c1: "#142B47", // azul cobalto profundo
      c2: "#F25C22", // laranja vibrante
      c3: "#A2E4E0", // ciano pálido
    },
  },
  {
    src: img2,
    palette: {
      c1: "#080A12", // preto meia-noite
      c2: "#D93611", // vermelho-sienna
      c3: "#00B4D8", // azul-ciano
    },
  },
  {
    src: img3,
    palette: {
      c1: "#423659", // violeta sombrio
      c2: "#B81D33", // carmesim profundo
      c3: "#E6A622", // ocre dourado
    },
  },
  {
    src: img4, 
    palette: { 
      c1: "#D91828", // vermelho escarlate
      c2: "#202124", // cinza chumbo
      c3: "#F27429"  // laranja pôr do sol
    } 
  },
  {
    src: img5, 
    palette: { 
      c1: "#00F0FF", // ciano elétrico
      c2: "#B75CFF", // magenta lavanda
      c3: "#12293E"  // azul-petróleo profundo
    }
  },
];

// NOVO: Array com os avatares (substitua pelas suas variáveis importadas acima quando tiver as imagens)
const avataresMock = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9

];

const Cadastro: React.FC = () => {
  // ===== ESTADOS =====
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [notificacao, setNotificacao] = useState<{
    tipo: "erro" | "sucesso";
    mensagem: string;
  } | null>(null);

  // NOVO: Estado para controlar qual avatar está sendo exibido
  const [indiceAvatar, setIndiceAvatar] = useState(0);

  // ===== HOOKS REACT =====
  const navigate = useNavigate();

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceAtual((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const activePalette = slides[indiceAtual].palette;

  // ===== FUNÇÕES AUXILIARES =====
  
  // NOVO: Função que muda o avatar atual quando o botão é clicado
  const handleRerollAvatar = () => {
    setIndiceAvatar((prevIndex) => (prevIndex + 1) % avataresMock.length);
  };

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setNome(value.trimStart());
    if (notificacao) setNotificacao(null);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const valueWithoutSpaces = value.replace(/\s/g, "");
    setEmail(valueWithoutSpaces);
    if (notificacao) setNotificacao(null);
  };

  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setCpf(value);
    if (notificacao) setNotificacao(null);
  };

  const isValidEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleCadastro = async () => {
    if (nome.trim().length < 3) {
      setNotificacao({
        tipo: "erro",
        mensagem: "Nome deve ter pelo menos 3 caracteres.",
      });
      return;
    }

    if (!isValidEmail(email)) {
      setNotificacao({
        tipo: "erro",
        mensagem: "Por favor, insira um email válido.",
      });
      return;
    }

    // Validação básica do tamanho numérico do CPF
    if (cpf.replace(/\D/g, "").length < 11) {
      setNotificacao({
        tipo: "erro",
        mensagem: "CPF inválido. Insira pelo menos 11 dígitos.",
      });
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/autenticacao", {
        state: { nome, email, cadastroCompleto: true },
      });
    } catch {
      setNotificacao({
        tipo: "erro",
        mensagem: "Erro ao processar. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div
      className="cadastro-container"
      style={
        {
          "--wave-color-1": activePalette.c1,
          "--wave-color-2": activePalette.c2,
          "--wave-color-3": activePalette.c3,
        } as React.CSSProperties
      }
    >
      <div className="cadastro-form-section">
        <div className="form-content">
          <></>

          {/* NOVO: Bloco da div do avatar adicionado usando as classes CSS */}
          <div className="avatar-reroll-container">
            <img 
              src={avataresMock[indiceAvatar]} 
              alt="Foto de perfil" 
              className="avatar-image-reroll"
            />
            <button 
              onClick={handleRerollAvatar} 
              type="button"
              className="avatar-reroll-btn"
            >
              <RefreshCw size={16} color="#000" />
            </button>
          </div>

          <div className="header-text">
            <h1>Conclua o cadastro</h1>
            <p>Preencha os dados abaixo para se cadastrar.</p>
          </div>

          <div className="form-group">
            <input
              type="text"
              maxLength={100}
              placeholder="Seu nome completo"
              className="form-input"
              value={nome}
              onChange={handleNomeChange}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              maxLength={100}
              placeholder="seu@email.com"
              className="form-input"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              inputMode="numeric"
              maxLength={14}
              placeholder="Seu CPF"
              className="form-input"
              value={cpf}
              onChange={handleCpfChange}
            />
          </div>

          {notificacao && (
            <div className={`notification notification-${notificacao.tipo}`}>
              {notificacao.mensagem}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleCadastro}
            disabled={loading}
          >
            {loading ? "Processando..." : "Cadastrar"}
          </button>

          <div className="divider"></div>

          {/* Selo LGPD Centralizado */}
          <div className="lgpd-badge">
            <div className="lgpd-icon">
              <ShieldCheck size={16} strokeWidth={2.5} />
            </div>
            <span className="lgpd-text">
              Dados seguros pela LGPD com criptografia
            </span>
          </div>

          <p className="footer-terms">
            Ao cadastrar você concorda com os <a href="#">Termos de uso</a>
          </p>
        </div>
      </div>

      <div className="cadastro-image-section">
        {slides && slides.length > 0 ? (
          slides.map((slide, index) => (
            <img
              key={index}
              src={slide.src}
              alt={`Fundo decorativo ${index + 1}`}
              className={`background-image ${index === indiceAtual ? "active" : ""}`}
            />
          ))
        ) : (
          <div className="no-images">Imagens não disponíveis</div>
        )}
      </div>
    </div>
  );
};

export default Cadastro;