import NavbarPortal from '../../components/NavbarPortal';
import React, { useState } from 'react';
import { FileSearch, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import api from '../../lib/apiClient';

const TYPE_COLORS = { TODO: 'var(--accent)', FIXME: 'var(--danger)', HACK: 'var(--warning)', XXX: 'var(--warning)', BUG: 'var(--danger)' };

export default function TodoToIssue() {
    const { selectedRepo: repo } = useWorkspace();
    const [todos, setTodos] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = async () => {
        if (!repo) { setError('Select a repository first'); return; }
        setLoading(true); setError(null);
        try {
            const o = repo.owner?.login || repo.full_name?.split('/')[0];
            const res = await api.post(`/tools/${o}/${repo.name}/todo-scan`);
            setTodos(res.todos || []);
            setMeta({ scannedFiles: res.scannedFiles, totalFiles: res.totalFiles });
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const grouped = {};
    todos.forEach(t => { grouped[t.type] = (grouped[t.type] || 0) + 1; });

    return (
        <div className="tool-page">
            <NavbarPortal>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileSearch size={18} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h2 className="tool-page-title">TODO → Issue Converter</h2>
                        
                    </div>
                </div>
            </NavbarPortal>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button className="btn-primary" onClick={handleScan} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Scanning…</> : <><FileSearch size={16} /> Scan Repository</>}
                </button>
                {meta && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>
                        Scanned {meta.scannedFiles} / {meta.totalFiles} files · Found {todos.length} comments
                    </span>
                )}
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 16px', fontSize: '0.8125rem', color: '#f87171', marginBottom: 16 }}>{error}</div>}

            {/* Stats */}
            {todos.length > 0 && (
                <div className="stats-grid-4" style={{ marginBottom: 24 }}>
                    {Object.entries(grouped).map(([type, count]) => (
                        <div className="stat-card-vertical" key={type}>
                            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: TYPE_COLORS[type] || 'var(--text-tertiary)' }}>{type}</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            {todos.length > 0 && (
                <div className="panel">
                    <div className="panel-body" style={{ padding: 0 }}>
                        <table className="data-table">
                            <thead><tr><th>Type</th><th>File</th><th>Line</th><th>Comment</th></tr></thead>
                            <tbody>
                                {todos.map((t, i) => (
                                    <tr key={i}>
                                        <td><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 800, background: `${TYPE_COLORS[t.type]}20`, color: TYPE_COLORS[t.type] }}>{t.type}</span></td>
                                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>{t.file}</td>
                                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>:{t.line}</td>
                                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{t.text}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && todos.length === 0 && meta && (
                <div className="panel" style={{ textAlign: 'center', padding: 60 }}>
                    <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 16 }} />
                    <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Clean Codebase!</h3>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No TODO/FIXME comments found.</p>
                </div>
            )}
        </div>
    );
}
