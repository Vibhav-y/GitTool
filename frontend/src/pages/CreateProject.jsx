import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowRight, LayoutTemplate, Github, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const TEMPLATES = [
    { id: 'professional', name: 'Professional', desc: 'Clean, formal README suitable for business and open-source enterprise tools.' },
    { id: 'minimalist', name: 'Minimalist', desc: 'Barebones, visually clean README template focusing directly on the essentials.' },
    { id: 'creative', name: 'Creative', desc: 'A quirky, visually engaging README filled with badges, emojis, and modern styling.' },
    { id: 'detailed', name: 'Highly Detailed', desc: 'Perfect for massive repositories requiring deep documentation and contribution guides.' }
];

export default function CreateProject() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedRepo, setSelectedRepo] = useState(null);
    const [template, setTemplate] = useState('professional');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchRepos = async () => {
            const token = localStorage.getItem('github_token');
            const { data: { session } } = await supabase.auth.getSession();

            if (!token || !session) {
                toast.error("Authentication missing. Please re-auth.");
                return navigate('/auth');
            }

            setLoadingRepos(true);
            try {
                const res = await axios.post(`${API_BASE}/repos`,
                    { token },
                    { headers: { Authorization: `Bearer ${session.access_token}` } }
                );
                setRepos(res.data.repos);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch repositories. Invalid token?');
            } finally {
                setLoadingRepos(false);
            }
        };
        fetchRepos();
    }, [navigate]);

    const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelectRepo = (repo) => {
        setSelectedRepo(repo);
        setStep(2);
    };

    const handleGenerate = async () => {
        const githubToken = localStorage.getItem('github_token');
        const { data: { session } } = await supabase.auth.getSession();

        if (!githubToken || !session) {
            return toast.error('Authentication missing');
        }

        setIsGenerating(true);
        try {
            const res = await axios.post(`${API_BASE}/readme`, {
                token: githubToken,
                owner: selectedRepo.owner.login,
                repo: selectedRepo.name,
                template: template
            }, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });

            toast.success(`README generated and saved to Dashboard!`);
            navigate(`/project/${res.data.projectId}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate README.');
            setIsGenerating(false);
        }
    };

    if (step === 2) {
        if (isGenerating) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '24px', minHeight: '60vh' }}>
                    <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Analyzing Layout Engine...</h2>
                        <p style={{ color: 'var(--muted-foreground)' }}>Compiling your {template} README for <strong>{selectedRepo.name}</strong>.</p>
                    </div>
                </div>
            )
        }

        return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => setStep(1)} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '6px 16px', height: 'auto', border: 'none', background: 'transparent' }}>
                    <ArrowLeft size={16} /> Back to Repository Selection
                </button>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Step 2: Choose Template</h1>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px', fontSize: '1.125rem' }}>
                    Select a layout style for <strong>{selectedRepo.name}</strong>.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {TEMPLATES.map(t => (
                        <div
                            key={t.id}
                            onClick={() => setTemplate(t.id)}
                            className={`glass-card`}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                border: template === t.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                transition: 'all 0.2s',
                                backgroundColor: template === t.id ? 'var(--muted)' : 'var(--card)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ padding: '8px', backgroundColor: 'var(--background)', borderRadius: '8px', color: template === t.id ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                                    <LayoutTemplate size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{t.name}</h3>
                            </div>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                                {t.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <button className="btn-primary" onClick={handleGenerate} style={{ padding: '0 32px', height: '3.5rem', fontSize: '1.125rem' }}>
                        Compile README <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Step 1: Select Repository</h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px', fontSize: '1.125rem' }}>Choose the GitHub repository you want to generate documentation for.</p>

            <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '500px' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                <input
                    type="text"
                    className="input-field"
                    placeholder="Search your repositories..."
                    style={{ paddingLeft: '48px', height: '3rem', fontSize: '1rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loadingRepos ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <div className="spinner" style={{ margin: '0 auto 24px', width: '40px', height: '40px' }}></div>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem' }}>Fetching source repositories from GitHub...</p>
                </div>
            ) : (
                <div className="repo-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {filteredRepos.map(repo => (
                        <div key={repo.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', transition: 'transform 0.2s', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}>
                                    <Github size={18} className="text-cyan" /> {repo.name}
                                </h3>
                                <span className="badge" style={{ backgroundColor: repo.private ? 'var(--background)' : 'var(--background)', color: repo.private ? 'var(--destructive)' : 'var(--success)', border: `1px solid ${repo.private ? 'var(--destructive)' : 'var(--success)'}` }}>
                                    {repo.private ? 'Private' : 'Public'}
                                </span>
                            </div>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', flexGrow: 1, marginBottom: '24px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {repo.description || 'No description provided.'}
                            </p>
                            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                                    {(repo.language || 'Mixed')}
                                </span>
                                <button onClick={() => handleSelectRepo(repo)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.875rem', height: 'auto' }}>
                                    Select <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredRepos.length === 0 && !loadingRepos && (
                        <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--muted-foreground)', backgroundColor: 'var(--card)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                            <Search size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--foreground)' }}>No repositories found</h3>
                            <p>Try adjusting your search query.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
