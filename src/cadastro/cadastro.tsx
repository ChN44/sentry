/**
 * ========================================
 * ARQUIVO: cadastro.tsx (ATUALIZADO COM AUTO-FILL)
 * ========================================
 */

import React, { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importado useLocation
import "./cadastrosestilos.css";
import { ShieldCheck, RefreshCw } from "lucide-react"; 

// ... (seus imports de imagens permanecem iguais)
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

type Palette = { c1: string; c2: string; c3: string };
type CarouselSlide = { src: string; palette: Palette };

const slides: CarouselSlide[] = [
  { src: img1, palette: { c1: "#142B47", c2: "#F25C22", c3: "#A2E4E0" } },
  { src: img2, palette: { c1: "#080A12", c2: "#D93611", c3: "#00B4D8" } },
  { src: img3, palette: { c1: "#423659", c2: "#B81D33", c3: "#E6A622" } },
  { src: img4, palette: { c1: "#D91828", c2: "#202124", c3: "#F27429" } },
  { src: img5, palette: { c1: "#00F0FF", c2: "#B75CFF", c3: "#12293E" } },
];

const avataresMock = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9];

const Cadastro: React.FC = () => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [notificacao, setNotificacao] = useState<{ tipo: "erro" | "sucesso"; mensagem: string } | null>(null);
  const [indiceAvatar, setIndiceAvatar] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // Hook para pegar o estado enviado pelo navigate

  // EFEITO PARA PEGAR O EMAIL DO LOGIN
  useEffect(() => {
    // Se existir um state com email vindo da navegação anterior, preenche o campo
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceAtual((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const activePalette = slides[indiceAtual].palette;

  const handleRerollAvatar = () => setIndiceAvatar((prev) => (prev + 1) % avataresMock.length);

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value.trimStart());
    if (notificacao) setNotificacao(null);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.replace(/\s/g, ""));
    if (notificacao) setNotificacao(null);
  };

  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value);
    if (notificacao) setNotificacao(null);
  };

  const handleCadastro = async () => {
    if (nome.trim().length < 3 || !email || cpf.replace(/\D/g, "").length < 11) {
      setNotificacao({ tipo: "erro", mensagem: "Preencha todos os campos corretamente." });
      return;
    }

    try {
      setLoading(true);
      const resposta = await fetch("http://localhost:8000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          cpf: cpf.replace(/\D/g, ""),
          avatar_index: indiceAvatar,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setNotificacao({ tipo: "sucesso", mensagem: "Cadastro realizado!" });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setNotificacao({ tipo: "erro", mensagem: dados.detail || "Erro no cadastro." });
      }
    } catch {
      setNotificacao({ tipo: "erro", mensagem: "Erro de conexão." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="cadastro-container"
      style={{
        "--wave-color-1": activePalette.c1,
        "--wave-color-2": activePalette.c2,
        "--wave-color-3": activePalette.c3,
      } as React.CSSProperties}
    >
      <div className="cadastro-form-section">
        <div className="form-content">
          <div className="avatar-reroll-container">
            <img src={avataresMock[indiceAvatar]} alt="Perfil" className="avatar-image-reroll" />
            <button onClick={handleRerollAvatar} type="button" className="avatar-reroll-btn">
              <RefreshCw size={16} color="#000" />
            </button>
          </div>

          <div className="header-text">
            <h1>Conclua o cadastro</h1>
            <p>Preencha os dados abaixo para se cadastrar.</p>
          </div>

          <div className="form-group">
            <input type="text" placeholder="Nome completo" className="form-input" value={nome} onChange={handleNomeChange} />
          </div>

          <div className="form-group">
            <input type="email" placeholder="seu@email.com" className="form-input" value={email} onChange={handleEmailChange} />
          </div>

          <div className="form-group">
            <input type="text" placeholder="Seu CPF" className="form-input" value={cpf} onChange={handleCpfChange} />
          </div>

          {notificacao && <div className={`notification notification-${notificacao.tipo}`}>{notificacao.mensagem}</div>}

          <button className="btn-primary" onClick={handleCadastro} disabled={loading}>
            {loading ? "Processando..." : "Cadastrar"}
          </button>

          <div className="divider"></div>
          <div className="lgpd-badge">
            <div className="lgpd-icon"><ShieldCheck size={16} strokeWidth={2.5} /></div>
            <span className="lgpd-text">Dados seguros pela LGPD</span>
          </div>
        </div>
      </div>
      <div className="cadastro-image-section">
        {slides.map((slide, index) => (
          <img key={index} src={slide.src} className={`background-image ${index === indiceAtual ? "active" : ""}`} alt="fundo" />
        ))}
      </div>
    </div>
  );
};

export default Cadastro;