import React from 'react';
import { GitBranch, MoreHorizontal, Loader2, AlertCircle } from 'lucide-react';
import { useBranches } from '../hooks/useQueryHooks';

/* ── layout constants ────────────────────────────────── */
const ROW_H    = 68;     // vertical gap between rows
const TRUNK_X  = 20;     // main trunk x
const FEAT_X   = 40;     // feature-branch dot x
const DOT_R    = 5;
const LABEL_L  = 56;     // left offset for text labels

function isMainBranch(name) {
    return /^(main|master)$/i.test(name);
}

/*
 * Design rationale
 * ────────────────
 *  ●──── master         [Merged]    cyan dot ON trunk
 *  │
 *  ├──●  Feature/Auth   [Active]    trunk junction + short S-curve → amber dot
 *  │
 *  ├──●  hotfix/fix     [Active]    same
 *  │
 *  The trunk is a CONTINUOUS vertical line from top to bottom.
 *  Main branches have cyan dots directly on the trunk.
 *  Feature branches have a small junction on the trunk + a short
 *  horizontal bezier curve going right to an amber dot.
 */

export default function GitBranchesWidget({ repo }) {
    const { data: branches = [], isLoading, error } = useBranches(repo);

    const sorted = [...branches]
        .filter(Boolean)
        .sort((a, b) => {
            const aM = isMainBranch(a.name);
            const bM = isMainBranch(b.name);
            if (aM && !bM) return -1;
            if (!aM && bM) return 1;
            return a.name.localeCompare(b.name);
        })
        .slice(0, 6);

    const nodes = sorted.map((b, i) => ({
        ...b,
        isMain: isMainBranch(b.name),
        y: 14 + i * ROW_H,
        idx: i,
    }));

    const svgH = nodes.length * ROW_H + 8;

    return (
        <div className="relative flex flex-col rounded-2xl border border-white/10
                        bg-[#0c1319]/90 backdrop-blur-md overflow-hidden h-full
                        min-h-[350px] shadow-[0_8px_30px_rgb(0,0,0,0.25)]">

            {/* ── Header ─────────────────────────── */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2 z-10">
                <div className="flex items-center gap-2 font-semibold text-white/90">
                    <GitBranch size={18} className="text-cyan-400/80" />
                    <span>Git Branches</span>
                    {repo && (
                        <span className="text-[11px] font-normal text-white/30 ml-1">
                            {repo.name}
                        </span>
                    )}
                </div>
                <button className="text-white/40 hover:text-white/80 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* ── Body ───────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 pb-14 pt-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-white/50 text-sm">
                        <Loader2 className="animate-spin mr-2" size={18} /> Loading…
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-white/50 text-sm">
                        <AlertCircle className="mr-2" size={18} /> Failed to load
                    </div>
                ) : nodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-white/40 text-sm">
                        No branches found
                    </div>
                ) : (
                    <div className="relative" style={{ height: svgH }}>

                        {/* ── SVG timeline ────────────────── */}
                        <svg
                            className="absolute inset-0 pointer-events-none"
                            width={LABEL_L}
                            height={svgH}
                            fill="none"
                        >
                            <defs>
                                <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%"   stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                                </linearGradient>
                                <filter id="gl">
                                    <feGaussianBlur stdDeviation="3.5" result="b" />
                                    <feMerge>
                                        <feMergeNode in="b" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* ① Continuous trunk line */}
                            <line
                                x1={TRUNK_X} y1={nodes[0].y}
                                x2={TRUNK_X} y2={nodes[nodes.length - 1].y + 12}
                                stroke="url(#tg)" strokeWidth="2.5"
                                strokeLinecap="round"
                            />

                            {/* ② Feature-branch curves (short horizontal S-curves) */}
                            {nodes.map((n, i) => {
                                if (n.isMain) return null;
                                /*
                                 *  Shape: from trunk(TRUNK_X, y) → feature dot(FEAT_X, y)
                                 *  A short curve that goes mostly horizontal:
                                 *
                                 *  ├──●
                                 *
                                 *  We start slightly above on the trunk and end at the dot.
                                 */
                                const startY = n.y - 14;
                                return (
                                    <path
                                        key={`c${i}`}
                                        d={`M ${TRUNK_X} ${startY}
                                            C ${TRUNK_X}     ${startY + 10},
                                              ${TRUNK_X + 6} ${n.y},
                                              ${FEAT_X}      ${n.y}`}
                                        stroke="#f59e0b"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        opacity="0.65"
                                    />
                                );
                            })}

                            {/* ③ Node dots */}
                            {nodes.map((n, i) => {
                                const cx = n.isMain ? TRUNK_X : FEAT_X;
                                const color = n.isMain ? '#06b6d4' : '#f59e0b';
                                const isFirst = i === 0;

                                return (
                                    <g key={`d${i}`}>
                                        {/* First-node glow */}
                                        {isFirst && (
                                            <>
                                                <circle cx={cx} cy={n.y} r={12}
                                                    fill="#06b6d4" opacity="0.2" filter="url(#gl)" />
                                                <circle cx={cx} cy={n.y} r={DOT_R + 2.5}
                                                    fill="none" stroke="#06b6d4"
                                                    strokeWidth="1.2" opacity="0.45" />
                                            </>
                                        )}

                                        {/* Dot */}
                                        <circle
                                            cx={cx} cy={n.y} r={DOT_R}
                                            fill={color}
                                            stroke="#0c1319" strokeWidth="2.5"
                                        />

                                        {/* Trunk junction mark for feature branches */}
                                        {!n.isMain && (
                                            <circle
                                                cx={TRUNK_X} cy={n.y - 14}
                                                r={2.5}
                                                fill="#06b6d4" opacity="0.4"
                                            />
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        {/* ── Text labels ─────────────────── */}
                        {nodes.map((n) => (
                            <div
                                key={n.name}
                                className="absolute flex items-center justify-between"
                                style={{
                                    top: n.y - 16,
                                    left: LABEL_L,
                                    right: 0,
                                }}
                            >
                                <div className="flex flex-col min-w-0">
                                    <span className={`font-semibold text-[13px] truncate leading-tight
                                        ${n.isMain ? 'text-white' : 'text-white/80'}`}>
                                        {n.name}
                                    </span>
                                    <span className="text-[10px] text-white/30 font-mono truncate mt-1">
                                        #{n.commit?.sha?.substring(0, 7) ?? '-------'}
                                    </span>
                                </div>

                                <span className={`shrink-0 ml-2 text-[10px] font-bold px-2.5 py-0.5
                                    rounded-full border ${
                                    n.isMain
                                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                    {n.isMain ? 'Merged' : 'Active'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-16
                            bg-gradient-to-t from-[#0c1319] to-transparent
                            pointer-events-none z-20" />
        </div>
    );
}
