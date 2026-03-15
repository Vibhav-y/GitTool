import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Code, Globe, Star, Clock, Sparkles, CheckCircle,
    AlertTriangle, ShieldAlert, Loader2, GitBranch, Zap,
    RefreshCw
} from 'lucide-react';
import { useRepos, useTokenBalance } from '../hooks/useQueryHooks';
import { useWorkspace } from '../contexts/WorkspaceContext';
import GitBranchGraph from '../components/GitBranchGraph';

// Language color map (common GitHub colors)
const LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
    'C++': '#f34b7d', C: '#555555', HTML: '#e34c26', CSS: '#563d7c',
    Shell: '#89e051', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
};

function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { selectedRepo } = useWorkspace();

    const { data: repos = [], isLoading: loadingRepos, error: repoErr } = useRepos();
    const { data: balance = null } = useTokenBalance();

    const loading = loadingRepos;
    const error = repoErr?.message || null;

    // Derive dashboard data from real repos
    const pinnedRepos = repos.slice(0, 4);
    const recentlyUpdated = repos.slice(0, 5);
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const publicCount = repos.filter(r => !r.private).length;
    const privateCount = repos.filter(r => r.private).length;

    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={48} className="text-accent" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Loading your workspace…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <AlertTriangle size={48} style={{ color: 'var(--danger)', marginBottom: 16 }} />
                    <p style={{ fontWeight: 700, marginBottom: 8 }}>Failed to load dashboard</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: 16 }}>{error}</p>
                    <button className="btn-primary" onClick={() => window.location.reload()}>
                        <RefreshCw size={14} /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-7xl flex-col gap-8 mx-auto pb-12">
            {/* ── TOP: AI Quick Actions ────────────────────── */}
            <div className="min-w-0">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-primary" />
                        <h2 className="text-lg font-bold m-0">AI Quick Actions</h2>
                    </div>
                    {balance && (
                        <div className="flex items-center gap-2 text-[13px]">
                            <Zap size={14} className="text-primary" />
                            <span className="text-muted-foreground">Credits:</span>
                            <span className="font-bold">{balance.balance?.toLocaleString() ?? '—'}</span>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button className="flex cursor-pointer items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10" onClick={() => navigate('/tools/smart-commits')}>
                        <Sparkles size={24} className="text-primary" />
                        <div>
                            <h3 className="m-0 mb-0.5 text-sm font-bold">Generate Commit</h3>
                            <p className="m-0 text-[11px] text-muted-foreground">Summarize changes automatically</p>
                        </div>
                    </button>
                    <button className="flex cursor-pointer items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10" onClick={() => navigate('/tools/release-notes')}>
                        <Code size={24} className="text-primary" />
                        <div>
                            <h3 className="m-0 mb-0.5 text-sm font-bold">Release Notes</h3>
                            <p className="m-0 text-[11px] text-muted-foreground">AI-generated changelog</p>
                        </div>
                    </button>
                    <button className="flex cursor-pointer items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10" onClick={() => navigate('/tools/workflow-builder')}>
                        <Globe size={24} className="text-primary" />
                        <div>
                            <h3 className="m-0 mb-0.5 text-sm font-bold">Workflow Builder</h3>
                            <p className="m-0 text-[11px] text-muted-foreground">Generate CI/CD pipelines</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* ── Widget Grid (Stats) ──────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Repo Stats */}
                <div className="flex flex-col items-center justify-center rounded-xl border bg-card/40 p-5 text-center">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Total Repos</p>
                    <p className="font-mono text-4xl font-bold">{repos.length}</p>
                    <div className="mt-2 flex gap-4 text-xs">
                        <span className="text-emerald-500">● {publicCount} public</span>
                        <span className="text-amber-500">● {privateCount} private</span>
                    </div>
                </div>

                {/* Stars */}
                <div className="flex flex-col items-center justify-center rounded-xl border bg-card/40 p-5 text-center">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Total Stars</p>
                    <div className="flex items-center gap-2">
                        <Star size={28} className="text-amber-500" />
                        <span className="font-mono text-3xl font-bold">{totalStars.toLocaleString()}</span>
                    </div>
                </div>

                {/* AI Credits */}
                <div className="rounded-xl border bg-card/40 p-5 flex flex-col justify-center">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block text-center sm:text-left">AI Credits</p>
                    {balance ? (
                        <>
                            <div className="mb-2 flex items-baseline gap-2 justify-center sm:justify-start">
                                <span className="font-mono text-3xl font-bold">{balance.balance?.toLocaleString() ?? 0}</span>
                                <span className="text-xs text-muted-foreground">remaining</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mt-2">
                                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (balance.balance / 10000) * 100)}%` }}></div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center sm:text-left">Connect to view</p>
                    )}
                </div>

                {/* Quick Nav */}
                <div className="rounded-xl border bg-card/40 p-5 flex flex-col justify-center text-center sm:text-left">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quick Actions</p>
                    <div className="mt-2 flex flex-col gap-2 relative">
                        <button className="text-left text-xs font-medium text-primary hover:underline" onClick={() => navigate('/tools/branch-merge')}>→ Branch Management</button>
                        <button className="text-left text-xs font-medium text-primary hover:underline" onClick={() => navigate('/tools/security')}>→ Security Dashboard</button>
                        <button className="text-left text-xs font-medium text-primary hover:underline" onClick={() => navigate('/tools/dead-code')}>→ Dead Code Detector</button>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM: Repos + Recent Activity + Git Graph ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pinned Repositories */}
                <div className="lg:col-span-2 min-w-0">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold m-0">Your Repositories</h2>
                        <span className="text-xs text-muted-foreground">{repos.length} total</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pinnedRepos.map(repo => {
                            const langColor = LANG_COLORS[repo.language] || 'var(--text-tertiary)';
                            return (
                                <div key={repo.id} className="group cursor-pointer rounded-xl border bg-card/40 p-4 transition-colors hover:border-primary/50">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-md" style={{
                                            background: repo.private ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                                            color: repo.private ? '#F59E0B' : '#10B981'
                                        }}>
                                            {repo.private ? <Globe size={20} /> : <Code size={20} />}
                                        </div>
                                        <span className="rounded-full px-2 py-0.5 font-mono text-[10px]" style={{
                                            color: repo.private ? '#F59E0B' : '#10B981',
                                            background: repo.private ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                                            border: `1px solid ${repo.private ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`
                                        }}>
                                            {repo.private ? 'Private' : 'Public'}
                                        </span>
                                    </div>
                                    <h3 className="mb-1 text-sm font-bold transition-colors group-hover:text-primary">{repo.name}</h3>
                                    <p className="mb-4 truncate text-xs text-muted-foreground">{repo.description || 'No description'}</p>
                                    <div className="flex items-center gap-4">
                                        {repo.language && (
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                <span className="h-2 w-2 rounded-full" style={{ background: langColor }}></span>
                                                {repo.language}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                            <Star size={12} /> {repo.stargazers_count}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Recent Activity & Git Branches */}
                <div className="min-w-0 flex flex-col gap-6">
                    {/* Recent Activity */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold m-0 text-white/90">Recent Activity</h2>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f171e]/50 backdrop-blur-md">
                            {recentlyUpdated.map((repo) => (
                                <div key={repo.id} className="flex cursor-pointer items-start gap-3 border-b border-white/5 p-3 transition-colors hover:bg-white/5 last:border-0">
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                                        <GitBranch size={14} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="m-0 text-xs text-white/80">
                                            <b className="font-semibold">{repo.name}</b> updated on <span className="font-mono text-white/50">{repo.default_branch}</span>
                                        </p>
                                        <p className="m-0 mt-1 text-[10px] text-white/40">{timeAgo(repo.updated_at)}</p>
                                    </div>
                                </div>
                            ))}
                            {recentlyUpdated.length === 0 && (
                                <p className="p-4 text-sm text-white/50 bg-[#0f171e]/50">No recent activity</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Git Branches Widget */}
                    <div className="flex-1 h-full min-h-[350px]">
                        <GitBranchGraph repo={selectedRepo} />
                    </div>
                </div>
            </div>
        </div>
    );
}
