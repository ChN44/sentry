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
  // Recupera o telefone passado pela rota de login
  const telefone = location.state?.telefone || "(Telefone não informado)";

  // ===== FUNÇÕES AUXILIARES =====
  /**
   * Mascara o telefone mostrando apenas os 4 últimos dígitos
   * Exemplo: "11987654321" → "4321"
   */
  const mascararTelefone = (tel: string) => {
    // Extrai apenas os números
    const apenasNumeros = tel.replace(/\D/g, "");
    // Retorna vazio se não houver 4 dígitos
    if (apenasNumeros.length < 4) return "";
    // Pega apenas os últimos 4 dígitos
    const ultimos4 = apenasNumeros.slice(-4);
    return `${ultimos4}`;
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

          {/* Mensagem explicativa com telefone mascarado */}
          <div className="mensagem-de-verificacao">
            <p>
              Enviamos um código de 4 dígitos para o numero com final de:{" "}
              {mascararTelefone(telefone)}
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
