import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { apiClient } from '../api/client';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
const firebaseApp = hasFirebaseConfig ? getApps()[0] ?? initializeApp(firebaseConfig) : null;
export const analyticsReady = firebaseApp
  ? isSupported().then(supported => supported ? getAnalytics(firebaseApp) : null).catch(() => null)
  : Promise.resolve(null);
const saveSession = session => localStorage.setItem('reqsphere-session', JSON.stringify(session));
const firstName = value => value?.trim().replace(/^[^\p{L}\p{N}]+/u, '').split(/\s+/)[0] || '';
export const getSession = () => JSON.parse(localStorage.getItem('reqsphere-session') ?? 'null');
export const getAccessToken = () => getSession()?.token ?? null;
export const logout = () => localStorage.removeItem('reqsphere-session');

export async function loginWithPassword(email, password) { const session = await apiClient('/auth/login', { method:'POST', body:JSON.stringify({email,password}) }); saveSession(session); return session; }
export async function registerWithPassword(name, email, password) { const session = await apiClient('/auth/signup', { method:'POST', body:JSON.stringify({name,email,password}) }); saveSession(session); return session; }
export async function loginWithGoogle() { if (!firebaseApp) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to .env.'); const result=await signInWithPopup(getAuth(firebaseApp),new GoogleAuthProvider()); const idToken=await result.user.getIdToken(); const session=await apiClient('/auth/firebase',{method:'POST',body:JSON.stringify({idToken})});const firebaseName=firstName(result.user.displayName);if(firebaseName)session.user={...session.user,name:firebaseName};saveSession(session);return session; }
