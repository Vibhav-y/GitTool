import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Github, LogOut, Key, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Safely extract metadata from Supabase Auth Object
    const email = user?.email || 'No email provided';
    const name = user?.user_metadata?.full_name || user?.user_metadata?.user_name || 'Anonymous Developer';
    const avatarUrl = user?.user_metadata?.avatar_url || null;
    const isGithubUser = user?.app_metadata?.provider === 'github';

    const handleLogout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Successfully logged out.');
            // Navigation is automatically handled by ProtectedRoute/AuthContext sync
        } catch (error) {
            console.error(error);
            toast.error('Failed to log out.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Profile Settings</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage your account and preferences.</p>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr' }}>

                {/* User Card */}
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px' }}>
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            style={{ width: '96px', height: '96px', borderRadius: '50%', border: '2px solid var(--border-color)', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid var(--border-color)' }}>
                            <User size={40} className="text-gradient" />
                        </div>
                    )}

                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>{name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                            <Mail size={16} /> <span>{email}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            {isGithubUser && (
                                <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                    <Github size={14} /> Connected to GitHub
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security & Access Section */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Key size={20} className="text-gradient" /> Security
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0' }}>Authentication Method</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                You are currently authenticating via {isGithubUser ? 'GitHub OAuth' : 'Email/Password'}.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#ef4444', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Danger Zone
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0' }}>Sign Out</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Log out of GitTool on this device.</p>
                            </div>
                            <button onClick={handleLogout} disabled={loading} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LogOut size={16} /> {loading ? 'Logging out...' : 'Log Out'}
                            </button>
                        </div>

                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', color: '#ef4444' }}>Delete Account</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Permanently erase all your data and generated projects.</p>
                            </div>
                            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                                <Trash2 size={16} /> Delete Account
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
