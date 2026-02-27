import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, LayoutDashboard, Search, FileSignature, Settings, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Layout() {
    const { user } = useAuth();

    // Fallback info for auth user
    const avatarUrl = user?.user_metadata?.avatar_url || null;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Logged out successfully');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
            <nav style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="layout-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px 24px' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--foreground)', fontWeight: 600, fontSize: '1.25rem' }}>
                        <FileText className="text-cyan" size={24} />
                        GitTool
                    </Link>
                    {user ? (
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--muted-foreground)', fontSize: '0.9rem', fontWeight: 500 }} className="nav-link">Dashboard</Link>
                            <Link to="/templates" style={{ textDecoration: 'none', color: 'var(--muted-foreground)', fontSize: '0.9rem', fontWeight: 500 }} className="nav-link">Templates</Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
                                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--foreground)' }}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)' }} />
                                    ) : (
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                                            <User size={16} />
                                        </div>
                                    )}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <Link to="/auth" style={{ textDecoration: 'none', color: 'var(--foreground)', fontSize: '0.9rem', fontWeight: 500 }}>Log In</Link>
                            <Link to="/auth" className="btn-primary" style={{ padding: '8px 16px', height: 'auto' }}>Get Started</Link>
                        </div>
                    )}
                </div>
            </nav>
            <main style={{ flex: 1, padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
