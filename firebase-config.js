/**
 * CONFIGURAÇÃO DO FIREBASE - ATUALIZADO
 */

// Importar os SDKs do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// ADICIONEI getDoc e setDoc NA LINHA ABAIXO 👇
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,      // <--- IMPORTANTE PARA O RASTREIO
    setDoc,      // <--- IMPORTANTE PARA CONFIGURAÇÕES
    doc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot, 
    query,
    where,       // <--- PARA FILTROS
    limit,       // <--- PARA LIMITAR RESULTADOS
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Exportar instâncias para uso em outros arquivos
export { 
  app, 
  db, 
  auth, 
  storage,
  // Firestore Functions
  collection,
  addDoc,
  getDocs,
  getDoc, // <--- ADICIONADO AQUI A EXPORTAÇÃO
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,  // <--- PARA FILTROS
  limit,  // <--- PARA LIMITAR RESULTADOS
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
// COLEÇÕES DO FIRESTORE
// ============================================
export const COLLECTIONS = {
  PRODUTOS: 'produtos',
  PEDIDOS: 'pedidos',
  CONFIGURACOES: 'configuracoes',
  USUARIOS: 'usuarios',
  CATEGORIAS: 'categorias' // Adicionei categorias aqui
};

// ============================================
// STATUS DE PEDIDOS
// ============================================
export const STATUS_PEDIDO = {
  RECEBIDO: 'recebido',
  EM_PREPARO: 'em_preparo',
  SAIU_ENTREGA: 'saiu_entrega',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado'
};

// ============================================
// FORMAS DE PAGAMENTO
// ============================================
export const FORMAS_PAGAMENTO = {
  PIX: 'pix',
  CARTAO_ONLINE: 'cartao_online',
  CARTAO_MAQUINA: 'cartao_maquina',
  DINHEIRO: 'dinheiro'
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

export function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export function formatarData(timestamp) {
  if (!timestamp) return 'Data indisp.';
  const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);
}

// Gera um ID numérico curto (ex: 4829) para facilitar a comunicação
export function gerarIdPedido() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function validarCEP(cep) {
  const regex = /^[0-9]{5}-?[0-9]{3}$/;
  return regex.test(cep);
}

export async function buscarEnderecoPorCEP(cep) {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
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

export function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  // Cria o container se não existir
  let container = document.getElementById('toast-container');
  if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999;";
      document.body.appendChild(container);
  }

  // Cria o toast
  const toast = document.createElement('div');
  toast.style.cssText = `
      background: ${tipo === 'sucesso' ? '#10B981' : '#EF4444'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      animation: slideIn 0.3s ease;
      display: flex; align-items: center; gap: 8px;
  `;
  
  const icone = tipo === 'sucesso' ? '✅' : '❌';
  toast.innerHTML = `<span>${icone}</span> <span>${mensagem}</span>`;

  container.appendChild(toast);

  // Remove depois de 3 segundos
  setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
  }, 3000);
}

console.log('🔥 Firebase configurado: getDoc e setDoc disponíveis!');