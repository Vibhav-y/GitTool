import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, FileText, Zap, Eye, LayoutTemplate, CheckCircle2, Star, ChevronRight } from 'lucide-react';

function Home() {
    const [visible, setVisible] = useState(false);
    useEffect(() => { setVisible(true); }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* ─── HERO ─── */}
            <section style={{
                textAlign: 'center',
                paddingTop: '100px',
                paddingBottom: '80px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Ambient glow */}
                <div style={{
                    position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
                    width: '800px', height: '800px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none', zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {/* Pill badge */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            border: '1px solid var(--border)', padding: '6px 20px', borderRadius: '9999px',
                            fontSize: '0.8rem', fontWeight: 500, backgroundColor: 'var(--card)', color: 'var(--muted-foreground)'
                        }}>
                            <Star size={14} style={{ color: '#22d3ee' }} />
                            <span>Now with 4 AI-powered templates</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.05,
                        maxWidth: '900px',
                        margin: '0 auto 28px',
                        fontWeight: 700,
                    }}>
                        Ship better projects with<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #22d3ee, #818cf8)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>stunning READMEs</span>
                    </h1>

                    <p style={{
                        margin: '0 auto 48px', fontSize: '1.2rem',
                        color: 'var(--muted-foreground)', maxWidth: '560px', lineHeight: 1.7,
                    }}>
                        Connect your GitHub, pick a template, and let AI generate
                        production-ready documentation in seconds — not hours.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <Link to="/auth" className="btn-primary" style={{
                            height: '3.25rem', padding: '0 28px', fontSize: '1rem',
                            background: 'linear-gradient(135deg, #18181b, #27272a)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <Github size={18} /> Connect GitHub <ArrowRight size={16} />
                        </Link>
                        <Link to="/templates" className="btn-secondary" style={{
                            height: '3.25rem', padding: '0 28px', fontSize: '1rem',
                        }}>
                            View Templates
                        </Link>
                    </div>

                    {/* Social proof */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '48px' }}>
                        <div style={{ display: 'flex' }}>
                            {['#6366f1', '#22d3ee', '#f59e0b', '#ef4444', '#10b981'].map((c, i) => (
                                <div key={i} style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: c, border: '2px solid var(--background)',
                                    marginLeft: i > 0 ? '-10px' : 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', color: '#fff', fontWeight: 700,
                                }}>
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                            Loved by <strong style={{ color: 'var(--foreground)' }}>2,400+</strong> developers
                        </span>
                    </div>
                </div>
            </section>

            {/* ─── EDITOR PREVIEW ─── */}
            <section style={{
                maxWidth: '960px', width: '100%', margin: '0 auto 100px', padding: '0 24px',
                opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
                <div style={{
                    borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03)',
                    overflow: 'hidden',
                }}>
                    {/* Title bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px',
                        borderBottom: '1px solid var(--border)', background: 'var(--muted)',
                    }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                            README.md — GitTool Editor
                        </div>
                    </div>
                    {/* Split panes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '340px' }}>
                        {/* Left: fake markdown */}
                        <div style={{ padding: '24px', borderRight: '1px solid var(--border)', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: 'var(--muted-foreground)', lineHeight: 1.8 }}>
                            <span style={{ color: 'var(--foreground)', fontWeight: 600 }}># My Awesome Project</span><br />
                            <span style={{ opacity: 0.5 }}>&gt; A brief description</span><br /><br />
                            <span style={{ color: '#22d3ee' }}>## 🚀 Features</span><br />
                            <span>- ⚡ Lightning fast</span><br />
                            <span>- 🔒 Secure by default</span><br />
                            <span>- 📦 Zero config setup</span><br /><br />
                            <span style={{ color: '#22d3ee' }}>## Installation</span><br />
                            <span style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>npm install my-project</span><br /><br />
                            <span style={{ color: '#22d3ee' }}>## Usage</span><br />
                            <span style={{ background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>import App from 'my-project'</span>
                        </div>
                        {/* Right: rendered preview */}
                        <div style={{ padding: '24px', fontSize: '0.85rem', lineHeight: 1.7, background: 'var(--background)' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', fontWeight: 700 }}>My Awesome Project</h2>
                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '20px', fontSize: '0.85rem' }}>A brief description</p>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--foreground)' }}>🚀 Features</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                                {['⚡ Lightning fast', '🔒 Secure by default', '📦 Zero config setup'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                        <CheckCircle2 size={14} style={{ color: '#22d3ee', flexShrink: 0 }} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Installation</h3>
                            <div style={{ background: 'var(--muted)', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '16px', border: '1px solid var(--border)' }}>
                                $ npm install my-project
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section style={{ padding: '0 24px 100px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <p style={{ color: '#22d3ee', fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How it works</p>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Three steps to great docs</h2>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                        No more staring at a blank file. Go from zero to polished in under a minute.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                    {[
                        { step: '01', icon: <Github size={24} />, title: 'Connect GitHub', desc: 'Sign in with GitHub OAuth. We securely access your public and private repos.' },
                        { step: '02', icon: <LayoutTemplate size={24} />, title: 'Pick a Template', desc: 'Choose Professional, Creative, Minimal, or Detailed — each crafted for a different audience.' },
                        { step: '03', icon: <Zap size={24} />, title: 'Generate & Edit', desc: 'AI analyzes your codebase and produces a complete README. Fine-tune it in our live editor.' },
                    ].map((item, i) => (
                        <div key={i} style={{ position: 'relative', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card)' }}>
                            <span style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '3rem', fontWeight: 800, color: 'var(--border)', lineHeight: 1 }}>{item.step}</span>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(129,140,248,0.1))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '20px', color: '#22d3ee',
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6, fontSize: '0.9rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%', borderTop: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <p style={{ color: '#22d3ee', fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features</p>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Built for developers</h2>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                        Everything you need to make your open-source projects look world-class.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {[
                        { icon: <LayoutTemplate size={20} />, title: 'Multiple Templates', desc: 'Professional, Creative, Minimalist, or Detailed — each template produces a structurally different README.' },
                        { icon: <Eye size={20} />, title: 'Live Split Preview', desc: 'Edit raw markdown on the left, see the rendered output on the right — changes update instantly.' },
                        { icon: <Zap size={20} />, title: 'AI-Powered Analysis', desc: 'GPT-4o-mini reads your repo metadata, languages, and structure to write contextual documentation.' },
                        { icon: <FileText size={20} />, title: 'One-Click Export', desc: 'Download your finished README.md or save it to your dashboard for future editing and versioning.' },
                    ].map((f, i) => (
                        <div key={i} style={{
                            padding: '28px', borderRadius: '12px', border: '1px solid var(--border)',
                            background: 'var(--card)', display: 'flex', gap: '16px', alignItems: 'flex-start',
                            transition: 'border-color 0.2s',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                                background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(129,140,248,0.1))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee',
                            }}>
                                {f.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{f.title}</h3>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section style={{ padding: '0 24px 100px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div style={{
                    textAlign: 'center', padding: '64px 40px', borderRadius: '16px',
                    border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--card), var(--muted))',
                }}>
                    <div style={{
                        position: 'absolute', top: '-60px', right: '-60px',
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', position: 'relative' }}>Ready to ship?</h2>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem', marginBottom: '36px', maxWidth: '460px', margin: '0 auto 36px' }}>
                        Connect your GitHub and generate your first professional README in less than 60 seconds — completely free.
                    </p>
                    <Link to="/auth" className="btn-primary" style={{
                        height: '3.25rem', padding: '0 32px', fontSize: '1rem',
                        background: 'linear-gradient(135deg, #18181b, #27272a)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        Get Started Free <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer style={{
                borderTop: '1px solid var(--border)', padding: '40px 24px',
                maxWidth: '1000px', margin: '0 auto', width: '100%',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <FileText size={20} style={{ color: '#22d3ee' }} /> GitTool
                </div>
                <span style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
                    © {new Date().getFullYear()} GitTool. Built with ❤️ for open source.
                </span>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s' }}><Github size={18} /></a>
                </div>
            </footer>
        </div>
    );
}

export default Home;
