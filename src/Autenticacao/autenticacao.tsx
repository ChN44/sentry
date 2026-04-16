/**
 * ========================================
 * ARQUIVO: Autenticacao.tsx
 * ========================================
 * Descrição: Componente de tela de autenticação (2FA)
 * Responsabilidades:
 *   - Exibir formulário de verificação por OTP (One-Time Password)
 *   - Mascarar o email para privacidade do usuário
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
    <div className="tela-verificacao">
      {/* Barra de progresso da autenticação */}
      <div className="progresso-container">
        <div className="progresso-barra"></div>
      </div>

      {/* Container principal da tela */}
      <div className="corpo-central">
        {/* Card do formulário de autenticação */}
        <div className="card-seguranca">
          {/* Logo da aplicação */}
          <div className="marca-logo">
            <img src={sentry} alt="Logo" />
          </div>

          {/* Título da tela */}
          <header className="cabecalho-texto">
            <h2>Verificação</h2>
          </header>

          {/* Mensagem explicativa com email mascarado */}
          <div className="instrucao-usuario">
            <p>
              Enviamos um código de 4 dígitos para: <br />
              <strong>{mascararEmail(email)}</strong>
            </p>
          </div>

          {/* Campos de entrada para os 4 dígitos do código OTP */}
          <div className="area-codigo-otp">
            <input
              type="text"
              maxLength={1}
              className="campo-digito"
              placeholder="-"
            />
            <input
              type="text"
              maxLength={1}
              className="campo-digito"
              placeholder="-"
            />
            <input
              type="text"
              maxLength={1}
              className="campo-digito"
              placeholder="-"
            />
            <input
              type="text"
              maxLength={1}
              className="campo-digito"
              placeholder="-"
            />
          </div>

          {/* Link para reenviar o código */}
          <div className="acoes-rodape">
            <p>
              Não recebeu o código? <a href="#">Reenviar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autenticacao;
