import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, ScanLine, ArrowLeft, Zap, Shield, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PoliceScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result && result.length > 0 && !scanned) {
      const rawValue = result[0].rawValue;
      if (!rawValue) return;

      console.log('Scanned QR:', rawValue);
      setScanned(true);

      const normalizedValue = rawValue.trim();

      // Extract ID from URL if it's a URL
      if (normalizedValue.toLowerCase().startsWith('http')) {
        try {
          const url = new URL(normalizedValue);
          const parts = url.pathname.split('/').filter(p => p);
          const vehicleID = parts.pop(); 
          
          if (vehicleID) {
            navigate(`/verify/${vehicleID}`);
          } else {
            // Fallback: use the whole normalized value if pop failed
            navigate(`/verify/${normalizedValue}`);
          }
        } catch (e) {
          // Fallback: if URL parsing fails, just try the raw value
          navigate(`/verify/${normalizedValue}`);
        }
      } else {
        // Assume rawValue is the ID or Plate Number
        navigate(`/verify/${normalizedValue}`);
      }
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px' }}>
      <div className="blob-indigo" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="pill" style={{ background: 'rgba(8,145,178,0.06)', color: '#0891b2', borderColor: 'rgba(8,145,178,0.12)' }}>
            <Zap style={{ width: 12, height: 12 }} /> Live Smart Verifier
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f0e1a', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
          Identity Verification
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
          Align the <span style={{ color: '#4f46e5', fontWeight: 700 }}>Smart QR Code</span> within the frame
        </p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          aspectRatio: '1',
          position: 'relative',
          borderRadius: '40px',
          padding: '12px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(79,70,229,0.15)',
          boxShadow: '0 20px 80px rgba(79,70,229,0.15)',
          zIndex: 1
        }}
      >
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '30px',
          overflow: 'hidden',
          background: '#0a0a0f',
          position: 'relative'
        }}>
          <Scanner
            onScan={handleScan}
            formats={['qr_code']}
            components={{
              audio: false,
              onOff: true,
              torch: true,
              zoom: true,
              finder: false
            }}
            styles={{
              container: { width: '100%', height: '100%' },
              video: { objectFit: 'cover' }
            }}
          />
          
          {/* Overlay UI */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '240px', height: '240px', position: 'relative' }}>
              {/* Corners */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '32px', height: '32px', borderTop: '4px solid #22d3ee', borderLeft: '4px solid #22d3ee', borderTopLeftRadius: '16px' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '32px', height: '32px', borderTop: '4px solid #22d3ee', borderRight: '4px solid #22d3ee', borderTopRightRadius: '16px' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '32px', height: '32px', borderBottom: '4px solid #22d3ee', borderLeft: '4px solid #22d3ee', borderBottomLeftRadius: '16px' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderBottom: '4px solid #22d3ee', borderRight: '4px solid #22d3ee', borderBottomRightRadius: '16px' }} />
              
              {/* Scan Line */}
              <div className="scan-line" />
            </div>
            
            {/* Dark Mask */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, calc(50% - 120px) calc(50% - 120px), calc(50% - 120px) calc(50% + 120px), calc(50% + 120px) calc(50% + 120px), calc(50% + 120px) calc(50% - 120px), calc(50% - 120px) calc(50% - 120px))'
            }} />
          </div>

          {/* Status Label */}
          <div style={{
            position: 'absolute', bottom: '24px', left: '0', right: '0',
            display: 'flex', justifyContent: 'center'
          }}>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <div style={{ width: '8px', height: '8px', background: '#22d3ee', borderRadius: '50%', boxShadow: '0 0 10px #22d3ee' }} className="animate-pulse" />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {scanned ? 'Processing...' : 'Awaiting Smart QR...'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: '24px',
              padding: '12px 20px',
              background: 'rgba(225,29,72,0.08)',
              color: '#e11d48',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(225,29,72,0.2)'
            }}
          >
            <AlertCircle style={{ width: '16px', height: '16px' }} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '48px', display: 'flex', gap: '12px', width: '100%', maxWidth: '440px' }}>
        <button 
          onClick={() => {
            const val = prompt("Enter Vehicle Plate Number:");
            if (val) navigate(`/verify/${val.replace(/\s/g, '').toUpperCase()}`);
          }}
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '16px',
            background: 'white',
            border: '1.5px solid rgba(79,70,229,0.12)',
            borderRadius: '18px',
            color: '#374151', fontWeight: 700, fontSize: '0.9rem',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={e => e.target.style.borderColor = 'rgba(79,70,229,0.3)'}
          onMouseLeave={e => e.target.style.borderColor = 'rgba(79,70,229,0.12)'}
        >
          <QrCode style={{ width: '18px', height: '18px', color: '#9ca3af' }} />
          Manual Entry
        </button>
        <Link 
          to="/dashboard"
          style={{
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', gap: '8px',
            color: '#9ca3af', fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
          Cancel
        </Link>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.3 }}>
        <Shield style={{ width: '12px', height: '12px' }} />
        <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Secure Verification Infrastructure
        </span>
      </div>
    </div>
  );
};

export default PoliceScanner;
