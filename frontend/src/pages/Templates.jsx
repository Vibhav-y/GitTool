import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Templates() {
    const templates = [
        { id: 'professional', name: 'Professional', desc: 'Clean, formal README suitable for business and open-source enterprise tools.' },
        { id: 'minimalist', name: 'Minimalist', desc: 'Barebones, visually clean README template focusing directly on the essentials.' },
        { id: 'creative', name: 'Creative', desc: 'A quirky, visually engaging README filled with badges, emojis, and modern styling.' },
        { id: 'detailed', name: 'Highly Detailed', desc: 'Perfect for massive repositories requiring deep documentation and contribution guides.' }
    ];

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Template Gallery</h1>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                    Browse our collection of expertly crafted README templates designed to make your projects stand out on GitHub.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {templates.map(t => (
                    <div key={t.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                            <div style={{ padding: '8px', backgroundColor: 'var(--muted)', borderRadius: '8px', color: 'var(--primary)' }}>
                                <BookOpen size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{t.name}</h3>
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', flex: 1, marginBottom: '24px', lineHeight: 1.6 }}>
                            {t.desc}
                        </p>
                        <Link to="/create" className="btn-secondary" style={{ width: '100%' }}>
                            Use Template
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
