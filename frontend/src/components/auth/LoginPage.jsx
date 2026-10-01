import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginWithGoogle, loginWithPassword } from '../../auth/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      await loginWithPassword(email, password);
      navigate('/dashboard');
    } catch (reason) {
      setError(reason.message);
    } finally {
      setPending(false);
    }
  };

  const google = async () => {
    setPending(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (reason) {
      setError(reason.message);
    } finally {
      setPending(false);
    }
  };

  return <main className="landing"><section className="landing-card"><div className="mark">R</div><p className="eyebrow">REQSPHERE AI</p><h1>Sign in to your requirements workspace.</h1><p>Evidence-backed requirements, decisions and professional BRDs in one secure workspace.</p></section><form className="card form" onSubmit={submit}><div><LockKeyhole size={24}/><h2>Welcome back</h2><p>Sign in with your email and password or continue with Google.</p></div><label>Email<input type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={event=>setEmail(event.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={event=>setPassword(event.target.value)} required minLength="6"/></label>{error&&<p className="form-error">{error}</p>}<button className="button primary" disabled={pending}>{pending?'Signing in…':'Sign in'}</button><button className="button auth-secondary" type="button" onClick={google} disabled={pending}><FcGoogle size={20}/> Continue with Google</button><p>New to ReqSphere? <Link className="button auth-secondary" to="/signup">Create an account</Link></p></form></main>;
}
