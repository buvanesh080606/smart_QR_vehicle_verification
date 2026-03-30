import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const QRCodePage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const qrRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(`http://${window.location.hostname}:5000/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setVehicle(data);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
      }
    };
    if (user) fetchVehicle();
  }, [id, user]);

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartQR_${vehicle?.vehicleNumber || id}.png`;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  if (!vehicle) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,70,229,0.2)', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px 60px' }}>
      <Link to="/dashboard" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#9ca3af', fontWeight: 600, fontSize: '0.875rem',
        textDecoration: 'none', marginBottom: '32px',
        transition: 'color 0.2s'
      }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(79,70,229,0.1)',
          borderRadius: '32px',
          padding: '48px 40px',
          boxShadow: '0 16px 64px rgba(79,70,229,0.1)',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Subtle blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(ellipse, rgba(79,70,229,0.06), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', background: 'radial-gradient(ellipse, rgba(8,145,178,0.05), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <span className="pill" style={{ marginBottom: '24px', display: 'inline-flex' }}>
            <ShieldCheck style={{ width: 12, height: 12 }} /> Smart Verified
          </span>

          {/* Vehicle Info */}
          <h1 style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, color: '#0f0e1a', letterSpacing: '0.04em', margin: '0 0 6px' }}>
            {vehicle.vehicleNumber}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0 0 36px', fontWeight: 500 }}>
            {vehicle.ownerName}
          </p>

          {/* QR Code Container */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            ref={qrRef}
            style={{
              display: 'inline-block',
              padding: '28px',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(79,70,229,0.12), 0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid rgba(79,70,229,0.08)',
              position: 'relative'
            }}
          >
            {/* Corner accents */}
            {[['top','left'], ['top','right'], ['bottom','left'], ['bottom','right']].map(([v, h]) => (
              <div key={`${v}-${h}`} style={{
                position: 'absolute', [v]: '-3px', [h]: '-3px',
                width: '20px', height: '20px',
                borderTop: v === 'top' ? '3px solid #4f46e5' : 'none',
                borderBottom: v === 'bottom' ? '3px solid #4f46e5' : 'none',
                borderLeft: h === 'left' ? '3px solid #4f46e5' : 'none',
                borderRight: h === 'right' ? '3px solid #4f46e5' : 'none',
                borderTopLeftRadius: v === 'top' && h === 'left' ? '6px' : 0,
                borderTopRightRadius: v === 'top' && h === 'right' ? '6px' : 0,
                borderBottomLeftRadius: v === 'bottom' && h === 'left' ? '6px' : 0,
                borderBottomRightRadius: v === 'bottom' && h === 'right' ? '6px' : 0,
                opacity: 0.4
              }} />
            ))}
            <QRCodeCanvas
              value={window.location.hostname === 'localhost' ? vehicle.qrCodeURL : `${window.location.origin}/vehicle/${id}`}
              size={220} level="H" includeMargin={false}
            />
          </motion.div>

          {/* Action Buttons */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={downloadQR}
              className={downloaded ? '' : 'btn-primary'}
              style={downloaded ? {
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                width: '100%', fontFamily: 'inherit',
                background: 'rgba(5,150,105,0.1)', color: '#059669',
                fontWeight: 700, fontSize: '0.9rem'
              } : {
                width: '100%', justifyContent: 'center', padding: '14px'
              }}
            >
              {downloaded
                ? <><Check style={{ width: '18px', height: '18px' }} /> Saved to Device</>
                : <><Download style={{ width: '18px', height: '18px' }} /> Download Smart QR</>
              }
            </button>

            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '13px', borderRadius: '14px',
              background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.1)',
              color: '#4f46e5', fontWeight: 700, fontSize: '0.875rem',
              cursor: 'pointer', fontFamily: 'inherit', width: '100%'
            }}>
              <Share2 style={{ width: '16px', height: '16px' }} /> Share Code
            </button>
          </div>

          <p style={{ marginTop: '20px', fontSize: '0.72rem', color: '#c4c4d4', fontFamily: 'monospace' }}>
            ID: {id}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default QRCodePage;
