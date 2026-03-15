import NavbarPortal from '../../components/NavbarPortal';
import React, { useState, useEffect } from 'react';
import {
    GitBranch, GitMerge, Tag, CheckCircle, Loader2,
    AlertTriangle, Trash2, Shield, Clock
} from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import api from '../../lib/apiClient';

function timeAgo(date) {
    if (!date) return '—';
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

export default function BranchMergeUI() {
    const { selectedRepo: repo } = useWorkspace();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [threshold, setThreshold] = useState(30);
    const [selected, setSelected] = useState([]);
    const [pruning, setPruning] = useState(false);
    const [pruneResult, setPruneResult] = useState(null);

    const fetchBranches = async () => {
        if (!repo) return;
        setLoading(true);
        setError(null);
        setPruneResult(null);
        try {
            const owner = repo.owner?.login || repo.full_name?.split('/')[0];
            const res = await api.get(`/branches/${owner}/${repo.name}/stale?threshold=${threshold}`);
            setData(res);
            setSelected([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (repo) fetchBranches();
    }, [repo, threshold]);

    const toggleSelect = (name) => {
        setSelected(prev => prev.includes(name)
            ? prev.filter(n => n !== name)
            : [...prev, name]
        );
    };

    const selectAll = () => {
        if (!data?.branches) return;
        const safe = data.branches.filter(b => b.safe).map(b => b.name);
        setSelected(prev => prev.length === safe.length ? [] : safe);
    };

    const handlePrune = async () => {
        if (selected.length === 0 || !repo) return;
        setPruning(true);
        try {
            const owner = repo.owner?.login || repo.full_name?.split('/')[0];
            const res = await api.post(`/branches/${owner}/${repo.name}/prune`, { branches: selected });
            setPruneResult(res);
            setSelected([]);
            // Refresh
            fetchBranches();
        } catch (err) {
            setError(err.message);
        } finally {
            setPruning(false);
        }
    };

    return (
        <div className="tool-page">
            {/* Header */}
            <NavbarPortal>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <GitBranch size={18} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h2 className="tool-page-title">Branch & Release Management</h2>
                        <span className="hidden sm:inline text-border">|</span>
                        <p className="tool-page-desc">Analyze stale branches and clean up your repository.</p>
                    </div>
                </div>
            </NavbarPortal>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Stale threshold:</span>
                    <select
                        value={threshold}
                        onChange={e => setThreshold(Number(e.target.value))}
                        style={{
                            background: 'var(--bg-surface)', border: '1px solid var(--border)',
                            borderRadius: 8, padding: '6px 12px', color: 'var(--text-primary)',
                            fontSize: '0.8125rem',
                        }}
                    >
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                    </select>
                </div>
                {data && (
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.8125rem' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                            Total branches: <b style={{ color: 'var(--text-primary)' }}>{data.totalBranches}</b>
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                            Stale: <b style={{ color: 'var(--warning)' }}>{data.staleBranches}</b>
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                            Default: <b style={{ color: 'var(--accent)' }}>{data.defaultBranch}</b>
                        </span>
                    </div>
                )}
            </div>

            {/* Prune Result */}
            {pruneResult && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, fontSize: '0.875rem' }}>
                    <CheckCircle size={16} style={{ color: 'var(--success)', marginRight: 8 }} />
                    {pruneResult.message}
                </div>
            )}

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, fontSize: '0.875rem', color: '#f87171' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
                    <Loader2 size={32} className="text-accent" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : data?.branches?.length ? (
                <div className="panel">
                    <div className="panel-header" style={{ justifyContent: 'space-between' }}>
                        <h3 className="panel-title"><GitBranch size={16} /> Stale Branches ({data.staleBranches})</h3>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn-ghost-sm" onClick={selectAll}>
                                {selected.length === data.branches.filter(b => b.safe).length ? 'Deselect All' : 'Select Safe'}
                            </button>
                            <button
                                className="btn-danger"
                                disabled={selected.length === 0 || pruning}
                                onClick={handlePrune}
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                {pruning
                                    ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Pruning…</>
                                    : <><Trash2 size={14} /> Prune ({selected.length})</>
                                }
                            </button>
                        </div>
                    </div>
                    <div className="panel-body" style={{ padding: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 40 }}></th>
                                    <th>Branch</th>
                                    <th>Last Commit</th>
                                    <th>Age</th>
                                    <th>Merged</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.branches.map(b => (
                                    <tr key={b.name}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(b.name)}
                                                onChange={() => toggleSelect(b.name)}
                                                disabled={b.protected}
                                            />
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '0.8125rem' }}>
                                                {b.name}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {b.lastCommitMessage || '—'}
                                        </td>
                                        <td style={{ fontSize: '0.75rem' }}>
                                            <Clock size={12} style={{ marginRight: 4 }} />
                                            {timeAgo(b.lastCommitDate)}
                                        </td>
                                        <td>
                                            {b.merged
                                                ? <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}><CheckCircle size={14} /> Yes</span>
                                                : <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No</span>
                                            }
                                        </td>
                                        <td>
                                            {b.protected ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--accent)', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: 999 }}>
                                                    <Shield size={10} /> Protected
                                                </span>
                                            ) : b.safe ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 999 }}>
                                                    Safe to delete
                                                </span>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--warning)', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 999 }}>
                                                    <AlertTriangle size={10} /> Unmerged
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : data && data.staleBranches === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: 60 }}>
                    <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 16 }} />
                    <h3 style={{ fontWeight: 700, marginBottom: 8 }}>All Clean!</h3>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                        No stale branches found older than {threshold} days.
                    </p>
                </div>
            ) : (
                <div className="panel" style={{ textAlign: 'center', padding: 60 }}>
                    <GitBranch size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 16 }} />
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Select a repository to analyze branches</p>
                </div>
            )}
        </div>
    );
}
