import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, Save, Edit3, FileText, Bot, Send, Sparkles, Code2, LayoutGrid, Activity, ExternalLink, Users, Star, GripVertical, Waypoints, GitFork, Eye, Shield, RefreshCw, BarChart3, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export default function EditProject() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markdown, setMarkdown] = useState('');
    const [saving, setSaving] = useState(false);
    const [activeSidebarTab, setActiveSidebarTab] = useState('chat');
    const [chatInput, setChatInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const editorRef = useRef(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
                if (error) throw error;
                if (data.user_id !== user.id) { toast.error("Unauthorized"); navigate('/dashboard'); return; }
                setProject(data);
                setMarkdown(data.generated_markdown || '');
            } catch (err) {
                console.error(err);
                toast.error('Failed to load project.');
                navigate('/dashboard');
            } finally { setLoading(false); }
        };
        if (user && id) fetchProject();
    }, [id, user, navigate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.from('projects').update({ generated_markdown: markdown, updated_at: new Date() }).eq('id', id);
            if (error) throw error;
            toast.success("Saved!");
        } catch (err) { console.error(err); toast.error("Save failed."); }
        finally { setSaving(false); }
    };

    const downloadRaw = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'README.md'; a.click();
        toast.success('Downloaded!');
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const currentPrompt = chatInput;
        setChatInput('');
        setIsThinking(true);
        const githubToken = localStorage.getItem('github_token');
        const { data: { session } } = await supabase.auth.getSession();
        try {
            const res = await axios.post(`${API_BASE}/readme/chat`, {
                currentMarkdown: markdown, prompt: currentPrompt, token: githubToken
            }, { headers: { Authorization: `Bearer ${session.access_token}` } });
            setMarkdown(res.data.readme);
            toast.success("AI updated your README!");
        } catch (err) { console.error(err); toast.error("AI update failed"); }
        finally { setIsThinking(false); }
    };

    const getRepoInfo = () => {
        if (!project || !project.repo_url) return { owner: 'username', repo: 'repo' };
        const parts = project.repo_url.replace('https://github.com/', '').split('/');
        return { owner: parts[0] || 'username', repo: parts[1] || 'repo' };
    };

    const insertAtCursor = (textToInsert) => {
        const editor = editorRef.current;
        if (!editor) { setMarkdown(m => m + "\n\n" + textToInsert); toast.success("Widget added!"); return; }
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const before = markdown.substring(0, start);
        const after = markdown.substring(end);
        setMarkdown(before + textToInsert + after);
        setTimeout(() => { editor.selectionStart = editor.selectionEnd = start + textToInsert.length; editor.focus(); }, 0);
        toast.success("Widget added!");
    };

    const { owner, repo } = getRepoInfo();

    const widgets = [
        {
            category: 'Profile Stats',
            items: [
                {
                    name: 'Profile Overview', icon: <User size={16} />, desc: 'Full profile contribution card',
                    snippet: `\n\n<p align="center">\n  <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${owner}&theme=github_dark" alt="Profile Overview" />\n</p>\n`
                },
                {
                    name: 'Profile Languages', icon: <Code2 size={16} />, desc: 'Languages across all repos',
                    snippet: `\n\n<p align="center">\n  <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=${owner}&theme=github_dark" alt="Repos Per Language" />\n  <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${owner}&theme=github_dark" alt="Commit Language" />\n</p>\n`
                },
                {
                    name: 'Streak Stats', icon: <Waypoints size={16} />, desc: 'Contribution streak counter',
                    snippet: `\n\n<p align="center">\n  <img src="https://streak-stats.demolab.com?user=${owner}&theme=dark&hide_border=true&background=0d1117" alt="Streak" />\n</p>\n`
                },
            ]
        },
        {
            category: 'Repo Stats',
            items: [
                {
                    name: 'Stars Badge', icon: <Star size={16} />, desc: `Live star count for ${repo}`,
                    snippet: `\n\n![Stars](https://img.shields.io/github/stars/${owner}/${repo}?style=for-the-badge&color=22d3ee&labelColor=0d1117)\n`
                },
                {
                    name: 'Forks Badge', icon: <GitFork size={16} />, desc: `Live fork count for ${repo}`,
                    snippet: `\n\n![Forks](https://img.shields.io/github/forks/${owner}/${repo}?style=for-the-badge&color=818cf8&labelColor=0d1117)\n`
                },
                {
                    name: 'Watchers', icon: <Eye size={16} />, desc: `Live watchers for ${repo}`,
                    snippet: `\n\n![Watchers](https://img.shields.io/github/watchers/${owner}/${repo}?style=for-the-badge&color=10b981&labelColor=0d1117)\n`
                },
                {
                    name: 'License', icon: <Shield size={16} />, desc: 'License type badge',
                    snippet: `\n\n![License](https://img.shields.io/github/license/${owner}/${repo}?style=for-the-badge&color=f59e0b&labelColor=0d1117)\n`
                },
                {
                    name: 'Repo Size', icon: <BarChart3 size={16} />, desc: 'Repository size badge',
                    snippet: `\n\n![Repo Size](https://img.shields.io/github/repo-size/${owner}/${repo}?style=for-the-badge&color=a855f7&labelColor=0d1117)\n`
                },
                {
                    name: 'Last Commit', icon: <Activity size={16} />, desc: 'Last commit timestamp',
                    snippet: `\n\n![Last Commit](https://img.shields.io/github/last-commit/${owner}/${repo}?style=for-the-badge&color=22d3ee&labelColor=0d1117)\n`
                },
            ]
        },
        {
            category: 'Links & Community',
            items: [
                {
                    name: 'Live Demo Link', icon: <ExternalLink size={16} />, desc: 'Deployed site button',
                    snippet: `\n\n[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-22d3ee?style=for-the-badge)](https://your-live-site.com)\n`
                },
                {
                    name: 'Contributors', icon: <Users size={16} />, desc: 'Avatar grid of contributors',
                    snippet: `\n\n## 🤝 Contributors\n\n<a href="https://github.com/${owner}/${repo}/graphs/contributors">\n  <img src="https://contrib.rocks/image?repo=${owner}/${repo}" />\n</a>\n`
                },
            ]
        }
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--muted-foreground)' }}>Loading Editor...</p>
            </div>
        )
    }

    const tabBtn = (active, label, icon, onClick) => (
        <button onClick={onClick} style={{
            flex: 1, padding: '7px 8px', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: active ? 'var(--background)' : 'transparent',
            color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.15s ease'
        }}>
            {icon} {label}
        </button>
    );

    return (
        <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: '0 24px 24px' }}>
            {/* Top Bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', flexShrink: 0, borderBottom: '1px solid var(--border)', marginBottom: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" style={{ color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.2s' }}>
                        <ArrowLeft size={14} /> Dashboard
                    </Link>
                    <span style={{ color: 'var(--border)' }}>/</span>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        <Edit3 size={16} style={{ color: '#22d3ee' }} />
                        {project.title}
                    </h1>
                    {project.template && (
                        <span className="badge" style={{ fontSize: '0.7rem' }}>{project.template}</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="btn-secondary" onClick={downloadRaw} style={{ height: '30px', padding: '0 12px', fontSize: '0.8rem' }}>
                        <Download size={14} /> Export .md
                    </button>
                    <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ height: '30px', padding: '0 14px', fontSize: '0.8rem' }}>
                        <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* 3-Column Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: '16px', minHeight: 0, overflow: 'hidden' }}>

                {/* LEFT: Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', background: 'var(--muted)', padding: '6px', borderBottom: '1px solid var(--border)', gap: '4px' }}>
                        {tabBtn(activeSidebarTab === 'chat', 'AI Chat', <Bot size={14} />, () => setActiveSidebarTab('chat'))}
                        {tabBtn(activeSidebarTab === 'components', 'Widgets', <LayoutGrid size={14} />, () => setActiveSidebarTab('components'))}
                    </div>

                    {/* Chat */}
                    <div style={{ flex: 1, display: activeSidebarTab === 'chat' ? 'flex' : 'none', flexDirection: 'column' }}>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #22d3ee, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                                    <Sparkles size={12} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem' }}>GitTool AI</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                                        Ask me to rewrite, add sections, change tone, or fix formatting. Changes apply directly!
                                    </p>
                                </div>
                            </div>
                            {isThinking && (
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--muted)', borderRadius: '8px' }}>
                                    <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Rewriting...</span>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleChatSubmit} style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="e.g. Add an API section..."
                                    disabled={isThinking}
                                    style={{ width: '100%', padding: '9px 38px 9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '0.8rem' }}
                                />
                                <button type="submit" disabled={isThinking || !chatInput.trim()} style={{
                                    position: 'absolute', right: '4px', width: '28px', height: '28px', borderRadius: '6px',
                                    background: chatInput.trim() ? 'linear-gradient(135deg, #22d3ee, #6366f1)' : 'var(--muted)',
                                    color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: (isThinking || !chatInput.trim()) ? 0.4 : 1, transition: 'opacity 0.2s'
                                }}>
                                    <Send size={12} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Widgets */}
                    <div style={{ flex: 1, display: activeSidebarTab === 'components' ? 'flex' : 'none', flexDirection: 'column', overflowY: 'auto' }}>
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {widgets.map((group, gi) => (
                                <div key={gi}>
                                    <h5 style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        {group.category}
                                    </h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {group.items.map((w, wi) => (
                                            <button key={wi} onClick={() => insertAtCursor(w.snippet)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                                    background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px',
                                                    cursor: 'pointer', textAlign: 'left', color: 'var(--foreground)', transition: 'all 0.15s ease', width: '100%'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22d3ee'; e.currentTarget.style.background = 'var(--muted)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--background)'; }}
                                            >
                                                <div style={{ color: '#22d3ee', flexShrink: 0 }}>{w.icon}</div>
                                                <div>
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{w.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '1px' }}>{w.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER: Raw Markdown */}
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden', minHeight: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'var(--muted)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                        <Code2 size={14} style={{ color: 'var(--muted-foreground)', marginRight: '8px' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>README.md</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{markdown.length} chars</span>
                    </div>
                    <textarea
                        ref={editorRef}
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        spellCheck="false"
                        style={{
                            flex: 1, width: '100%', resize: 'none', border: 'none', outline: 'none', padding: '20px',
                            background: 'var(--background)', color: 'var(--foreground)',
                            fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                            fontSize: '0.82rem', lineHeight: 1.7, tabSize: 2
                        }}
                    />
                </div>

                {/* RIGHT: Live Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden', minHeight: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'var(--muted)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                        <FileText size={14} style={{ color: '#22d3ee', marginRight: '8px' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Preview</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                onClick={() => setPreviewKey(k => k + 1)}
                                title="Re-render preview"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
                                    border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--background)',
                                    color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500,
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22d3ee'; e.currentTarget.style.color = '#22d3ee'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
                            >
                                <RefreshCw size={12} /> Re-render
                            </button>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                            </div>
                        </div>
                    </div>
                    <div key={previewKey} className="markdown-preview" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                        {markdown ? (
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    img: (props) => (
                                        <img {...props} style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px', display: 'block', margin: '8px 0' }} loading="lazy" />
                                    ),
                                    a: ({ children, ...props }) => (
                                        <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', textDecoration: 'underline' }}>{children}</a>
                                    )
                                }}
                            >
                                {markdown}
                            </ReactMarkdown>
                        ) : (
                            <div style={{ color: 'var(--muted-foreground)', textAlign: 'center', marginTop: '60px' }}>No content</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
