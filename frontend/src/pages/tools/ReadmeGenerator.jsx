import NavbarPortal from '../../components/NavbarPortal';
import SEO from '../../components/SEO';
import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Copy, Download, Check, Send, Eye, Code2 } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import api from '../../lib/apiClient';

const TEMPLATES = [
    { value: 'professional', label: 'Professional', desc: 'Clean, enterprise-grade docs' },
    { value: 'minimalist',   label: 'Minimalist',   desc: 'Brutally concise' },
    { value: 'creative',     label: 'Creative',     desc: 'Emojis, badges, fun tone' },
    { value: 'detailed',     label: 'Detailed',     desc: 'Exhaustive documentation' },
];

export default function ReadmeGenerator() {
    const { selectedRepo: repo } = useWorkspace();
    const [template, setTemplate] = useState('professional');
    const [readme, setReadme]     = useState('');
    const [loading, setLoading]   = useState(false);
    const [chatting, setChatting] = useState(false);
    const [error, setError]       = useState(null);
    const [copied, setCopied]     = useState(false);
    const [tab, setTab]           = useState('preview');   // 'preview' | 'markdown'
    const [chatInput, setChatInput] = useState('');

    const owner = repo?.owner?.login || repo?.full_name?.split('/')[0];

    const handleGenerate = async () => {
        if (!repo) { setError('Select a repository first'); return; }
        setLoading(true); setError(null); setReadme('');
        try {
            const res = await api.post('/readme', { owner, repo: repo.name, template });
            setReadme(res.readme || '');
            setTab('preview');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleChat = async () => {
        if (!chatInput.trim() || !readme) return;
        setChatting(true); setError(null);
        try {
            const res = await api.post('/readme/chat', {
                currentMarkdown: readme,
                prompt: chatInput,
                owner,
                repo: repo?.name,
            });
            setReadme(res.readme || readme);
            setChatInput('');
        } catch (err) { setError(err.message); }
        finally { setChatting(false); }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(readme);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleDownload = () => {
        const blob = new Blob([readme], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="tool-page">
            <SEO
              title="AI README Generator – Auto Generate README from GitHub Repo"
              description="The best free AI readme generator online. Auto generate a README.md from any GitHub repo in seconds. Markdown readme generator with badges, installation, usage, and more. Free readme generator for open source projects."
              keywords={[
                'readme generator', 'ai readme generator', 'github readme generator',
                'auto generate readme from github repo', 'ai readme file generator',
                'markdown readme generator free', 'readme generator for open source projects',
                'github profile readme generator', 'generate readme from code',
                'best readme generator tool', 'readme md generator online',
                'how to write a good readme file github', 'readme template generator',
                'automated readme documentation tool',
              ]}
              noIndex={true}
            />
            <NavbarPortal>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText size={18} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h2 className="tool-page-title">README Generator</h2>
                    </div>
                </div>
            </NavbarPortal>

            {/* Config panel */}
            <div className="panel" style={{ marginBottom: 24 }}>
                <div className="panel-body">
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Template Style</h3>
                    <div className="toggle-group" style={{ marginBottom: 20 }}>
                        {TEMPLATES.map(t => (
                            <button
                                key={t.value}
                                className={`toggle-btn ${template === t.value ? 'active' : ''}`}
                                onClick={() => setTemplate(t.value)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>
                        {TEMPLATES.find(t => t.value === template)?.desc}
                        {' · '}
                        Generating for <strong style={{ color: 'var(--text-primary)' }}>{repo?.full_name || '…'}</strong>
                    </p>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 16px', fontSize: '0.8125rem', color: '#f87171', marginBottom: 16 }}>
                            {error}
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        onClick={handleGenerate}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        {loading
                            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                            : <><Sparkles size={16} /> Generate README</>
                        }
                    </button>
                </div>
            </div>

            {/* Output panel */}
            {readme && (
                <div className="panel">
                    <div className="panel-header" style={{ justifyContent: 'space-between' }}>
                        <div className="toggle-group">
                            <button className={`toggle-btn ${tab === 'preview' ? 'active' : ''}`} onClick={() => setTab('preview')}>
                                <Eye size={13} style={{ marginRight: 6 }} /> Preview
                            </button>
                            <button className={`toggle-btn ${tab === 'markdown' ? 'active' : ''}`} onClick={() => setTab('markdown')}>
                                <Code2 size={13} style={{ marginRight: 6 }} /> Markdown
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn-ghost" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button className="btn-ghost" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Download size={14} /> Download
                            </button>
                        </div>
                    </div>

                    <div className="panel-body" style={{ padding: 0 }}>
                        {tab === 'preview' ? (
                            <div
                                className="prose prose-invert max-w-none"
                                style={{
                                    padding: 24, fontSize: '0.875rem', lineHeight: 1.8,
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'pre-wrap', fontFamily: 'inherit',
                                }}
                            >
                                {readme}
                            </div>
                        ) : (
                            <pre style={{
                                padding: 24, margin: 0,
                                background: '#020617', borderRadius: '0 0 12px 12px',
                                fontSize: '0.8125rem', lineHeight: 1.7, color: '#e2e8f0',
                                fontFamily: 'JetBrains Mono, monospace',
                                whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 600,
                            }}>
                                {readme}
                            </pre>
                        )}
                    </div>

                    {/* AI Chat edit */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChat()}
                            placeholder="Ask AI to edit: 'Add Docker instructions', 'Make it more concise'…"
                            style={{
                                flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                borderRadius: 8, padding: '8px 14px', fontSize: '0.875rem',
                                color: 'var(--text-primary)', outline: 'none',
                            }}
                        />
                        <button
                            className="btn-primary"
                            onClick={handleChat}
                            disabled={chatting || !chatInput.trim()}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                        >
                            {chatting
                                ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                                : <Send size={15} />
                            }
                            {chatting ? 'Editing…' : 'Edit'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
