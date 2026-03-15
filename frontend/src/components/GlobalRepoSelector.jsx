import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Loader2, GitBranch, FolderOpen } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useRepos, useBranches } from '../hooks/useQueryHooks';

export default function GlobalRepoSelector() {
    const { selectedRepo, setSelectedRepo, selectedBranch, setSelectedBranch } = useWorkspace();

    // ── Cached data via React Query ──
    const { data: repos = [], isLoading: loadingRepos, error: repoErr } = useRepos();
    const { data: branches = [], isLoading: loadingBranches, error: branchErr } = useBranches(selectedRepo);

    const repoError = repoErr?.message || null;
    const branchError = branchErr?.message || null;

    // Dropdown UI state
    const [openRepoDropdown, setOpenRepoDropdown] = useState(false);
    const [repoSearch, setRepoSearch] = useState('');
    const [openBranchDropdown, setOpenBranchDropdown] = useState(false);
    const [branchSearch, setBranchSearch] = useState('');
    const repoRef = useRef(null);
    const branchRef = useRef(null);

    // Auto-select first repo if nothing selected
    useEffect(() => {
        if (!selectedRepo && repos.length > 0) {
            setSelectedRepo(repos[0]);
        }
    }, [repos, selectedRepo, setSelectedRepo]);

    // Auto-fix branch if not in new repo's branch list
    useEffect(() => {
        if (branches.length === 0) return;
        const branchExists = branches.find(b => b.name === selectedBranch);
        if (!branchExists) {
            const fallback = selectedRepo?.default_branch
                || (branches.length > 0 ? branches[0].name : 'main');
            setSelectedBranch(fallback);
        }
    }, [branches, selectedBranch, selectedRepo, setSelectedBranch]);

    // Outside click handlers
    useEffect(() => {
        const handler = (e) => {
            if (repoRef.current && !repoRef.current.contains(e.target)) setOpenRepoDropdown(false);
            if (branchRef.current && !branchRef.current.contains(e.target)) setOpenBranchDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filteredRepos = repos.filter(r =>
        r.full_name.toLowerCase().includes(repoSearch.toLowerCase())
    );

    const filteredBranches = branches.filter(b =>
        b.name.toLowerCase().includes(branchSearch.toLowerCase())
    );

    const repoName = selectedRepo?.full_name || selectedRepo?.name || 'Select repository…';

    return (
        <div className="flex items-center gap-2">
            {/* --- REPO SELECTOR --- */}
            <div ref={repoRef} className="relative w-[260px]">
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenRepoDropdown(!openRepoDropdown); }}
                    className={`flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-[13px] font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground ${selectedRepo ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <FolderOpen size={14} className="shrink-0 text-primary" />
                        <span className="truncate">
                            {loadingRepos ? <Loader2 size={12} className="animate-spin" /> : repoName}
                        </span>
                    </div>
                    <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 opacity-50 ${openRepoDropdown ? 'rotate-180' : ''}`} />
                </button>

                {openRepoDropdown && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 flex flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md max-h-80">
                        <div className="border-b p-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" />
                                <input
                                    autoFocus
                                    value={repoSearch}
                                    onChange={(e) => setRepoSearch(e.target.value)}
                                    placeholder="Search repositories…"
                                    className="flex h-8 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground pl-8 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto w-full p-1 max-h-64">
                            {repoError && (
                                <div className="m-1.5 rounded-md bg-destructive/10 p-3 text-center text-xs text-destructive">
                                    {repoError}
                                </div>
                            )}
                            {!repoError && filteredRepos.length === 0 && (
                                <p className="p-3 text-center text-xs text-muted-foreground">
                                    No repositories found
                                </p>
                            )}
                            {filteredRepos.map(r => (
                                <button
                                    type="button"
                                    key={r.id}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedRepo(r); setOpenRepoDropdown(false); setRepoSearch(''); }}
                                    className={`relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${selectedRepo?.id === r.id ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
                                >
                                    <span className="truncate font-medium">{r.full_name}</span>
                                    <span className={`shrink-0 ml-2 text-[10px] ${r.private ? 'text-destructive/80' : 'text-emerald-500/80'}`}>
                                        {r.private ? 'Private' : 'Public'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <span className="text-muted-foreground/50">/</span>

            {/* --- BRANCH SELECTOR --- */}
            <div ref={branchRef} className="relative w-[140px]">
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (selectedRepo) setOpenBranchDropdown(!openBranchDropdown); }}
                    disabled={!selectedRepo}
                    className={`flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-[13px] font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${selectedBranch ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <GitBranch size={14} className="shrink-0 text-muted-foreground opacity-70" />
                        <span className="truncate">
                            {loadingBranches ? <Loader2 size={12} className="animate-spin" /> : (selectedBranch || 'Branch…')}
                        </span>
                    </div>
                    <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 opacity-50 ${openBranchDropdown ? 'rotate-180' : ''}`} />
                </button>

                {openBranchDropdown && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 flex flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md max-h-80">
                        <div className="border-b p-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" />
                                <input
                                    autoFocus
                                    value={branchSearch}
                                    onChange={(e) => setBranchSearch(e.target.value)}
                                    placeholder="Search branches…"
                                    className="flex h-8 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground pl-8 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto w-full p-1 max-h-64">
                            {branchError && (
                                <div className="m-1.5 rounded-md bg-destructive/10 p-3 text-center text-xs text-destructive">
                                    {branchError}
                                </div>
                            )}
                            {!branchError && filteredBranches.length === 0 && (
                                <p className="p-3 text-center text-xs text-muted-foreground">
                                    No branches found
                                </p>
                            )}
                            {filteredBranches.map(b => (
                                <button
                                    type="button"
                                    key={b.name}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedBranch(b.name); setOpenBranchDropdown(false); setBranchSearch(''); }}
                                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${selectedBranch === b.name ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
                                >
                                    <span className="truncate font-medium">{b.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
