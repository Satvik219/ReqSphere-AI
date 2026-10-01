import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { apiClient } from '../api/client';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
const saveSession = session => localStorage.setItem('reqsphere-session', JSON.stringify(session));
export const getSession = () => JSON.parse(localStorage.getItem('reqsphere-session') ?? 'null');
export const getAccessToken = () => getSession()?.token ?? null;
export const logout = () => localStorage.removeItem('reqsphere-session');

export async function loginWithPassword(email, password) { const session = await apiClient('/auth/login', { method:'POST', body:JSON.stringify({email,password}) }); saveSession(session); return session; }
export async function loginWithGoogle() { if (!hasFirebaseConfig) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to .env.'); const app=getApps()[0] ?? initializeApp(firebaseConfig); const result=await signInWithPopup(getAuth(app),new GoogleAuthProvider()); const idToken=await result.user.getIdToken(); const session=await apiClient('/auth/firebase',{method:'POST',body:JSON.stringify({idToken})});saveSession(session);return session; }
