import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Book, ArrowRight, Save, Edit3, FileText, Download, RefreshCw, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const TEMPLATES = [
    { id: 'professional', name: 'Professional' },
    { id: 'minimal', name: 'Minimalist' },
    { id: 'creative', name: 'Creative' },
    { id: 'detailed', name: 'Highly Detailed' }
];

export default function CreateProject() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Repo Selection State
    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Editor State
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [readme, setReadme] = useState('');
    const [loadingReadme, setLoadingReadme] = useState(false);
    const [template, setTemplate] = useState('professional');

    // 1. Fetch repos on mount
    useEffect(() => {
        const fetchRepos = async () => {
            const token = localStorage.getItem('github_token');
            if (!token) {
                toast.error("No GitHub token found. Please add it from your profile or re-auth.");
                return;
            }

            setLoadingRepos(true);
            try {
                const res = await axios.post(`${API_BASE}/repos`, { token });
                setRepos(res.data.repos);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch repositories. Invalid token?');
            } finally {
                setLoadingRepos(false);
            }
        };
        fetchRepos();
    }, []);

    const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Start Project Generation
    const handleSelectRepo = (repo) => {
        setSelectedRepo(repo);
        generateReadme(repo.owner.login, repo.name, template);
    };

    const generateReadme = async (owner, repoName, selectedTemplate) => {
        const token = localStorage.getItem('github_token');
        if (!token) return toast.error('GitHub token missing');

        setLoadingReadme(true);
        try {
            const res = await axios.post(`${API_BASE}/readme`, {
                token,
                owner,
                repo: repoName,
                template: selectedTemplate || template
            });
            setReadme(res.data.readme);
            toast.success(`README generated for ${repoName}!`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate README.');
        } finally {
            setLoadingReadme(false);
        }
    };

    const handleRegenerate = () => {
        if (selectedRepo) {
            generateReadme(selectedRepo.owner.login, selectedRepo.name, template);
        }
    };

    const handleSaveToDashboard = async () => {
        if (!user || !selectedRepo) return;
        try {
            const { data, error } = await supabase.from('projects').insert([{
                user_id: user.id,
                title: selectedRepo.name,
                description: selectedRepo.description || 'Generated README project',
                repo_url: selectedRepo.html_url,
                generated_markdown: readme
            }]).select();

            if (error) throw error;
            toast.success('Project saved to Dashboard!');
            navigate(`/project/${data[0].id}`);
        } catch (err) {
            toast.error('Failed to save project');
            console.error(err);
        }
    };

    const downloadRaw = () => {
        const blob = new Blob([readme], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        a.click();
        toast.success('Downloaded README.md');
    };

    // View: Repo Picker
    if (!selectedRepo) {
        return (
            <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Create New README</h1>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px' }}>Select a repository to import and generate.</p>

                <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search your repositories..."
                        style={{ paddingLeft: '40px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loadingRepos ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                        <p style={{ color: 'var(--muted-foreground)' }}>Fetching repositories from GitHub...</p>
                    </div>
                ) : (
                    <div className="repo-grid">
                        {filteredRepos.map(repo => (
                            <div key={repo.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Book size={18} className="text-cyan" /> {repo.name}
                                    </h3>
                                    <span className="badge" style={{ backgroundColor: repo.private ? 'var(--background)' : 'var(--background)', color: repo.private ? 'var(--destructive)' : 'var(--success)', border: `1px solid ${repo.private ? 'var(--destructive)' : 'var(--success)'}` }}>
                                        {repo.private ? 'Private' : 'Public'}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', flexGrow: 1, marginBottom: '24px', lineHeight: 1.5 }}>
                                    {repo.description || 'No description provided.'}
                                </p>
                                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                                        {(repo.language || 'Mixed')}
                                    </span>
                                    <button onClick={() => handleSelectRepo(repo)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.875rem', height: 'auto' }}>
                                        Import <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredRepos.length === 0 && !loadingRepos && (
                            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                                <Search size={32} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                <p>No repositories found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // View: Editor
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <button onClick={() => setSelectedRepo(null)} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px', padding: '4px 12px', height: 'auto', border: 'none', background: 'transparent' }}>
                        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Repos
                    </button>
                    <h1 style={{ fontSize: '2rem' }}>Configure {selectedRepo.name}</h1>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--card)', padding: '6px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Template</span>
                        <select
                            className="input-field"
                            style={{ padding: '4px 8px', fontSize: '0.875rem', height: 'auto', width: 'auto', border: 'none', backgroundColor: 'var(--muted)', outline: 'none', cursor: 'pointer' }}
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                        >
                            {TEMPLATES.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <button className="btn-secondary" onClick={handleRegenerate} style={{ padding: '6px 12px', height: 'auto', fontSize: '0.875rem' }} disabled={loadingReadme}>
                            <RefreshCw size={14} className={loadingReadme ? 'spin' : ''} /> {loadingReadme ? 'Generating...' : 'Regenerate'}
                        </button>
                    </div>

                    <button className="btn-secondary" onClick={downloadRaw} style={{ padding: '6px 16px', height: 'auto', fontSize: '0.875rem' }}>
                        <Download size={16} /> Download
                    </button>
                    <button className="btn-primary" onClick={handleSaveToDashboard} style={{ padding: '6px 16px', height: 'auto', fontSize: '0.875rem' }}>
                        <Save size={16} /> Save to Dashboard
                    </button>
                </div>
            </div>

            {loadingReadme && !readme ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '24px', minHeight: '400px' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem' }}>Analyzing repository and generating {template} README...</p>
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
                            disabled={loadingReadme}
                            style={{ opacity: loadingReadme ? 0.7 : 1 }}
                        />
                    </div>
                    <div className="editor-pane">
                        <div className="pane-header">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)' }}><FileText size={16} /> Live Preview</span>
                        </div>
                        <div className="markdown-preview" style={{ opacity: loadingReadme ? 0.7 : 1 }}>
                            <ReactMarkdown>{readme}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
