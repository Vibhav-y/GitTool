import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Github, LogOut, Key, Trash2, Coins, Zap, Crown, Rocket } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(null);
    const [packages, setPackages] = useState([]);
    const [buying, setBuying] = useState(false);

    const email = user?.email || 'No email provided';
    const name = user?.user_metadata?.full_name || user?.user_metadata?.user_name || 'Anonymous Developer';
    const avatarUrl = user?.user_metadata?.avatar_url || null;
    const isGithubUser = user?.app_metadata?.provider === 'github';

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const headers = { Authorization: `Bearer ${session.access_token}` };

                const [balanceRes, packagesRes] = await Promise.allSettled([
                    axios.get(`${API_BASE}/tokens/balance`, { headers }),
                    axios.get(`${API_BASE}/tokens/packages`),
                ]);

                if (balanceRes.status === 'fulfilled') setTokenBalance(balanceRes.value.data.balance);
                if (packagesRes.status === 'fulfilled') setPackages(packagesRes.value.data.packages);
            } catch (err) {
                console.error('Failed to fetch token data:', err);
            }
        };
        if (user) fetchTokenData();
    }, [user]);

    const handleBuyTokens = async (packageId) => {
        setBuying(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { Authorization: `Bearer ${session.access_token}` };

            // 1. Create order
            const { data: orderData } = await axios.post(`${API_BASE}/tokens/order`, { packageId }, { headers });

            // 2. Open Razorpay
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'GitTool',
                description: `Purchase tokens`,
                order_id: orderData.orderId,
                handler: async (response) => {
                    try {
                        const { data: verifyData } = await axios.post(`${API_BASE}/tokens/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }, { headers });

                        setTokenBalance(verifyData.newBalance);
                        toast.success(`${verifyData.tokensAdded} tokens added!`);
                    } catch (err) {
                        console.error(err);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: { email },
                theme: { color: '#c9956a', backdrop_color: '#0a0a0b' },
                modal: { backdropclose: true, animation: true },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            toast.error('Failed to create order');
        } finally {
            setBuying(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Successfully logged out.');
        } catch (error) {
            console.error(error);
            toast.error('Failed to log out.');
        } finally {
            setLoading(false);
        }
    };

    const packageIcons = { starter: <Zap size={20} />, pro: <Crown size={20} />, unlimited: <Rocket size={20} /> };
    const packageColors = { starter: '#c9956a', pro: '#a78bfa', unlimited: '#22d3ee' };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Profile</h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '28px' }}>Manage your account and tokens.</p>

            <div style={{ display: 'grid', gap: '20px' }}>

                {/* User Card */}
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '28px' }}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar"
                            style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid var(--border)', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid var(--border)' }}>
                            <User size={28} style={{ color: 'var(--muted-foreground)' }} />
                        </div>
                    )}
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0' }}>{name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                            <Mail size={14} /> <span>{email}</span>
                        </div>
                        {isGithubUser && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginTop: '8px', padding: '3px 10px', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                                <Github size={12} /> GitHub Connected
                            </span>
                        )}
                    </div>
                </div>

                {/* Token Balance Card */}
                <div className="glass-card" style={{ padding: '28px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Coins size={18} style={{ color: '#c9956a' }} /> Token Balance
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '10px', background: 'var(--muted)', border: '1px solid var(--border)' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{tokenBalance !== null ? tokenBalance : '—'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>tokens remaining</div>
                        </div>
                        <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                            <div>• Generate README = <strong>2 tokens</strong></div>
                            <div>• AI Chat edit = <strong>1 token</strong></div>
                        </div>
                    </div>
                </div>

                {/* Buy Tokens */}
                <div className="glass-card" style={{ padding: '28px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Buy Tokens
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                        {packages.map(pkg => (
                            <div key={pkg.id} style={{
                                padding: '20px', borderRadius: '10px', border: `1px solid ${packageColors[pkg.id] || 'var(--border)'}33`,
                                background: `linear-gradient(160deg, ${packageColors[pkg.id] || '#c9956a'}08, var(--card))`,
                                textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px',
                            }}>
                                <div style={{ color: packageColors[pkg.id] || '#c9956a' }}>
                                    {packageIcons[pkg.id] || <Coins size={20} />}
                                </div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{pkg.tokens}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>tokens</div>
                                <button
                                    onClick={() => handleBuyTokens(pkg.id)}
                                    disabled={buying}
                                    className="btn-primary"
                                    style={{
                                        padding: '8px 0', fontSize: '0.82rem', borderRadius: '8px', width: '100%',
                                        background: packageColors[pkg.id] || '#c9956a', border: 'none', color: '#fff',
                                        cursor: buying ? 'not-allowed' : 'pointer', opacity: buying ? 0.6 : 1,
                                    }}
                                >
                                    {pkg.priceDisplay}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#ef4444', marginBottom: '20px' }}>Danger Zone</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem' }}>Sign Out</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Log out on this device.</p>
                            </div>
                            <button onClick={handleLogout} disabled={loading} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                <LogOut size={14} /> {loading ? 'Logging out...' : 'Log Out'}
                            </button>
                        </div>
                        <div style={{ height: '1px', background: 'var(--border)' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', color: '#ef4444' }}>Delete Account</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Permanently erase all data.</p>
                            </div>
                            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
