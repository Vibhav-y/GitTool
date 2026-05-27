'use client';

import React from 'react';
import { GitBranch, GitMerge, RotateCcw, FileCode, Package } from 'lucide-react';

function DiffBlock({ before, after }: any) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="rounded-lg p-3 bg-red-500/5 border border-red-500/15">
        <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 block mb-1.5">Before</span>
        <pre className="text-[11px] font-mono leading-relaxed text-red-300/80 whitespace-pre">{before}</pre>
      </div>
      <div className="flex items-center justify-center text-muted-foreground/40 text-xs">â†“</div>
      <div className="rounded-lg p-3 bg-emerald-500/5 border border-emerald-500/15">
        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">After</span>
        <pre className="text-[11px] font-mono leading-relaxed text-emerald-300/80 whitespace-pre">{after}</pre>
      </div>
    </div>
  );
}

export default function CommandVisualization({ action, state }: any) {
  const supported = ['git branch', 'git merge', 'git rebase', 'git commit', 'git reset', 'git checkout'];
  if (!supported.includes(action)) return null;

  let asciiGraph = '';
  let diffData = null;
  let contextLabels = {};
  let Icon = GitBranch;

  if (action === 'git branch') {
    const bName = state.branchName || 'feature/new';
    const base = state.baseBranch || 'main';
    Icon = GitBranch;
    asciiGraph = `${base}  Aâ”€â”€â”€Bâ”€â”€â”€C
                  â•²
                   ${bName}  (new)`;
    contextLabels = { 'Base': base, 'New Branch': bName };
    diffData = {
      before: `HEAD â†’ ${base}\n  Aâ”€â”€â”€Bâ”€â”€â”€C`,
      after:  `HEAD â†’ ${base}\n  Aâ”€â”€â”€Bâ”€â”€â”€C\n            â•²\n             ${bName}`
    };
  } else if (action === 'git checkout') {
    const target = state.targetBranch || 'feature';
    Icon = GitBranch;
    asciiGraph = `main      Aâ”€â”€â”€Bâ”€â”€â”€C  (was here)\n\n${target}  Aâ”€â”€â”€Bâ”€â”€â”€Dâ”€â”€â”€E  â† HEAD now`;
    contextLabels = { 'Switching to': target };
    diffData = {
      before: `HEAD â†’ main`,
      after:  `HEAD â†’ ${target}`
    };
  } else if (action === 'git merge') {
    const target = state.targetBranch || 'feature';
    Icon = GitMerge;
    asciiGraph = `main    Aâ”€â”€â”€Bâ”€â”€â”€C â”€â”€â”€ M  â† merge commit\n             â•²         â•±\n${target}       Dâ”€â”€â”€Eâ”€â”€â”€F`;
    contextLabels = { 'Target': target, 'Strategy': state.mergeStrategy ? `--${state.mergeStrategy}` : 'default' };
    diffData = {
      before: `main:    Aâ”€â”€â”€Bâ”€â”€â”€C\n${target}: Dâ”€â”€â”€Eâ”€â”€â”€F`,
      after:  `main:    Aâ”€â”€â”€Bâ”€â”€â”€Câ”€â”€â”€M\n${target}: Dâ”€â”€â”€Eâ”€â”€â”€F â•±`
    };
  } else if (action === 'git rebase') {
    const target = state.targetBranch || 'main';
    Icon = GitBranch;
    asciiGraph = `Before:  main Aâ”€â”€â”€Bâ”€â”€â”€C\n               feature Dâ”€â”€â”€E\n\nAfter:   main Aâ”€â”€â”€Bâ”€â”€â”€C\n                        â•²\n               feature   D'â”€â”€â”€E'`;
    contextLabels = { 'Onto': target };
    diffData = {
      before: `main    Aâ”€â”€â”€Bâ”€â”€â”€C\nfeature Dâ”€â”€â”€E`,
      after:  `main    Aâ”€â”€â”€Bâ”€â”€â”€C\n                 â•²\nfeature           D'â”€â”€â”€E'`
    };
  } else if (action === 'git reset') {
    const mode = state.resetMode || '--mixed';
    Icon = RotateCcw;
    const modeDesc = mode === '--hard' ? 'discarded entirely' : mode === '--soft' ? 'back to staging' : 'back to unstaged';
    asciiGraph = `Aâ”€â”€â”€Bâ”€â”€â”€Câ”€â”€â”€D  â† HEAD\n\nAfter ${mode}:\nAâ”€â”€â”€Bâ”€â”€â”€C  â† HEAD\n       [D: ${modeDesc}]`;
    contextLabels = { 'Mode': mode, 'Commit': state.targetCommit || 'HEAD~1' };
    diffData = {
      before: `Aâ”€â”€â”€Bâ”€â”€â”€Câ”€â”€â”€D  (HEAD)`,
      after:  `Aâ”€â”€â”€Bâ”€â”€â”€C  (HEAD)\n  [D: ${modeDesc}]`
    };
  } else if (action === 'git commit') {
    Icon = FileCode;
    asciiGraph = `Working Tree â”€â”€stageâ”€â”€â–¶ Index â”€â”€commitâ”€â”€â–¶ HEAD\n[modified]              [staged]          [history]`;
    contextLabels = { 'Flow': 'add â†’ commit' };
  }

  return (
    <div className="rounded-2xl border border-border/50 p-4 flex flex-col gap-3" style={{ background: 'var(--card)' }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={12} className="text-primary" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground/70">
          Tree Visualization
        </span>
      </div>

      {/* Context Labels */}
      {Object.keys(contextLabels).length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {Object.entries(contextLabels).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 text-[10px]">
              <span className="text-muted-foreground/50">{k}:</span>
              <code className="text-primary font-mono font-semibold">{v as React.ReactNode}</code>
            </div>
          ))}
        </div>
      )}

      {/* ASCII Graph */}
      <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-primary/70 bg-muted/20 rounded-xl px-3 py-2.5">
        {asciiGraph}
      </pre>

      {/* Diff Preview */}
      {diffData && <DiffBlock before={diffData.before} after={diffData.after} />}
    </div>
  );
}

