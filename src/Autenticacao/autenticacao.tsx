/**
 * ========================================
 * ARQUIVO: Autenticacao.tsx
 * ========================================
 */

import React, { useState, useRef } from "react";
// Importamos também o MouseEvent para o clique no link
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import "./Autenticacaoestilos.css";
import sentry from "../assets/imagens/logo para icon e etc.png";

const Autenticacao: React.FC = () => {
  // ===== HOOKS REACT =====
  const location = useLocation();

  // ===== ESTADOS E VARIÁVEIS =====
  const email = location.state?.email || "(Email não informado)";
  
  // Guardar os 4 dígitos
  const [codigo, setCodigo] = useState<string[]>(["", "", "", ""]);
  const [erro, setErro] = useState<string | null>(null);
  
  // NOVO: Estado para avisar que o reenvio funcionou
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Referências para controlar o foco dos inputs
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // ===== FUNÇÕES AUXILIARES =====
  const mascararEmail = (emailValue: string): string => {
    if (!emailValue || typeof emailValue !== "string") {
      return "[Email não informado]";
    }
    const trimmed = emailValue.trim();
    const atIndex = trimmed.indexOf("@");
    if (atIndex <= 0 || atIndex === trimmed.length - 1) {
      return "[Email inválido]";
    }
    const usuario = trimmed.substring(0, atIndex);
    const dominio = trimmed.substring(atIndex);
    if (usuario.length <= 1) {
      return `${usuario}***${dominio}`;
    }
    return `${usuario.charAt(0)}${"*".repeat(Math.max(3, usuario.length - 1))}${dominio}`;
  };

  // Função chamada sempre que o utilizador digita num quadradinho
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const valor = e.target.value;

    if (!/^[0-9]*$/.test(valor)) return;

    const novoCodigo = [...codigo];
    novoCodigo[index] = valor.substring(valor.length - 1);
    setCodigo(novoCodigo);
    setErro(null);
    setMensagemSucesso(null); // Limpa a mensagem de sucesso ao começar a digitar

    if (valor !== "" && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (novoCodigo.every((digito) => digito !== "")) {
      verificarNoBackend(novoCodigo.join(""));
    }
  };

  // Função para tratar quando o utilizador apaga (Backspace)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && codigo[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Função que comunica com o FastAPI para VERIFICAR
  const verificarNoBackend = async (codigoCompleto: string) => {
    try {
      setLoading(true);
      const resposta = await fetch("http://localhost:8000/api/verificar-codigo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, codigo: codigoCompleto }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        console.log("codigo correto");
      } else {
        setErro(dados.detail || "Código incorreto. Tente novamente.");
        setCodigo(["", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      console.error("Erro na comunicação com o backend:", err);
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Função que comunica com o FastAPI para REENVIAR
  const handleReenviar = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Impede a página de recarregar por causa do href="#"

    if (!email || email === "(Email não informado)") {
      setErro("Não há um email válido para reenviar.");
      return;
    }

    try {
      setLoading(true);
      setErro(null);
      setMensagemSucesso(null);

      // Chamamos a mesma rota que o login usa!
      const resposta = await fetch("http://localhost:8000/api/enviar-codigo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagemSucesso("Novo código enviado com sucesso!");
        setCodigo(["", "", "", ""]); // Limpa os campos antigos
        inputsRef.current[0]?.focus(); // Volta o foco para o primeiro quadradinho
      } else {
        setErro(dados.detail || "Erro ao tentar reenviar o código.");
      }
    } catch (err) {
      console.error("Erro no reenvio:", err);
      setErro("Erro de conexão ao tentar reenviar.");
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="tela-verificacao">
      <div className="progresso-container">
        <div className="progresso-barra"></div>
      </div>

      <div className="corpo-central">
        <div className="card-seguranca">
          <div className="marca-logo">
            <img src={sentry} alt="Logo" />
          </div>

          <header className="cabecalho-texto">
            <h2>Verificação</h2>
          </header>

          <div className="instrucao-usuario">
            <p>
              Enviamos um código de 4 dígitos para: <br />
              <strong>{mascararEmail(email)}</strong>
            </p>
          </div>

          <div className="area-codigo-otp">
            {codigo.map((digito, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                maxLength={1}
                className="campo-digito"
                placeholder="-"
                value={digito}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={loading}
              />
            ))}
          </div>

          {/* Área de Mensagens (Erro ou Sucesso) */}
          {erro && (
            <div style={{ color: "white", textAlign: "center", marginTop: "10px" }}>
              {erro}
            </div>
          )}
          {mensagemSucesso && (
            <div style={{ color: "white", textAlign: "center", marginTop: "10px" }}>
              {mensagemSucesso}
            </div>
          )}

          <div className="acoes-rodape">
            <p>
              Não recebeu o código?{" "}
              {/* O evento onClick agora chama a nossa nova função */}
              <a href="#" onClick={handleReenviar} style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1 }}>
                {loading ? "Enviando..." : "Reenviar"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autenticacao;