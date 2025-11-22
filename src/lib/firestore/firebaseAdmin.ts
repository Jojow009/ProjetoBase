// lib/firestore/firebaseAdmin.ts
import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

// Carregue a chave da conta de serviço
const serviceAccount = require("../../../serviceAccountKey.json"); // Ajuste o caminho se necessário

// Inicializa o Firebase Admin SDK (apenas se não foi inicializado)
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Exporta as instâncias de autenticação e do firestore do admin
const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };