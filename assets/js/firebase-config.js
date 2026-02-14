/**
 * CONFIGURAÇÃO DO FIREBASE - COMPLETA (Admin + Cliente)
 * Versão: 10.13.0 (Com App Check de Segurança)
 */

// --- IMPORTAÇÕES (SDKs) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app-check.js";

import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc, 
    setDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot, 
    query,
    where, 
    limit, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// ============================================
// SUAS CREDENCIAIS
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyAdpNX14mXdqM4jf_8G-qloAOr3jyxi2jE",
  authDomain: "meu-cardapio-2ea1f.firebaseapp.com",
  projectId: "meu-cardapio-2ea1f",
  storageBucket: "meu-cardapio-2ea1f.firebasestorage.app",
  messagingSenderId: "325880131944",
  appId: "1:325880131944:web:04b4faf22f4f4dabeb66dd"
};

// --- INICIALIZAÇÃO ---
const app = initializeApp(firebaseConfig);

// 👇 INICIALIZAÇÃO DO ESCUDO ANTI-ROBÔS (App Check) 👇
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Ldh1mssAAAAAJKmL47CVANSKHTCm-xGNqQ8NJ4W'),
  isTokenAutoRefreshEnabled: true
});
// 👆 FIM DA SEGURANÇA 👆

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// --- EXPORTAÇÕES DE FUNÇÕES DO FIREBASE ---
export { 
  app, 
  db, 
  auth, 
  storage,
  // Firestore Functions
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit,
  orderBy,
  // Auth Functions
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  // Storage Functions
  ref,
  uploadBytes,
  getDownloadURL
};

// ============================================
// CONSTANTES E COLEÇÕES
// ============================================
export const COLLECTIONS = {
  PRODUTOS: 'produtos',
  PEDIDOS: 'pedidos',
  CONFIGURACOES: 'configuracoes',
  USUARIOS: 'usuarios',
  CATEGORIAS: 'categorias'
};

export const STATUS_PEDIDO = {
  RECEBIDO: 'recebido',
  EM_PREPARO: 'em_preparo',
  SAIU_ENTREGA: 'saiu_entrega',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado'
};

// ============================================
// FUNÇÕES AUXILIARES (Preço, Data, CEP e Notificações)
// ============================================

// Formata R$ 10,00
export function formatarPreco(valor) {
  if (!valor && valor !== 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Formata Data Legível
export function formatarData(timestamp) {
  if (!timestamp) return '-';
  const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  }).format(data);
}

// --- FUNÇÕES DE CEP ---
export function validarCEP(cep) {
    const regex = /^[0-9]{5}-?[0-9]{3}$/;
    return regex.test(cep);
}
  
export async function buscarEnderecoPorCEP(cep) {
    try {
        const cepLimpo = cep.replace(/\D/g, '');
        if (!cepLimpo) return null;
        
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await response.json();
        
        if (dados.erro) {
            throw new Error('CEP não encontrado');
        }
        
        return {
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}

// --- NOTIFICAÇÃO (Toast) ---
export function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  let container = document.getElementById('toast-container');
  if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 99999;";
      document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const corFundo = tipo === 'sucesso' ? '#10b981' : '#ef4444';
  
  toast.style.cssText = `
      background: ${corFundo};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      margin-top: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-family: 'Inter', sans-serif;
      animation: slideIn 0.3s ease-out;
      display: flex; align-items: center; gap: 8px;
  `;
  
  const icone = tipo === 'sucesso' ? '✅' : '⚠️';
  toast.innerHTML = `<strong>${icone}</strong> <span>${mensagem}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Estilo de animação global
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;
document.head.appendChild(styleSheet);

console.log('🔥 Firebase Configurado (Admin + CEP + App Check) OK!');
