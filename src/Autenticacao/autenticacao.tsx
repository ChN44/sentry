/**
 * ========================================
 * ARQUIVO: Autenticacao.tsx
 * ========================================
 * Descrição: Componente de tela de autenticação (2FA)
 * Responsabilidades:
 *   - Exibir formulário de verificação por OTP (One-Time Password)
 *   - Mascarar e exibir apenas os últimos 4 dígitos do telefone
 *   - Renderizar 4 campos de entrada para o código de 4 dígitos
 * Rota: /autenticacao
 * ========================================
 */

import React from "react";
import { useLocation } from "react-router-dom";
import "./Autenticacaoestilos.css";
import sentry from "../assets/imagens/logo para icon e etc.png";

/**
 * COMPONENTE: Autenticacao
 * Responsável pela verificação em duas etapas (2FA)
 */
const Autenticacao: React.FC = () => {
  // ===== HOOKS REACT =====
  const location = useLocation();

  // ===== ESTADOS E VARIÁVEIS =====
  // Recupera o email passado pela rota de login
  const email = location.state?.email || "(Email não informado)";

  // ===== FUNÇÕES AUXILIARES =====
  /**
   * Mascara o email de forma segura, mostrando apenas caracteres essenciais
   * @param emailValue - Email a ser mascarado
   * @returns Email mascarado no padrão: "u***@dominio.com"
   *
   * Exemplos:
   * - "usuario@gmail.com" → "u***@gmail.com"
   * - "a@domain.co" → "a***@domain.co"
   * - "inválido" → "[Email inválido]"
   */
  const mascararEmail = (emailValue: string): string => {
    // Validação básica
    if (!emailValue || typeof emailValue !== "string") {
      return "[Email não informado]";
    }

    const trimmed = emailValue.trim();
    const atIndex = trimmed.indexOf("@");

    // Verifica se contém @ (formato básico de email)
    if (atIndex <= 0 || atIndex === trimmed.length - 1) {
      return "[Email inválido]";
    }

    const usuario = trimmed.substring(0, atIndex);
    const dominio = trimmed.substring(atIndex);

    // Se o username tem apenas 1 caractere, mostra ele + asteriscos
    if (usuario.length <= 1) {
      return `${usuario}***${dominio}`;
    }

    // Caso geral: mostra primeiro caractere + asteriscos + @ + domínio
    return `${usuario.charAt(0)}${"*".repeat(Math.max(3, usuario.length - 1))}${dominio}`;
  };

  // ===== RENDER =====
  return (
    <div className="auth-clean-page">
      {/* Barra de progresso da autenticação */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill"></div>
      </div>

      {/* Container principal da tela */}
      <div className="auth-clean-wrapper">
        {/* Card do formulário de autenticação */}
        <div className="auth-card-clean">
          {/* Logo da aplicação */}
          <div className="auth-logo-clean">
            <img src={sentry} alt="Logo" />
          </div>

          {/* Título da tela */}
          <div className="auth-header-clean">
            <h2>Verificação</h2>
          </div>

          {/* Mensagem explicativa com email mascarado */}
          <div className="mensagem-de-verificacao">
            <p>
              Enviamos um código de 4 dígitos para: {mascararEmail(email)}
              <br />
            </p>
          </div>

          {/* Campos de entrada para os 4 dígitos do código OTP */}
          <div className="otp-wrapper-clean">
            <input
              type="text"
              maxLength={1}
              className="otp-input-clean"
              placeholder="-"
            />
            <input
              type="text"
              maxLength={1}
              className="otp-input-clean"
              placeholder="-"
            />
            <input
              type="text"
              maxLength={1}
              className="otp-input-clean"
              placeholder="-"
            />
            <input
              type="text"
              maxLength={1}
              className="otp-input-clean"
              placeholder="-"
            />
          </div>

          {/* Link para reenviar o código */}
          <p className="resend-text-clean">
            Não recebeu o código? <a href="#">Reenviar</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Autenticacao;
