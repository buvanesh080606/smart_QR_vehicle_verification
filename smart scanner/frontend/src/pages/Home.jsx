import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, ScanLine, ArrowRight, Zap, Lock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] }
});

const features = [
  { icon: <Zap style={{ width: 16, height: 16, color: '#4f46e5' }} />, label: 'AI-Powered OCR' },
  { icon: <Lock style={{ width: 16, height: 16, color: '#4f46e5' }} />, label: 'Military-Grade Encryption' },
  { icon: <Globe style={{ width: 16, height: 16, color: '#4f46e5' }} />, label: 'Live Status Verification' },
];

const Home = () => {
  return (
    <div style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 24px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs */}
      <div className="blob-indigo" style={{ width: '600px', height: '600px', top: '-200px', left: '-200px' }} />
      <div className="blob-violet" style={{ width: '500px', height: '500px', top: '-100px', right: '-200px' }} />
      <div className="blob-cyan" style={{ width: '400px', height: '400px', bottom: '-100px', right: '10%' }} />

      {/* ── Hero ── */}
      <motion.div {...fadeUp(0)} style={{ textAlign: 'center', maxWidth: '720px', position: 'relative', zIndex: 1 }}>
        {/* Pill badge */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill">
            <ShieldCheck style={{ width: 12, height: 12 }} />
            Next-Gen Vehicle Verification
          </span>
        </motion.div>

        {/* Hero Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 15 }}
          style={{ marginBottom: '32px', position: 'relative', display: 'inline-block' }}
        >
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 16px 48px rgba(79,70,229,0.30), 0 0 0 12px rgba(79,70,229,0.06)',
            margin: '0 auto'
          }}>
            <ShieldCheck style={{ width: '42px', height: '42px', color: 'white' }} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.2)} style={{
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          color: '#0f0e1a',
          marginBottom: '20px'
        }}>
          Smart QR-Based
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Vehicle Verification
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p {...fadeUp(0.3)} style={{
          fontSize: '1.1rem',
          color: '#64748b',
          lineHeight: 1.7,
          marginBottom: '48px',
          fontWeight: 400,
          maxWidth: '560px',
          margin: '0 auto 48px'
        }}>
          A government-grade platform to digitize vehicle documents, extract details with AI OCR, and verify validity instantly using encrypted QR codes.
        </motion.p>

        {/* Feature pills */}
        <motion.div {...fadeUp(0.35)} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '52px' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(79,70,229,0.1)',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              backdropFilter: 'blur(8px)'
            }}>
              {f.icon}
              {f.label}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.4)} style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary">
            Get Started Free
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
          <Link to="/login" className="btn-ghost">
            Sign In
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Portal Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          marginTop: '96px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '900px',
          position: 'relative', zIndex: 1
        }}
      >
        {/* Owner Card */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          className="card"
          style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden' }}
        >
          {/* Subtle inner glow */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '150px', height: '150px',
            background: 'radial-gradient(ellipse, rgba(79,70,229,0.1), transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div className="icon-blob-indigo" style={{ width: 'fit-content' }}>
            <FileCheck style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f0e1a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Vehicle Owners
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Register your vehicle, upload RC, Insurance & PUC documents once — get a unified Smart QR Code usable everywhere.
            </p>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280' }}>
              <div style={{ width: '6px', height: '6px', background: '#4f46e5', borderRadius: '50%', flexShrink: 0 }} />
              Upload documents with AI extraction
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280' }}>
              <div style={{ width: '6px', height: '6px', background: '#4f46e5', borderRadius: '50%', flexShrink: 0 }} />
              Generate & download Smart QR
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280' }}>
              <div style={{ width: '6px', height: '6px', background: '#4f46e5', borderRadius: '50%', flexShrink: 0 }} />
              Track validity in real-time
            </div>
          </div>

          <Link to="/login" className="btn-primary" style={{ marginTop: '8px', justifyContent: 'space-between' }}>
            <span>Owner Portal</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </motion.div>


      </motion.div>

      {/* ── Footer Trust Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ marginTop: '72px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {['256-bit Encrypted', 'Real-Time Data', 'Government Compliant'].map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af',
            letterSpacing: '0.04em'
          }}>
            <div style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }} />
            {t}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
