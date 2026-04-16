/**
 * ========================================
 * ARQUIVO: login.tsx
 * ========================================
 * Descrição: Componente de tela de login (entrada de telefone)
 * Responsabilidades:
 *   - Exibir formulário de entrada de número de telefone
 *   - Validar número de telefone (11 dígitos com DDD)
 *   - Formatar dinamicamente a entrada do usuário
 *   - Exibir carousel de imagens com animação automática
 *   - Navegar para tela de autenticação ao clicar em "Começar"
 * Rota: /
 * ========================================
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./estilologin.css";

import logoProjeto from "../assets/imagens/logo.png";

import img1 from "../assets/imagens/img1.jpg";
import img2 from "../assets/imagens/img2.jpg";
import img3 from "../assets/imagens/img3.jpg";
import img4 from "../assets/imagens/img4.jpg";
import img5 from "../assets/imagens/img5.jpg";
import img6 from "../assets/imagens/img6.jpg";
import img7 from "../assets/imagens/img7.jpg";
import img8 from "../assets/imagens/img8.jpg";
import img9 from "../assets/imagens/img9.jpg";

// ===== TIPOS TYPESCRIPT =====
/** Tipo para armazenar cores da paleta (3 cores primárias) */
type Palette = { c1: string; c2: string; c3: string };

/** Tipo para cada slide do carousel com imagem e paleta de cores */
type CarouselSlide = { src: string; palette: Palette };

// ===== DADOS DO CAROUSEL =====
/** Array com todos os slides do carousel de fundo com suas respectivas paletas de cores */
const slides: CarouselSlide[] = [
  { src: img1, palette: { c1: "#5A2A18", c2: "#1A4674", c3: "#161D5A" } },
  { src: img2, palette: { c1: "#5C1111", c2: "#0D4D6B", c3: "#8C5708" } },
  { src: img3, palette: { c1: "#1A3668", c2: "#4A5A70", c3: "#9C4212" } },
  { src: img4, palette: { c1: "#8C6A08", c2: "#6B1111", c3: "#184570" } },
  { src: img5, palette: { c1: "#0A0A0A", c2: "#1C1E24", c3: "#454D59" } },
  { src: img6, palette: { c1: "#063A4A", c2: "#050614", c3: "#801B1B" } },
  { src: img7, palette: { c1: "#15204A", c2: "#3A1B4D", c3: "#9E3C0F" } },
  { src: img8, palette: { c1: "#0D142B", c2: "#52331C", c3: "#731111" } },
  { src: img9, palette: { c1: "#022B38", c2: "#04151C", c3: "#7A5200" } },
];

/**
 * COMPONENTE: Login
 * Tela inicial de entrada do usuário com entrada de telefone e carousel de imagens
 */
const Login: React.FC = () => {
  // ===== ESTADOS =====
  /** Índice do slide atual do carousel */
  const [indiceAtual, setIndiceAtual] = useState(0);

  /** Valor do telefone digitado no input */
  const [telefone, setTelefone] = useState("");

  /** Estado de carregamento ao processar o formulário */
  const [loading, setLoading] = useState(false);

  /** Notificações de erro ou sucesso exibidas ao usuário */
  const [notificacao, setNotificacao] = useState<{
    tipo: "erro" | "sucesso";
    mensagem: string;
  } | null>(null);

  // ===== HOOKS REACT =====
  /** Hook para navegação entre rotas */
  const navigate = useNavigate();

  /**
   * EFEITO: Carousel automático
   * Muda a imagem de fundo a cada 5 segundos
   */
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceAtual((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  // ===== VARIÁVEIS CALCULADAS =====
  /** Paleta de cores do slide atual para animar o background */
  const activePalette = slides[indiceAtual].palette;

  // ===== FUNÇÕES AUXILIARES =====
  /**
   * FUNÇÃO: handlePhoneChange
   * Gerencia a mudança e formatação automática do input de telefone
   * Formatos aplicados: (DD) 9XXXX-XXXX
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    }
    if (value.length > 9) {
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }

    setTelefone(value);
    if (notificacao) setNotificacao(null);
  };

  /**
   * FUNÇÃO: isValidPhone
   * Valida se o telefone possui exatamente 11 dígitos (DDD + 9 dígitos)
   * Padrão Brasil: (XX) 9XXXX-XXXX
   */
  const isValidPhone = (phone: string): boolean => {
    const digitos = phone.replace(/\D/g, "");
    return digitos.length === 11 && /^\d{11}$/.test(digitos);
  };

  /**
   * FUNÇÃO: handleComecar
   * Processa o clique no botão "Começar"
   * - Valida o número de telefone
   * - Exibe erro se inválido
   * - Navega para a tela de autenticação se válido
   */
  const handleComecar = async () => {
    // Validação do telefone
    if (!isValidPhone(telefone)) {
      setNotificacao({
        tipo: "erro",
        mensagem:
          "Por favor, insira um número de WhatsApp válido com DDD (11 dígitos).",
      });
      return;
    }

    try {
      setLoading(true);
      // Pequeno delay para simular processamento
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Navega para autenticação passando o telefone como estado
      navigate("/autenticacao", { state: { telefone } });
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
      className="login-container"
      style={
        {
          "--wave-color-1": activePalette.c1,
          "--wave-color-2": activePalette.c2,
          "--wave-color-3": activePalette.c3,
        } as React.CSSProperties
      }
    >
      {/* Seção do formulário de login */}
      <div className="login-form-section">
        {/* Conteúdo do formulário */}
        <div className="form-content">
          {/* Logo do projeto */}
          <div className="logo-container">
            <img
              src={logoProjeto}
              alt="Logo do Projeto"
              className="project-logo"
            />
          </div>

          {/* Título e descrição */}
          <div className="header-text">
            <h1>Qual seu Whatsapp?</h1>
            <p>Inicie seu cadastro ou acesse sua conta.</p>
          </div>

          {/* Grupo de entrada de telefone */}
          <div className="input-group">
            {/* Seletor de país */}
            <div className="country-selector">
              <span className="flag">🇧🇷</span>
              <span className="code">+55</span>
            </div>

            {/* Input para número de telefone */}
            <input
              type="tel"
              maxLength={15}
              placeholder="(00) 00000-0000"
              className="phone-input"
              value={telefone}
              onChange={handlePhoneChange}
            />
          </div>

          {/* Notificação de erro ou sucesso */}
          {notificacao && (
            <div className={`notification notification-${notificacao.tipo}`}>
              {notificacao.mensagem}
            </div>
          )}

          {/* Botão primário para continuar */}
          <button
            className="btn-primary"
            onClick={handleComecar}
            disabled={loading}
          >
            {loading ? "Processando..." : "Começar"}
          </button>

          {/* Divisor visual */}
          <div className="divider">
            <span>ou</span>
          </div>

          {/* Botão de login com e-mail */}
          <button className="btn-secondary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Logar com E-mail
          </button>

          {/* Botão de login com Google */}
          <button className="btn-secondary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar com Google
          </button>

          {/* Botão de login com Apple */}
          <button className="btn-secondary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.05 16.481c-.553 1.255-1.527 2.766-2.651 2.784-1.074.02-1.458-.636-2.695-.636-1.254 0-1.688.618-2.673.655-1.037.037-2.14-1.636-2.712-2.89C5.122 13.784 4.148 9.24 6.151 6.55c.995-1.345 2.508-2.198 4.09-2.235 1.074-.036 2.088.708 2.732.708.643 0 1.861-.871 3.133-.744 1.344.126 2.56.654 3.332 1.78-2.836 1.671-2.35 5.666.425 6.757-.644 1.6-1.545 3.125-2.813 3.665zM12.981 3.97C12.873 1.79 14.502.164 16.582 0c.234 2.162-1.689 4.033-3.601 3.97z" />
            </svg>
            Continuar com Apple
          </button>

          {/* Texto de termos e condições */}
          <p className="footer-terms">
            Ao continuar você concorda com os <a href="#">Termos de uso</a>
          </p>
        </div>
      </div>

      {/* Seção com carousel de imagens de fundo */}
      <div className="login-image-section">
        {slides && slides.length > 0 ? (
          // Renderiza todas as imagens do carousel
          slides.map((slide, index) => (
            <img
              key={index}
              src={slide.src}
              alt={`Fundo decorativo ${index + 1}`}
              className={`background-image ${index === indiceAtual ? "active" : ""}`}
            />
          ))
        ) : (
          // Fallback se não houver imagens
          <div className="no-images">Imagens não disponíveis</div>
        )}
      </div>
    </div>
  );
};

export default Login;
