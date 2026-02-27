import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Twitter, Box, Activity, Puzzle, Sparkles, LayoutDashboard, FileText } from 'lucide-react';

function Home() {
    return (
        <div className="layout-container main-content" style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                        <Sparkles size={16} className="text-cyan" />
                        <span>Introducing AI-Powered Templates</span>
                    </div>
                </div>

                <h1 style={{ fontSize: '4rem', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px' }}>
                    Build stunning <span className="text-cyan">GitHub READMEs</span> in minutes
                </h1>
                
                <p style={{ margin: '0 auto 40px', fontSize: '1.25rem', color: 'var(--muted-foreground)', maxWidth: '600px', lineHeight: 1.6 }}>
                    Generate high-impact GitHub documentation using our visual editor. Pick a template, customize with AI, and export production-ready markdown.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Link to="/auth" className="btn-primary" style={{ height: '3rem', padding: '0 24px', fontSize: '1rem' }}>
                        Get Started <ArrowRight size={18} />
                    </Link>
                    <Link to="/templates" className="btn-secondary" style={{ height: '3rem', padding: '0 24px', fontSize: '1rem' }}>
                        Browse Templates
                    </Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', marginRight: '8px' }}>
                        {[1,2,3].map(i => (
                            <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--border)', border: '2px solid var(--background)', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={14} style={{color: 'var(--muted-foreground)'}}/>
                            </div>
                        ))}
                    </div>
                    <span>Joined by 10,000+ developers</span>
                </div>
            </section>

            {/* Application Preview */}
            <section style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                <div style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--card)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                        <div style={{ margin: '0 auto', fontSize: '0.875rem', color: 'var(--muted-foreground)', flex: 1, textAlign: 'center', transform: 'translateX(-18px)' }}>editor.md</div>
                    </div>
                    <div style={{ display: 'flex', minHeight: '300px' }}>
                        <div style={{ width: '60px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '24px', color: 'var(--muted-foreground)' }}>
                            <Box size={24} />
                            <LayoutDashboard size={24} />
                            <FileText size={24} />
                        </div>
                        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ width: '40%', height: '24px', backgroundColor: 'var(--muted)', borderRadius: '4px' }}></div>
                            <div style={{ width: '100%', height: '16px', backgroundColor: 'var(--muted)', borderRadius: '4px' }}></div>
                            <div style={{ width: '85%', height: '16px', backgroundColor: 'var(--muted)', borderRadius: '4px' }}></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                                <div style={{ height: '80px', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}></div>
                                <div style={{ height: '80px', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Powerful Features</h2>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem' }}>Everything you need to create professional project documentation.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
                            <Box size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Curated Templates</h3>
                        <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Choose from dozens of highly effective README structures tailored for open-source, enterprise, and personal projects.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
                            <Activity size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Live Markdown Preview</h3>
                        <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>See your README compile perfectly in real-time. What you see on the screen is exactly what GitHub renders.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
                            <Puzzle size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Dynamic Integrations</h3>
                        <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Easily insert dynamic badge links, tech-stack icons, and automatic table of contents with just a click.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ marginTop: '40px' }}>
                <div className="glass-card" style={{ padding: '60px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ready to elevate your profile?</h2>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', marginBottom: '32px', maxWidth: '600px' }}>
                        Join thousands of developers presenting their projects like professionals. Connect your GitHub and generate your first README free.
                    </p>
                    <Link to="/auth" className="btn-primary" style={{ height: '3rem', padding: '0 32px', fontSize: '1.1rem' }}>
                        Connect GitHub <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1.25rem' }}>
                    <FileText size={24} className="text-cyan" /> GitTool
                </div>
                <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                    © 2024 GitTool Inc. All rights reserved.
                </div>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--muted-foreground)' }}>
                    <a href="#" style={{ transition: 'color 0.2s', ':hover': { color: 'var(--foreground)' } }}><Github size={20} /></a>
                    <a href="#" style={{ transition: 'color 0.2s', ':hover': { color: 'var(--foreground)' } }}><Twitter size={20} /></a>
                </div>
            </footer>
        </div>
    );
}

// Quick fallback for User icon since it's used in the avatars array map
const User = ({ size, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

export default Home;
