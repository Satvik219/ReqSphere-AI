import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chrome, LockKeyhole } from 'lucide-react';
import { loginWithGoogle, loginWithPassword } from '../../auth/authService';

export function LoginPage() {
  const navigate=useNavigate(); const [email,setEmail]=useState('analyst@reqsphere.local'); const [password,setPassword]=useState('password'); const [error,setError]=useState(''); const [pending,setPending]=useState(false);
  const submit=async event=>{event.preventDefault();setPending(true);setError('');try{await loginWithPassword(email,password);navigate('/dashboard')}catch(e){setError(e.message)}finally{setPending(false)}};
  const google=async()=>{setPending(true);setError('');try{await loginWithGoogle();navigate('/dashboard')}catch(e){setError(e.message)}finally{setPending(false)}};
  return <main className="landing"><section className="landing-card"><div className="mark">R</div><p className="eyebrow">REQSPHERE AI</p><h1>Sign in to your requirements workspace.</h1><p>Evidence-backed requirements, decisions and professional BRDs in one secure workspace.</p></section><form className="card form" onSubmit={submit}><div><LockKeyhole size={22}/><h2>Welcome back</h2><p>Use local development credentials or Google.</p></div><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength="6"/></label>{error&&<p className="form-error">{error}</p>}<button className="button primary" disabled={pending}>{pending?'Signing in…':'Sign in'}</button><button className="button secondary" type="button" onClick={google} disabled={pending}><Chrome size={16}/> Continue with Google</button></form></main>;
}
