import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import { ShieldCheck, AlertTriangle, XCircle, FileText, Car, User, Calendar, Download, Eye, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PublicVehicleView = () => {
   const { id } = useParams();
   const [vehicle, setVehicle] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   useEffect(() => {
      const fetchVehicle = async () => {
         try {
            const { data } = await axios.get(`${API_BASE_URL}/api/vehicles/public/${id}`);
            setVehicle(data);
         } catch (err) {
            setError(err.response?.data?.message || 'Vehicle record not found.');
         } finally {
            setLoading(false);
         }
      };
      fetchVehicle();
   }, [id]);

   if (loading) return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
         <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', marginBottom: '16px' }} />
         <p style={{ color: '#64748b', fontWeight: 600 }}>Verifying Credentials...</p>
      </div>
   );

   if (error) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' }}>
         <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <XCircle style={{ width: '64px', height: '64px', color: '#ef4444', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f0e1a', marginBottom: '8px' }}>Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>{error}</p>
            <Link to="/" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Back to Home</Link>
         </div>
      </div>
   );

   if (!vehicle) return null;

   // 🧠 Status Logic
   const getStatus = () => {
      const now = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(now.getDate() + 30);

      const insExp = new Date(vehicle.insuranceExpiryDate);
      const pucExp = new Date(vehicle.pucExpiryDate);

      // RED if any expired
      if (insExp < now || pucExp < now) return 'RED';
      // ORANGE if any expiring in < 30 days
      if (insExp < thirtyDays || pucExp < thirtyDays) return 'ORANGE';
      // GREEN otherwise
      return 'GREEN';
   };

   const status = getStatus();

   const styles = {
      GREEN: {
         bg: '#ecfdf5',
         accent: '#10b981',
         banner: '✅ ALL DOCUMENTS VALID',
         icon: <ShieldCheck style={{ width: 48, height: 48, color: 'white' }} />,
         bannerBg: '#10b981'
      },
      ORANGE: {
         bg: '#fff7ed',
         accent: '#f59e0b',
         banner: '⚠️ DOCUMENT EXPIRING SOON',
         icon: <AlertTriangle style={{ width: 48, height: 48, color: 'white' }} />,
         bannerBg: '#f59e0b'
      },
      RED: {
         bg: '#fef2f2',
         accent: '#ef4444',
         banner: '🚨 DOCUMENT EXPIRED',
         icon: <XCircle style={{ width: 48, height: 48, color: 'white' }} />,
         bannerBg: '#ef4444'
      }
   }[status];

   const getDocStatus = (date) => {
      const exp = new Date(date);
      const now = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(now.getDate() + 30);
      
      if (exp < now) return 'Expired';
      if (exp < thirtyDays) return 'Expiring Soon';
      return 'Valid';
   };

   const getDocIcon = (status) => {
      if (status === 'Expired') return '🔴';
      if (status === 'Expiring Soon') return '🟠';
      return '🟢';
   };

   const renderDocCard = (title, date, imagePath) => {
      const docStatus = getDocStatus(date);
      const isExpired = docStatus === 'Expired';
      const imageURL = `${API_BASE_URL}/${imagePath}`;

      return (
         <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            border: `1px solid ${isExpired ? '#fee2e2' : '#f1f5f9'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
         }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
               <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: isExpired ? '#fef2f2' : '#ecfdf5',
                  color: isExpired ? '#ef4444' : '#10b981',
                  textTransform: 'uppercase'
               }}>{docStatus}</span>
            </div>

            {imagePath ? (
               <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/10' }}>
                  <img src={imageURL} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <a href={imageURL} target="_blank" rel="noreferrer" style={{
                     position: 'absolute', bottom: '8px', right: '8px',
                     background: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '8px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                     <Eye style={{ width: '16px', height: '16px', color: '#4f46e5' }} />
                  </a>
               </div>
            ) : (
               <div style={{ height: '100px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText style={{ width: '32px', height: '32px', color: '#cbd5e1' }} />
               </div>
            )}

            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>
               Expires: {new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
         </div>
      );
   };

   return (
      <div style={{ minHeight: '100vh', background: styles.bg, paddingBottom: 80 }}>
         {/* Status Banner */}
         <div style={{
            background: styles.bannerBg,
            padding: '40px 24px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
         }}>
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}
            >
               <div style={{ padding: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
                  {styles.icon}
               </div>
            </motion.div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{styles.banner}</h1>
         </div>

         <div style={{ maxWidth: '600px', margin: '-30px auto 0', padding: '0 20px' }}>
            {/* Identity Card */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               style={{
                  background: 'white',
                  borderRadius: '32px',
                  padding: '32px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                  marginBottom: '24px',
                  textAlign: 'left',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#334155',
                  lineHeight: '1.8'
               }}
            >
               <div>🚗 {vehicle.vehicleNumber}</div>
               <div>👤 {vehicle.ownerName}</div>

               <div style={{ marginTop: '20px' }}>
                  RC: 🟢 Valid
               </div>
               <div>
                  Insurance: {getDocIcon(getDocStatus(vehicle.insuranceExpiryDate))} {getDocStatus(vehicle.insuranceExpiryDate)}
               </div>
               <div>
                  PUC: {getDocIcon(getDocStatus(vehicle.pucExpiryDate))} {getDocStatus(vehicle.pucExpiryDate)}
               </div>

               <div style={{ marginTop: '20px', fontWeight: '800', color: styles.accent, textTransform: 'uppercase' }}>
                 {status === 'RED' ? '🚨 STATUS: RED ALERT' : status === 'ORANGE' ? '⚠️ STATUS: ORANGE ALERT' : '✅ STATUS: CLEAR'}
               </div>
            </motion.div>

            {/* Document Cards */}
            <div style={{ display: 'grid', gap: '16px' }}>
               {renderDocCard('Registration (RC)', vehicle.insuranceExpiryDate /* Fallback or specific RC field if exists */, vehicle.rcImage)}
               {renderDocCard('Insurance Policy', vehicle.insuranceExpiryDate, vehicle.insuranceImage)}
               {renderDocCard('Pollution (PUC)', vehicle.pucExpiryDate, vehicle.pucImage)}
            </div>

            {/* Expiring Alerts */}
            {status !== 'GREEN' && (
               <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  borderRadius: '20px',
                  background: 'white',
                  border: `2px solid ${styles.accent}20`
               }}>
                  <p style={{ color: styles.accent, fontWeight: 800, margin: 0, fontSize: '0.9rem' }}>
                     {status === 'RED' ? '🚨 ACTION REQUIRED: Vehicle is NOT road-legal.' : '⚠ ADVISORY: Renew documents as soon as possible.'}
                  </p>
               </div>
            )}

            <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.4 }}>
               <ShieldCheck style={{ width: 20, height: 20, margin: '0 auto 8px' }} />
               <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Verified Digital Record</p>
            </div>
         </div>
      </div>
   );
};

export default PublicVehicleView;
