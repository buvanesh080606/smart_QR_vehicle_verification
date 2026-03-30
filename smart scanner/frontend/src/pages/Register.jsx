import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Car, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`http://${window.location.hostname}:5000/api/auth/register`, { name, email, password, role });
      login(data);
      navigate(data.role === 'police' ? '/scanner' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
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
      <div className="blob-indigo" style={{ width: '500px', height: '500px', top: '-150px', left: '-150px' }} />
      <div className="blob-violet" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: '480px',
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(79,70,229,0.25)'
          }}>
            <Sparkles style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f0e1a', letterSpacing: '-0.03em', margin: '0 0 6px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
            Join SmartVerify — it's free
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <UserIcon style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '18px', height: '18px', color: '#9ca3af', pointerEvents: 'none'
            }} />
            <input
              type="text" required
              className="input-field"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Role Selector */}
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
              I am a…
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { value: 'owner', label: 'Vehicle Owner', sub: 'Register vehicles', icon: <Car style={{ width: '20px', height: '20px' }} /> },
                { value: 'police', label: 'Traffic Police', sub: 'Verify vehicles', icon: <Shield style={{ width: '20px', height: '20px' }} /> }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    padding: '14px 12px',
                    borderRadius: '14px',
                    border: role === opt.value ? '2px solid #4f46e5' : '1.5px solid rgba(79,70,229,0.12)',
                    background: role === opt.value ? 'rgba(79,70,229,0.06)' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', gap: '6px',
                    boxShadow: role === opt.value ? '0 0 0 4px rgba(79,70,229,0.08)' : 'none'
                  }}
                >
                  <div style={{ color: role === opt.value ? '#4f46e5' : '#9ca3af' }}>
                    {opt.icon}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: role === opt.value ? '#0f0e1a' : '#374151', display: 'block' }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '12px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Creating account…' : (
              <>Create Account <ArrowRight style={{ width: '16px', height: '16px' }} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748b', margin: '24px 0 0' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
