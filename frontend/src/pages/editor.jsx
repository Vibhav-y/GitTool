import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Download, Save, Edit3, FileText, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const TEMPLATES = [
    { id: 'professional', name: 'Professional' },
    { id: 'minimal', name: 'Minimalist' },
    { id: 'creative', name: 'Creative' },
    { id: 'detailed', name: 'Highly Detailed' }
];

function Editor() {
    const { owner, repo } = useParams();
    const [readme, setReadme] = useState('');
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState('professional');
    const navigate = useNavigate();

    const generateReadme = async (selectedTemplate) => {
        const token = localStorage.getItem('github_token');
        if (!token) return navigate('/auth');

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/readme`, {
                token,
                owner,
                repo,
                template: selectedTemplate || template
            });
            setReadme(res.data.readme);
            toast.success('README successfully generated!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate README. Check your API key or server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateReadme('professional');
        // eslint-disable-next-line
    }, [owner, repo, navigate]);

    const downloadRaw = () => {
        const blob = new Blob([readme], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        a.click();
        toast.success('Downloaded README.md');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(readme);
        toast.success('Copied to clipboard');
    };

    const handleRegenerate = () => {
        generateReadme(template);
    };

    return (
        <div className="layout-container main-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                    <Link to="/repos" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Repos
                    </Link>
                    <h1 style={{ fontSize: '2rem' }}>README for {repo}</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Template:</span>
                        <select
                            className="input-field"
                            style={{ padding: '4px 8px', fontSize: '0.9rem', width: 'auto', border: 'none', backgroundColor: 'transparent', outline: 'none' }}
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                        >
                            {TEMPLATES.map(t => (
                                <option key={t.id} value={t.id} style={{ backgroundColor: 'var(--bg-color)' }}>{t.name}</option>
                            ))}
                        </select>
                        <button className="btn-secondary" onClick={handleRegenerate} style={{ padding: '6px 10px' }} disabled={loading}>
                            <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Generating...' : 'Regenerate'}
                        </button>
                    </div>

                    <button className="btn-secondary" onClick={downloadRaw}>
                        <Download size={18} /> Download
                    </button>
                    <button className="btn-primary" onClick={copyToClipboard}>
                        <Save size={18} /> Copy to Clipboard
                    </button>
                </div>
            </div>

            {loading && !readme ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '16px', minHeight: '400px' }}>
                    <div className="spinner"></div>
                    <p>Analyzing repository and generating your README with the {template} template...</p>
                </div>
            ) : (
                <div className="editor-container">
                    <div className="editor-pane">
                        <div className="pane-header">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={16} /> Source (Markdown)</span>
                        </div>
                        <textarea
                            className="markdown-editor"
                            value={readme}
                            onChange={(e) => setReadme(e.target.value)}
                            spellCheck="false"
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1 }}
                        />
                    </div>
                    <div className="editor-pane">
                        <div className="pane-header">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Live Preview</span>
                        </div>
                        <div className="markdown-preview" style={{ opacity: loading ? 0.7 : 1 }}>
                            <ReactMarkdown>{readme}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Editor;
