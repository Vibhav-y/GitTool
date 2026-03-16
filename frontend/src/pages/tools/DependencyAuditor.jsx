import NavbarPortal from '../../components/NavbarPortal';
import React, { useState } from 'react';
import { Package, Loader2, AlertTriangle } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useToolData } from '../../hooks/useQueryHooks';

export default function DependencyAuditor() {
    const { selectedRepo: repo } = useWorkspace();
    const { data: rawData, isLoading: loading, error: fetchErr } = useToolData(repo, 'dependencies');
    const deps = rawData?.dependencies || [];
    const devDeps = rawData?.devDependencies || [];
    const total = rawData?.total || 0;
    const error = rawData?.message || fetchErr?.message || null;
    const [tab, setTab] = useState('production');

    const shown = tab === 'production' ? deps : devDeps;

    return (
        <div className="tool-page">
            <NavbarPortal>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package size={18} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h2 className="tool-page-title">Dependency Auditor</h2>
                        
                    </div>
                </div>
            </NavbarPortal>

            {/* Stats */}
            <div className="stats-grid-4 mb-6">
                <div className="stat-card-vertical">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
                    <span className="text-2xl font-black">{total}</span>
                </div>
                <div className="stat-card-vertical">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Production</span>
                    <span className="text-2xl font-black">{deps.length}</span>
                </div>
                <div className="stat-card-vertical">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500">Dev</span>
                    <span className="text-2xl font-black">{devDeps.length}</span>
                </div>
            </div>

            {error && <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-[13px] text-destructive">{error}</div>}

            {/* Tabs */}
            <div className="toggle-group mb-6">
                <button className={`toggle-btn ${tab === 'production' ? 'active' : ''}`} onClick={() => setTab('production')}>Production ({deps.length})</button>
                <button className={`toggle-btn ${tab === 'development' ? 'active' : ''}`} onClick={() => setTab('development')}>Development ({devDeps.length})</button>
            </div>

            {loading ? (
                <div className="flex justify-center p-16">
                    <Loader2 size={32} className="text-primary animate-spin" />
                </div>
            ) : (
                <div className="panel">
                    <div className="panel-body p-0">
                        <table className="data-table">
                            <thead><tr><th>Package</th><th>Version</th><th>Type</th></tr></thead>
                            <tbody>
                                {shown.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center p-10 text-muted-foreground">
                                        {repo ? 'No dependencies found.' : 'Select a repository.'}
                                    </td></tr>
                                ) : shown.map(d => (
                                    <tr key={d.name}>
                                        <td className="font-mono font-medium text-[13px]">
                                            <Package size={14} className="inline mr-2 text-primary" />
                                            {d.name}
                                        </td>
                                        <td><code className="rounded border bg-muted/50 px-2 py-0.5 text-xs">{d.currentVersion}</code></td>
                                        <td className={`text-xs ${d.type === 'production' ? 'text-primary' : 'text-amber-500'}`}>{d.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
