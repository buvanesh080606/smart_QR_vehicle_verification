import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`http://${window.location.hostname}:5000/api/auth/login`, { email, password });
      login(data);
      navigate(data.role === 'police' ? '/scanner' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative'
    }}>
      {/* Blobs */}
      <div className="blob-indigo" style={{ width: '500px', height: '500px', top: '-150px', left: '-150px' }} />
      <div className="blob-violet" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: '440px',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(79,70,229,0.1)',
          borderRadius: '28px',
          padding: '48px 40px',
          boxShadow: '0 8px 48px rgba(79,70,229,0.1), 0 1px 2px rgba(0,0,0,0.04)',
          position: 'relative', zIndex: 1
        }}
      >
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(79,70,229,0.25)'
          }}>
            <ShieldCheck style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f0e1a', letterSpacing: '-0.03em', margin: '0 0 6px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
            Sign in to your SmartVerify account
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 16px',
              background: 'rgba(225,29,72,0.06)',
              border: '1px solid rgba(225,29,72,0.2)',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '0.85rem', fontWeight: 500, color: '#e11d48'
            }}
          >
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '18px', height: '18px', color: '#9ca3af', pointerEvents: 'none'
            }} />
            <input
              type="email" required
              className="input-field"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '18px', height: '18px', color: '#9ca3af', pointerEvents: 'none'
            }} />
            <input
              type="password" required
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '8px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Signing In…' : (
              <>Sign In <ArrowRight style={{ width: '16px', height: '16px' }} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748b', margin: '24px 0 0' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
