import React, { useState } from 'react';
import { X, GitPullRequest, Loader2, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../lib/apiClient';

export default function CreatePRModal({ owner, repo, head, base, stats, onClose, onCreated }) {
    const [title, setTitle] = useState(`${head} → ${base}`);
    const [body, setBody] = useState('');
    const [creating, setCreating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleCreate = async () => {
        if (!title.trim()) return;
        setCreating(true);
        setError(null);
        try {
            const res = await api.post(`/branches/${owner}/${repo}/pulls`, {
                title: title.trim(),
                body: body.trim(),
                head,
                base,
            });
            setResult(res);
            onCreated?.(res);
        } catch (err) {
            setError(err.message || 'Failed to create PR');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
                style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2">
                        <GitPullRequest size={18} className="text-primary" />
                        <h2 className="text-[15px] font-bold">Create Pull Request</h2>
                    </div>
                    <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-muted-foreground transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {result ? (
                    /* ── Success ── */
                    <div className="px-5 py-8 text-center">
                        <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
                        <h3 className="text-base font-bold mb-1">PR #{result.number} Created</h3>
                        <p className="text-sm text-muted-foreground mb-4">{result.title}</p>
                        <a href={result.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                            <ExternalLink size={14} /> View on GitHub
                        </a>
                    </div>
                ) : (
                    /* ── Form ── */
                    <div className="px-5 py-4 flex flex-col gap-4">
                        {/* Branch Info */}
                        <div className="flex items-center gap-3 text-[13px]">
                            <span className="font-mono px-2 py-1 rounded-md bg-primary/10 text-primary text-[12px] font-semibold">{head}</span>
                            <span className="text-muted-foreground/40">→</span>
                            <span className="font-mono px-2 py-1 rounded-md bg-white/[0.05] text-foreground/70 text-[12px] font-semibold">{base}</span>
                        </div>

                        {/* Stats summary */}
                        {stats && (
                            <div className="flex gap-4 text-[12px] text-muted-foreground">
                                <span>{stats.totalCommits} commits</span>
                                <span>{stats.totalFiles} files</span>
                                <span className="text-emerald-400">+{stats.totalAdditions}</span>
                                <span className="text-red-400">-{stats.totalDeletions}</span>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full h-9 px-3 rounded-lg text-[13px] bg-white/[0.03] border border-white/[0.08] outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 text-foreground"
                                placeholder="PR title…"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
                            <textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 rounded-lg text-[13px] bg-white/[0.03] border border-white/[0.08] outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 text-foreground resize-none"
                                placeholder="Describe this pull request…"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-red-400"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                <AlertTriangle size={13} /> {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-1">
                            <button onClick={onClose}
                                className="px-4 py-2 text-[12px] font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleCreate} disabled={creating || !title.trim()}
                                className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center gap-1.5">
                                {creating
                                    ? <><Loader2 size={13} className="animate-spin" /> Creating…</>
                                    : <><GitPullRequest size={13} /> Create Pull Request</>
                                }
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
