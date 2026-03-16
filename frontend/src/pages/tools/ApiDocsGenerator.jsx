import NavbarPortal from '../../components/NavbarPortal';
import React, { useState } from 'react';
import { FileText, Loader2, Sparkles, Copy } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import api from '../../lib/apiClient';

export default function ApiDocsGenerator() {
    const { selectedRepo: repo } = useWorkspace();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!repo) { setError('Select a repository first'); return; }
        setLoading(true); setError(null); setContent('');
        try {
            const o = repo.owner?.login || repo.full_name?.split('/')[0];
            const res = await api.post(`/tools/${o}/${repo.name}/generate-api-docs`);
            setContent(res.content || 'No API documentation could be generated.');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleCopy = () => navigator.clipboard.writeText(content);

    return (
        <div className="tool-page">
            <NavbarPortal>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText size={18} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h2 className="tool-page-title">API Docs Generator</h2>
                        
                    </div>
                </div>
            </NavbarPortal>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</> : <><Sparkles size={16} /> Generate API Docs</>}
                </button>
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 16px', fontSize: '0.8125rem', color: '#f87171', marginBottom: 16 }}>{error}</div>}

            {content && (
                <div className="panel">
                    <div className="panel-header" style={{ justifyContent: 'space-between' }}>
                        <h3 className="panel-title"><FileText size={16} className="text-accent" /> Generated Documentation</h3>
                        <button className="btn-ghost" onClick={handleCopy}><Copy size={14} /> Copy Markdown</button>
                    </div>
                    <div className="panel-body">
                        <pre style={{
                            background: '#020617', borderRadius: 8, padding: 20,
                            fontSize: '0.8125rem', lineHeight: 1.7, color: '#e2e8f0',
                            fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap',
                            overflow: 'auto', maxHeight: 600,
                        }}>
                            {content}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
