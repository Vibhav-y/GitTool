import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, LogOut, Book, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Repos() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('github_token');
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchRepos = async () => {
            try {
                const res = await axios.post(`${API_BASE}/repos`, { token });
                setRepos(res.data.repos);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch repositories. Invalid token?');
                if (err.response?.status === 401 || err.response?.status === 500) {
                    localStorage.removeItem('github_token');
                    navigate('/auth');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, [navigate]);

    const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleLogout = () => {
        localStorage.removeItem('github_token');
        toast.success('Successfully logged out.');
        navigate('/auth');
    };

    if (loading) {
        return (
            <div className="layout-container main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
                <div className="spinner"></div>
                <p>Fetching your repositories...</p>
            </div>
        );
    }

    return (
        <div className="layout-container main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Your Repositories</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Select a repository to generate a professional README.</p>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    className="input-field"
                    placeholder="Search repositories..."
                    style={{ paddingLeft: '40px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredRepos.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No repositories found matching your search.</p>
            )}

            <div className="repo-grid">
                {filteredRepos.map(repo => (
                    <div key={repo.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div className="repo-header">
                            <h3 className="repo-title" style={{ margin: 0 }}>
                                <Book size={18} className="text-gradient" /> {repo.name}
                            </h3>
                            <span className="badge" style={{ backgroundColor: repo.private ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: repo.private ? '#ef4444' : '#10b981' }}>
                                {repo.private ? 'Private' : 'Public'}
                            </span>
                        </div>
                        <p className="repo-desc" style={{ flexGrow: 1 }}>{repo.description || 'No description provided.'}</p>
                        <div className="repo-footer">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {repo.language || 'Mixed / Unknown'}
                            </span>
                            <Link to={`/generate/${repo.owner.login}/${repo.name}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                Generate <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Repos;
