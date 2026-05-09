import React, { useState, useRef } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Autenticacaoestilos.css";
import sentry from "../assets/imagens/logo para icon e etc.png";

const Autenticacao: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "(Email não informado)";
  const [codigo, setCodigo] = useState<string[]>(["", "", "", ""]);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const mascararEmail = (emailValue: string): string => {
    if (!emailValue.includes("@")) return emailValue;
    const [usuario, dominio] = emailValue.split("@");
    return `${usuario.charAt(0)}***@${dominio}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const valor = e.target.value;
    if (!/^[0-9]*$/.test(valor)) return;

    const novoCodigo = [...codigo];
    novoCodigo[index] = valor.substring(valor.length - 1);
    setCodigo(novoCodigo);
    setErro(null);
    setMensagemSucesso(null);

    if (valor !== "" && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (novoCodigo.every((digito) => digito !== "")) {
      verificarNoBackend(novoCodigo.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && codigo[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
 // ===== Mudei a poha da verificação de lugar =====
  const verificarNoBackend = async (codigoCompleto: string) => {
    try {
      setLoading(true);
      const resposta = await fetch("http://localhost:8000/api/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: codigoCompleto }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        if (dados.existe) {

          navigate("/dashboard");
        } else {
          navigate("/cadastro", { state: { email } });
        }
      } else {
        setErro(dados.detail || "Código incorreto.");
        setCodigo(["", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleReenviar = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resposta = await fetch("http://localhost:8000/api/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (resposta.ok) {
        setMensagemSucesso("Código reenviado!");
        setCodigo(["", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      setErro("Erro ao reenviar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tela-verificacao">
      <div className="corpo-central">
        <div className="card-seguranca">
          <div className="marca-logo"><img src={sentry} alt="Logo" /></div>
          <h2>Verificação</h2>
          <p>Código enviado para: <strong>{mascararEmail(email)}</strong></p>
          
          <div className="area-codigo-otp">
            {codigo.map((digito, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                maxLength={1}
                className="campo-digito"
                value={digito}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={loading}
              />
            ))}
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {mensagemSucesso && <p style={{ color: "green" }}>{mensagemSucesso}</p>}

          <div className="acoes-rodape">
            <p>Não recebeu? <a href="#" onClick={handleReenviar} style={{ pointerEvents: loading ? "none" : "auto" }}>{loading ? "Enviando..." : "Reenviar"}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autenticacao;