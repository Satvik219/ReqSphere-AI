import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRoundPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginWithGoogle, registerWithPassword } from '../../auth/authService';

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      await registerWithPassword(name, email, password);
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

  return <main className="landing"><section className="landing-card"><div className="mark">R</div><p className="eyebrow">REQSPHERE AI</p><h1>Create your requirements workspace.</h1><p>Start organizing evidence, requirements, and decisions in one place.</p></section><form className="card form" onSubmit={submit}><div><UserRoundPlus size={24}/><h2>Create your account</h2><p>Set up an account with email or Google.</p></div><label>Name<input autoComplete="name" placeholder="Your name" value={name} onChange={event=>setName(event.target.value)} required/></label><label>Email<input type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={event=>setEmail(event.target.value)} required/></label><label>Password<input type="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={event=>setPassword(event.target.value)} minLength="8" required/><small>Use at least 8 characters.</small></label>{error&&<p className="form-error">{error}</p>}<button className="button primary" disabled={pending}>{pending?'Creating account…':'Create account'}</button><button className="button auth-secondary" type="button" onClick={google} disabled={pending}><FcGoogle size={20}/> Continue with Google</button><p>Already have an account? <Link className="button auth-secondary" to="/login">Sign in</Link></p></form></main>;
}