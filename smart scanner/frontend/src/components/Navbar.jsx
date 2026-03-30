import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon, QrCode, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
              flexShrink: 0
            }}>
              <ShieldCheck style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f0e1a', letterSpacing: '-0.02em' }}>
              Smart<span style={{ color: '#4f46e5' }}>Verify</span>
            </span>
          </Link>

          {/* Nav Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px',
                  background: 'rgba(79,70,229,0.05)',
                  border: '1px solid rgba(79,70,229,0.1)',
                  borderRadius: '999px',
                  fontSize: '0.8rem'
                }}>
                  <UserIcon style={{ width: '14px', height: '14px', color: '#4f46e5' }} />
                  <span style={{ fontWeight: 600, color: '#374151' }}>{user.name}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    color: 'white',
                    padding: '2px 8px', borderRadius: '999px'
                  }}>{user.role}</span>
                </div>

                {user.role === 'owner' && (
                  <Link to="/dashboard" style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px',
                    color: '#4f46e5', fontWeight: 600, fontSize: '0.875rem',
                    background: 'rgba(79,70,229,0.06)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}>
                    <LayoutDashboard style={{ width: '15px', height: '15px' }} />
                    Dashboard
                  </Link>
                )}

                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  background: 'none',
                  border: 'none', cursor: 'pointer',
                  color: '#9ca3af', fontWeight: 600, fontSize: '0.875rem',
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => e.target.parentElement.style.color = '#e11d48'}
                onMouseLeave={e => e.target.parentElement.style.color = '#9ca3af'}
                >
                  <LogOut style={{ width: '15px', height: '15px' }} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" style={{
                  padding: '8px 18px',
                  color: '#374151', fontWeight: 600, fontSize: '0.875rem',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  transition: 'all 0.2s'
                }}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.875rem' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
