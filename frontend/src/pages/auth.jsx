import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

function Auth() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleGithubLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    scopes: 'repo read:user'
                }
            });
            if (error) throw error;
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="layout-container main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '40px', textAlign: 'center' }}>
                <Github size={48} className="text-gradient" style={{ margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome to GitTool</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Sign in with GitHub to generate awesome READMEs automatically.
                </p>

                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleGithubLogin}
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '12px', padding: '12px 16px', fontSize: '1.1rem' }}
                >
                    <Github size={24} /> Continue with GitHub
                </button>
            </div>
        </div>
    );
}

export default Auth;
