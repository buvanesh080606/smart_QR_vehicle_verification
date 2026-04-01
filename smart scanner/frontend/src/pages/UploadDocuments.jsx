import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle, FileText, AlertCircle, Loader2, Sparkles, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const docConfig = {
  rc:        { label: 'RC Certificate',    sub: 'Registration Certificate', color: '#4f46e5', bg: 'rgba(79,70,229,0.06)' },
  insurance: { label: 'Insurance Policy',  sub: 'Policy Document',          color: '#0891b2', bg: 'rgba(8,145,178,0.06)'  },
  puc:       { label: 'PUC Certificate',   sub: 'Pollution Under Control',   color: '#059669', bg: 'rgba(5,150,105,0.06)' },
};

const UploadDocuments = () => {
  const [files, setFiles] = useState({ rc: null, insurance: null, puc: null });
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileChange = (e, type) => {
    if (e.target.files?.[0]) setFiles({ ...files, [type]: e.target.files[0] });
  };

  const removeFile = (type) => setFiles({ ...files, [type]: null });

  const handleUploadAndOCR = async () => {
    if (!files.rc || !files.insurance || !files.puc) {
      setError('Please upload all 3 documents to proceed.');
      return;
    }
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('rc', files.rc);
    formData.append('insurance', files.insurance);
    formData.append('puc', files.puc);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/vehicles/uploadDocuments`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExtractedData(data.data);
    } catch {
      setError('AI Engine failed to process images. Please try again with clearer photos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/vehicles/registerVehicle`, extractedData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
// LocalStorage logic removed. Server handles data isolation.
      navigate(`/qr/${data.vehicleID}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration error. Check your inputs.');
    }
  };

  const handleChangeForm = (e) => setExtractedData({ ...extractedData, [e.target.name]: e.target.value });

  const inputStyle = {
    display: 'block', width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.8)',
    border: '1.5px solid rgba(79,70,229,0.1)',
    borderRadius: '12px',
    fontSize: '0.9rem', fontWeight: 600, color: '#0f0e1a',
    fontFamily: 'inherit', outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: '6px'
  };

  const sectionHeaderStyle = {
    display: 'flex', alignItems: 'center', gap: '8px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(79,70,229,0.07)'
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 0 60px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
        <span className="pill" style={{ marginBottom: '12px', display: 'inline-flex' }}>
          <Sparkles style={{ width: 11, height: 11 }} /> AI-Powered
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f0e1a', letterSpacing: '-0.03em', margin: '8px 0 6px' }}>
          Register Vehicle
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          Upload your documents — our AI engine extracts all details automatically.
        </p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '14px 18px',
              background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.2)',
              borderRadius: '14px', marginBottom: '24px',
              fontSize: '0.875rem', fontWeight: 500, color: '#e11d48', overflow: 'hidden'
            }}
          >
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {!extractedData ? (
        <div>
          {/* Upload Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {['rc', 'insurance', 'puc'].map((type, idx) => {
              const cfg = docConfig[type];
              const hasFile = !!files[type];
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  style={{
                    position: 'relative', height: '200px',
                    background: hasFile ? `rgba(5,150,105,0.04)` : 'rgba(255,255,255,0.7)',
                    border: `2px dashed ${hasFile ? 'rgba(5,150,105,0.4)' : 'rgba(79,70,229,0.15)'}`,
                    borderRadius: '20px',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.25s ease',
                    overflow: 'hidden'
                  }}
                >
                  {hasFile ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
                      <button
                        onClick={() => removeFile(type)}
                        style={{
                          position: 'absolute', top: '12px', right: '12px',
                          width: '28px', height: '28px',
                          background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)',
                          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#e11d48'
                        }}
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                      <div style={{ width: '48px', height: '48px', background: 'rgba(5,150,105,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <CheckCircle style={{ width: '24px', height: '24px', color: '#059669' }} />
                      </div>
                      <p style={{ fontWeight: 700, fontSize: '0.8rem', color: '#059669', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cfg.label}</p>
                      <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                        {files[type].name}
                      </p>
                    </div>
                  ) : (
                    <label style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '24px', textAlign: 'center' }}>
                      <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileChange(e, type)} />
                      <div style={{ width: '48px', height: '48px', background: cfg.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', border: `1px solid ${cfg.color}22` }}>
                        <UploadCloud style={{ width: '22px', height: '22px', color: cfg.color }} />
                      </div>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f0e1a', margin: '0 0 4px' }}>{cfg.label}</p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{cfg.sub}</p>
                      <p style={{ fontSize: '0.7rem', color: '#c4c4d4', marginTop: '8px' }}>Click or drag to upload</p>
                    </label>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Extract Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleUploadAndOCR} disabled={loading}
              className="btn-primary"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', padding: '14px 32px' }}
            >
              {loading ? (
                <><Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} /> Processing…</>
              ) : (
                <><Sparkles style={{ width: '18px', height: '18px' }} /> Extract with AI</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitRegistration}
          style={{
            background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(79,70,229,0.1)',
            borderRadius: '28px', padding: '40px',
            boxShadow: '0 8px 48px rgba(79,70,229,0.08)'
          }}
        >
          {/* Form Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px', paddingBottom: '24px', borderBottom: '1px solid rgba(79,70,229,0.08)' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(5,150,105,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: '22px', height: '22px', color: '#059669' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f0e1a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>AI Extraction Complete</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Review and confirm the extracted details before generating your QR Code.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {/* RC */}
            <div>
              <div style={sectionHeaderStyle}>
                <div style={{ width: '30px', height: '30px', background: 'rgba(79,70,229,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText style={{ width: '15px', height: '15px', color: '#4f46e5' }} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '0.8rem', color: '#0f0e1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Registration Certificate</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Plate Number</label>
                  <input name="rcVehicleNumber" value={extractedData.rcVehicleNumber} onChange={handleChangeForm} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Owner Full Name</label>
                  <input name="ownerName" value={extractedData.ownerName} onChange={handleChangeForm} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div>
              <div style={sectionHeaderStyle}>
                <div style={{ width: '30px', height: '30px', background: 'rgba(8,145,178,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck style={{ width: '15px', height: '15px', color: '#0891b2' }} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '0.8rem', color: '#0f0e1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Insurance Policy</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Policy Number</label>
                  <input name="insurancePolicy" value={extractedData.insurancePolicy} onChange={handleChangeForm} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" name="insuranceStartDate" value={extractedData.insuranceStartDate} onChange={handleChangeForm} style={{ ...inputStyle, fontSize: '0.82rem' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Expiry Date</label>
                    <input type="date" name="insuranceExpiryDate" value={extractedData.insuranceExpiryDate} onChange={handleChangeForm} style={{ ...inputStyle, fontSize: '0.82rem' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* PUC */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={sectionHeaderStyle}>
                <div style={{ width: '30px', height: '30px', background: 'rgba(5,150,105,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle style={{ width: '15px', height: '15px', color: '#059669' }} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '0.8rem', color: '#0f0e1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Emission Control (PUC)</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Certificate Number</label>
                  <input name="pucNumber" value={extractedData.pucNumber} onChange={handleChangeForm} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input type="date" name="pucExpiryDate" value={extractedData.pucExpiryDate} onChange={handleChangeForm} style={{ ...inputStyle, fontSize: '0.82rem' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(79,70,229,0.08)', flexWrap: 'wrap', gap: '16px' }}>
            <button type="button" onClick={() => setExtractedData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}>
              ← Start Over
            </button>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 36px' }}>
              <Sparkles style={{ width: '16px', height: '16px' }} />
              Register & Generate QR
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default UploadDocuments;
