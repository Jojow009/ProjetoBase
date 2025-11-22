"use server";

// SDK do CLIENTE (para interagir com o Firestore)
import { db } from "@/lib/firestore/firebaseconfig";
// SDK do ADMIN (para verificar usuários no servidor)
import { adminAuth } from "@/lib/firestore/firebaseAdmin"; 

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { type TaskFormData } from "@/lib/validations/formschema";
import { revalidatePath } from "next/cache";

// --- Função de Ajuda de Autenticação ---
/**
 * Verifica o ID Token do Firebase vindo do cliente.
 * Retorna o 'uid' do usuário se o token for válido.
 * Retorna 'null' se o token for inválido ou expirar.
 */
async function getUserIdFromToken(idToken: string): Promise<string | null> {
  if (!idToken) return null;
  try {
    // adminAuth.verifyIdToken() é a função-chave do Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    // Token inválido, expirado, etc.
    console.error("Erro ao verificar ID token:", error);
    return null;
  }
}


// --- 1. Criar Tarefa (Corrigido) ---
export const createTaskAction = async (data: TaskFormData, idToken: string) => {
  // Verifica se o token é válido e pega o ID do usuário
  const userId = await getUserIdFromToken(idToken);
  if (!userId) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    // Adiciona o ID do usuário verificado e a data de criação
    const taskData = {
      ...data,
      userId: userId, // Usa o ID verificado
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "tasks"), taskData);
    
    revalidatePath("/dashboard");
    revalidatePath("/kanban");
    revalidatePath("/calendar");

    return { success: true, message: "Tarefa criada com sucesso!" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao criar a tarefa." };
  }
};

// --- 2. Atualizar Tarefa (Corrigido e Seguro) ---
export const updateTaskAction = async (taskId: string, data: TaskFormData, idToken: string) => {
  const userId = await getUserIdFromToken(idToken);
  if (!userId) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    const taskRef = doc(db, "tasks", taskId);
    
    // Verificação de segurança: O usuário é dono desta tarefa?
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) {
      return { success: false, error: "Tarefa não encontrada." };
    }
    if (taskSnap.data().userId !== userId) {
      return { success: false, error: "Acesso negado." };
    }

    // Se a verificação passar, atualiza a tarefa
    await updateDoc(taskRef, {
        ...data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/kanban");
    revalidatePath("/calendar");
    // revalidatePath(`/task/${taskId}`); // Descomente se tiver página de detalhe

    return { success: true, message: "Tarefa atualizada com sucesso!" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao atualizar a tarefa." };
  }
};

// --- 3. Buscar Tarefas (Corrigido) ---
export const getTasksAction = async (idToken: string) => {
    const userId = await getUserIdFromToken(idToken);
    if (!userId) {
        return { success: false, error: "Usuário não autenticado.", data: [] };
    }

    try {
        // Busca tarefas ONDE o 'userId' é igual ao 'userId' verificado do token
        const q = query(collection(db, "tasks"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const tasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { success: true, data: tasks };

    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao buscar tarefas.", data: [] };
    }
};

// --- 4. ATUALIZAR STATUS (Corrigido e Seguro) ---
export const updateTaskStatusAction = async (taskId: string, newStatus: 'todo' | 'doing' | 'done', idToken: string) => {
  const userId = await getUserIdFromToken(idToken);
  if (!userId) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    const taskRef = doc(db, "tasks", taskId);

    // Verificação de segurança: O usuário é dono desta tarefa?
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) {
      return { success: false, error: "Tarefa não encontrada." };
    }
    if (taskSnap.data().userId !== userId) {
      return { success: false, error: "Acesso negado." };
    }
    
    // Se a verificação passar, atualiza o status
    await updateDoc(taskRef, {
      status: newStatus // Atualiza APENAS o status
    });

    revalidatePath("/kanban");
    revalidatePath("/dashboard");

    return { success: true, message: "Status da tarefa atualizado!" };
  } catch (error)
 {
    console.error(error);
    return { success: false, error: "Erro ao atualizar o status." };
  }
};

// --- 5. Buscar Tarefa por ID (Corrigido) ---
export const getTaskByIdAction = async (taskId: string, idToken: string) => {
  const userId = await getUserIdFromToken(idToken);
  if (!userId) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      return { success: false, error: "Tarefa não encontrada." };
    }

    const taskData = taskSnap.data();

    // Verificação de segurança: O usuário só pode ver as próprias tarefas
    if (taskData.userId !== userId) { // Compara com o ID verificado
        return { success: false, error: "Acesso negado." };
    }

    const task = {
      id: taskSnap.id,
      ...taskData,
    };

    return { success: true, data: task };

  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao buscar a tarefa." };
  }
};