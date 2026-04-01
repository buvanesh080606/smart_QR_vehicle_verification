import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, QrCode, Car, Calendar, ChevronRight, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  GREEN:  { dot: '#059669', bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.2)',  text: '#059669', label: 'Valid' },
  ORANGE: { dot: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)', text: '#d97706', label: 'Expiring' },
  RED:    { dot: '#e11d48', bg: 'rgba(225,29,72,0.08)', border: 'rgba(225,29,72,0.2)', text: '#e11d48', label: 'Expired' },
};

const OwnerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/vehicles`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setVehicles(data);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    };
    if (user) fetchVehicles();
  }, [user]);

  return (
    <div style={{ padding: '32px 0', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f0e1a', letterSpacing: '-0.03em', margin: 0 }}>
            My Vehicles
          </h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.95rem' }}>
            Manage documents and QR codes for your registered vehicles.
          </p>
        </div>
        <Link to="/upload" className="btn-primary">
          <PlusCircle style={{ width: '18px', height: '18px' }} />
          Add Vehicle
        </Link>
      </div>

      {/* Empty State */}
      {vehicles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'rgba(255,255,255,0.7)',
            border: '2px dashed rgba(79,70,229,0.15)',
            borderRadius: '28px',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{
            width: '72px', height: '72px',
            background: 'rgba(79,70,229,0.06)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Car style={{ width: '32px', height: '32px', color: '#4f46e5' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f0e1a', margin: '0 0 8px' }}>No vehicles yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 24px', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto' }}>
            Add your first vehicle to generate a Smart QR Code for instant police verification.
          </p>
          <Link to="/upload" className="btn-primary" style={{ display: 'inline-flex' }}>
            Register First Vehicle
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {vehicles.map((v, i) => {
            const st = statusConfig[v.status] || statusConfig.RED;
            const insExpired = new Date(v.insuranceExpiryDate) < new Date();
            const pucExpired = new Date(v.pucExpiryDate) < new Date();

            return (
              <motion.div
                key={v.vehicleID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ease: [0.22, 0.61, 0.36, 1] }}
                whileHover={{ y: -4 }}
                style={{
                  background: 'rgba(255,255,255,0.88)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(79,70,229,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease'
                }}
              >
                {/* Top section */}
                <div style={{ padding: '24px 24px 20px' }}>
                  {/* Status badge + icon row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '44px', height: '44px',
                      background: 'rgba(79,70,229,0.07)',
                      borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Car style={{ width: '22px', height: '22px', color: '#4f46e5' }} />
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '5px 12px',
                      background: st.bg,
                      border: `1px solid ${st.border}`,
                      borderRadius: '999px',
                      fontSize: '0.72rem', fontWeight: 700,
                      color: st.text, letterSpacing: '0.04em', textTransform: 'uppercase'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.dot, display: 'block', animation: v.status === 'GREEN' ? 'none' : undefined }} />
                      {st.label}
                    </span>
                  </div>

                  {/* Plate */}
                  <div style={{ marginBottom: '4px' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                      Vehicle Plate
                    </p>
                    <h3 style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.5rem', color: '#0f0e1a', letterSpacing: '0.05em', margin: 0 }}>
                      {v.vehicleNumber}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>{v.ownerName}</p>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(79,70,229,0.06)', margin: '0 24px' }} />

                {/* Dates */}
                <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Insurance Expiry', date: v.insuranceExpiryDate, expired: insExpired },
                    { label: 'PUC Expiry', date: v.pucExpiryDate, expired: pucExpired }
                  ].map(({ label, date, expired }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <Calendar style={{ width: '13px', height: '13px' }} />
                        {label}
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: expired ? '#e11d48' : '#374151' }}>
                        {new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(79,70,229,0.06)', margin: '0 24px' }} />

                {/* Action */}
                <div style={{ padding: '16px 24px' }}>
                  <Link
                    to={`/qr/${v.vehicleID}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '10px 0',
                      background: 'rgba(79,70,229,0.05)',
                      border: '1px solid rgba(79,70,229,0.1)',
                      borderRadius: '12px',
                      color: '#4f46e5', fontWeight: 700, fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <QrCode style={{ width: '16px', height: '16px' }} />
                    View Smart QR
                    <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
