import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

// X positions in SVG space for H2 vs H3 nodes
const X_H2 = 0;
const X_H3 = 14;

/**
 * Build an SVG path that traces down the TOC, angling right for H3 indents
 * and back left when returning to H2.
 */
function generateTocPath(headings, positions) {
  if (headings.length === 0) return '';

  let pathD = '';
  let prevX = X_H2;
  let prevY = 0;
  let isFirstPoint = true;

  headings.forEach((heading) => {
    const pos = positions.get(heading.id);
    if (!pos) return;

    const x = heading.level === 2 ? X_H2 : X_H3;
    const y = pos.top;

    if (isFirstPoint) {
      pathD = `M ${x} ${y}`;
      isFirstPoint = false;
    } else {
      if (x === prevX) {
        // Same indent level — straight vertical line
        pathD += ` L ${x} ${y}`;
      } else if (x > prevX) {
        // Indenting (H2 → H3): go straight 30% of the way, then angle right
        const midY = prevY + (y - prevY) * 0.3;
        pathD += ` L ${prevX} ${midY} L ${x} ${y}`;
      } else {
        // Outdenting (H3 → H2): angle left at 70% down
        const midY = prevY + (y - prevY) * 0.7;
        pathD += ` L ${x} ${midY} L ${x} ${y}`;
      }
    }

    prevX = x;
    prevY = y;
  });

  return pathD;
}

export default function TableOfContents({ headings }) {
  // Initialize to first heading so the dot is visible immediately
  const [activeId, setActiveId] = useState(() => headings?.[0]?.id ?? '');
  const [isMoving, setIsMoving] = useState(false);
  const [pathData, setPathData] = useState('');
  const [dotPos, setDotPos] = useState(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);

  // ── Active heading tracking via scroll position ─────────────────────────────
  useEffect(() => {
    if (!headings || headings.length === 0) return;

    // Try frontmatter IDs first, fall back to querying all h2/h3 in the article
    let els = headings.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) {
      els = Array.from(document.querySelectorAll('h2[id], h3[id]'));
    }

    if (els.length > 0 && !activeId) setActiveId(els[0].id);

    const onScroll = () => {
      const y = window.scrollY + 100;
      let current = els[0]?.id ?? '';
      for (const el of els) {
        if (el.offsetTop <= y) current = el.id;
        else break;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  // ── SVG path calculation from live DOM positions ─────────────────────────────
  const calculatePath = useCallback(() => {
    if (!contentRef.current || !headings?.length) return;

    const containerRect = contentRef.current.getBoundingClientRect();
    const positions = new Map();

    headings.forEach((h) => {
      let link = contentRef.current.querySelector(`a[href="#${h.id}"]`);
      if (!link) {
        link = Array.from(contentRef.current.querySelectorAll('a[data-level]')).find(
          (a) => a.textContent === h.text
        );
      }

      if (link) {
        const r = link.getBoundingClientRect();
        positions.set(h.id, {
          top: r.top - containerRect.top + r.height / 2,
          level: h.level,
        });
      }
    });

    setPathData(generateTocPath(headings, positions));
  }, [headings]);

  // Run after paint so DOM is laid out
  useLayoutEffect(() => {
    const t = setTimeout(calculatePath, 50);
    return () => clearTimeout(t);
  }, [calculatePath]);

  useEffect(() => {
    window.addEventListener('resize', calculatePath);
    return () => window.removeEventListener('resize', calculatePath);
  }, [calculatePath]);

  // ── Dot indicator positioning ────────────────────────────────────────────────
  const updateDot = useCallback(() => {
    if (!activeId || !navRef.current || !contentRef.current) return;

    let link = navRef.current.querySelector(`a[href="#${activeId}"]`);
    if (!link) {
      const headingText = headings.find((h) => h.id === activeId)?.text;
      if (headingText) {
         link = Array.from(navRef.current.querySelectorAll('a[data-level]')).find(
           (a) => a.textContent === headingText
         );
      }
    }
    if (!link) return;

    const cr = contentRef.current.getBoundingClientRect();
    const lr = link.getBoundingClientRect();

    const top = lr.top - cr.top + lr.height / 2;
    const left = parseInt(link.dataset.level, 10) > 2 ? 11 : -3;

    setDotPos({ top, left });
  }, [activeId, headings]);

  useLayoutEffect(() => {
    const t = setTimeout(updateDot, 60);
    return () => clearTimeout(t);
  }, [updateDot]);

  useEffect(() => {
    if (!activeId) return;
    setIsMoving(true);
    const t = setTimeout(() => setIsMoving(false), 600);
    return () => clearTimeout(t);
  }, [activeId]);

  // ── Smooth scroll on link click ─────────────────────────────────────────────
  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', `#${id}`);
  };

  if (!headings || headings.length === 0) return null;

  return (
    <aside className="xl:flex xl:flex-col flex-1">
      <div className="sticky top-24 w-full">
        {/* Label */}
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/50">
          Table of Contents
        </p>

        <nav ref={navRef} aria-label="Table of contents">
          <div ref={contentRef} className="relative">
            {/* SVG line tracing the TOC structure — positioned so x=0 aligns
                with the H2 dot center (left: -3px) */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-0"
              style={{ left: '-3px', width: '20px', height: '100%', overflow: 'visible' }}
            >
              {pathData && (
                <path
                  d={pathData}
                  fill="none"
                  className="stroke-border"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {/* Animated dot indicator */}
            {dotPos && (
              <motion.div
                aria-hidden="true"
                animate={{
                  top: dotPos.top,
                  left: dotPos.left,
                  boxShadow: isMoving
                    ? '0 0 0 5px var(--color-border)'
                    : '0 0 6px 2px var(--color-border)',
                }}
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  mass: 1,
                  boxShadow: { duration: 0.2 }
                }}
                className="absolute z-10 w-2 h-2 rounded-full pointer-events-none bg-primary"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            )}

            <ul className="m-0 list-none p-0">
              {headings.map(({ id, text, level }) => {
                const isActive = activeId === id;
                const indented = level > 2;

                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      data-toc-link
                      data-level={level}
                      onClick={(e) => handleClick(e, id)}
                      className={[
                        'block py-1.5 text-[13px] leading-snug no-underline transition-colors duration-150',
                        indented ? 'pl-8' : 'pl-4',
                        isActive
                          ? 'font-semibold text-primary'
                          : indented
                          ? 'text-muted-foreground/50 hover:text-muted-foreground'
                          : 'text-muted-foreground/80 hover:text-foreground',
                      ].join(' ')}
                    >
                      {text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
