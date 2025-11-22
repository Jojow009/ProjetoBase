"use server";

// --- Imports do Firebase ---
import { auth, db } from "@/lib/firestore/firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

// --- Imports de Validação (Zod) ---
import { type LoginFormData, type SignupFormData } from "@/lib/validations/formschema";

// --- 1. Ação de Criar Conta (Signup) ---
// (Combina Auth e Firestore)
export const signUpAction = async (data: SignupFormData) => {
  try {
    // 1. Cria o usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = userCredential.user;

    // 2. Salva os dados extras (nome) no Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: data.name,
      email: data.email,
      createdAt: new Date(),
    });

    // await sendEmailVerification(user); // Descomente se quiser verificação
    return { success: true, message: "Conta criada com sucesso!" };

  } catch (error) {
    let errorMessage = "Ocorreu um erro ao criar a conta.";
    if (error instanceof FirebaseError) {
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este e-mail já está em uso.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha é muito fraca. Tente uma mais forte.";
      }
    }
    return { success: false, error: errorMessage };
  }
};

// --- 2. Ação de Login ---
export const signInAction = async (data: LoginFormData) => {
  try {
    await signInWithEmailAndPassword(auth, data.email, data.password);
    return { success: true };
  } catch (error) {
    let errorMessage = "E-mail ou senha inválidos.";
    if (error instanceof FirebaseError) {
      if (
        error.code !== "auth/user-not-found" &&
        error.code !== "auth/wrong-password" &&
        error.code !== "auth/invalid-credential"
      ) {
        // Se for um erro inesperado, loga
        console.error(error.message);
        errorMessage = "Ocorreu um erro ao tentar fazer login.";
      }
    }
    return { success: false, error: errorMessage };
  }
};

// --- 3. Ação de Redefinir Senha ---
export const sendPasswordResetAction = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "E-mail de redefinição enviado! Verifique sua caixa de entrada." };
  } catch (error) {
    let errorMessage = "Não foi possível enviar o e-mail de redefinição.";
    if (error instanceof FirebaseError) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

// --- 4. Ação de Logout ---
export const signOutAction = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    let errorMessage = "Erro ao fazer logout.";
    if (error instanceof FirebaseError) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};