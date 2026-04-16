/**
 * ========================================
 * ARQUIVO: main.tsx
 * ========================================
 * Descrição: Arquivo principal e ponto de entrada da aplicação
 * Responsabilidades:
 *   - Configurar o sistema de rotas (React Router)
 *   - Montar o aplicativo React no DOM
 *   - Definir todas as rotas disponíveis
 * ========================================
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login/login";
import Autenticacao from "./Autenticacao/autenticacao";

/**
 * COMPONENTE: App
 * Componente raiz da aplicação que configura as rotas
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota 1: Tela de Login (entrada de telefone) */}
        <Route path="/" element={<Login />} />

        {/* Rota 2: Tela de Autenticação (verificação por OTP) */}
        <Route path="/autenticacao" element={<Autenticacao />} />
      </Routes>
    </BrowserRouter>
  );
}

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
/** Encontra o elemento raiz no HTML */
const rootElement = document.getElementById("root");

/** Renderiza a aplicação React no DOM */
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
