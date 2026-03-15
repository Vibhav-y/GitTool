import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowRight, Github, Zap, Eye, Terminal, GitBranch, GitMerge,
    Bot, BookOpen, Shield, BarChart3, Keyboard, Lock, FileCode2,
    Cpu, Gauge, Search, Bell, Layers, FileText, Brain, Code2,
    LayoutDashboard, Palette, TrendingUp, TrendingDown, AlertTriangle,
    Layout, CheckCircle2, ChevronDown, Quote, Star, Sparkles, Play,
    Hexagon, Flame, Box, CircleDot, Orbit
} from 'lucide-react';
import heroMockup from '../assets/hero-mockup.png';

/* ── Data ──────────────────────────────────────────────────── */

const FAQS = [
    { question: "How does GitTalk integrate with my current workflow?", answer: "GitTalk seamlessly connects with your existing GitHub, GitLab, or Bitbucket repositories via OAuth. No complex setup or migration required. Simply sign in and your repositories are instantly analyzed." },
    { question: "Is my repository data secure?", answer: "Absolutely. We employ bank-grade encryption at rest and in transit. We only request minimum necessary permissions to generate insights and automate your git workflow, never storing your raw source code." },
    { question: "What AI models power the automation tools?", answer: "GitTalk utilizes an ensemble of state-of-the-art LLMs (like GPT-4 and Claude 3 Opus) specifically fine-tuned on astoundingly large codebases to provide hyper-contextual code reviews, commit messages, and PR summaries." },
    { question: "Do I need to install anything locally?", answer: "No local installation is required to start benefiting from our dashboard insights and automated PR generators. We do offer a lightweight CLI for advanced users who prefer terminal integration." }
];

const TESTIMONIALS = [
    { 
        quote: "GitTalk has fundamentally changed how our engineering team operates. We ship 40% faster and PR anxiety is entirely gone. The AI insights are scary accurate.", 
        author: "Sarah Jenkins", role: "VP of Engineering, TechNova", icon: Hexagon 
    },
    { 
        quote: "The automated code reviews catch edge cases that our senior engineers miss. It's like having a 10x developer pairing with everyone across all timezones.", 
        author: "David Chen", role: "Lead Architect, FlowState", icon: Box 
    },
    { 
        quote: "Consolidating 5 different utilities into this single glowing command center saved us thousands. The UI is absolutely breathtaking and functional.", 
        author: "Elena Rodriguez", role: "CTO, Zenith Startups", icon: Flame 
    },
];

const MINI_FEATURES = [
    { icon: Terminal, title: "Smart Commits", desc: "Automate stage/unstage grouping securely." },
    { icon: Bot, title: "AI PR Generation", desc: "Instantly draft context-rich pull requests." },
    { icon: Shield, title: "Code Quality", desc: "Identify tech debt & dead code fast." },
    { icon: Lock, title: "Secrets Scanner", desc: "Prevent secret leaks before pushing." },
    { icon: Layout, title: "Command Builder", desc: "Visual git command construction." },
    { icon: Eye, title: "Dependency Audit", desc: "Stay compliant & up-to-date effortlessly." },
];

/* ── Components ─────────────────────────────────────────────── */

function AccordionItem({ title, content }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl mb-4 overflow-hidden transition-all duration-300">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
            >
                <span className="font-semibold text-white/90 group-hover:text-white transition-colors">{title}</span>
                <ChevronDown className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
            </button>
            <div 
                className={`px-6 text-white/60 text-sm leading-relaxed transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {content}
            </div>
        </div>
    );
}

export default function Home() {
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen bg-[#060606] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">

            {/* ═══ GLOBAL BACKGROUND GLOWS ══════════════════════════════════════════════ */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                {/* Cyan glow top left */}
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
                {/* Orange glow top right */}
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
                {/* Center subtle glow */}
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>

            <div className="relative z-10">

                {/* ═══ HERO SECTION ══════════════════════════════════════════════ */}
                <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center flex flex-col items-center">
                    
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span className="text-white/80 tracking-wide uppercase">GitTalk 2.0 Is Here</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        Simplify Your Workflow.<br />
                        Supercharge Your Team.
                    </h1>

                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        A premium consolidation of 70+ essential Git utilities, AI-driven automation, 
                        and deep repository analytics designed for the modern developer.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 w-full sm:w-auto">
                        {user ? (
                            <Link to="/dashboard" className="group relative h-14 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 w-full sm:w-auto overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Layout size={20} className="relative z-10" />
                                <span className="relative z-10">Enter Dashboard</span>
                                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <Link to="/auth" className="group relative h-14 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 w-full sm:w-auto overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Github size={20} className="relative z-10" />
                                <span className="relative z-10">Start Building Free</span>
                            </Link>
                        )}
                        <a href="#features" className="group h-14 px-8 rounded-full border border-white/10 bg-white/5 text-white font-semibold flex items-center gap-2 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto backdrop-blur-md">
                            <Play size={18} className="text-white/60 group-hover:text-white" />
                            <span>See How It Works</span>
                        </a>
                    </div>

                    {/* Dashboard Mockup Showcase */}
                    <div className="relative w-full max-w-5xl mx-auto mb-20 group perspective-[2000px]">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-amber-500/30 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>
                        <div className="relative rounded-[2rem] border border-white/15 bg-[#0a0a0a]/80 backdrop-blur-xl p-2 shadow-2xl overflow-hidden transform transition-all duration-700 hover:rotate-x-2">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
                            <img 
                                src={heroMockup} 
                                alt="GitTalk Premium Dashboard" 
                                className="w-full h-auto rounded-[1.5rem] border border-white/5"
                            />
                        </div>
                    </div>

                    {/* Trusted By */}
                    <div className="flex flex-col items-center gap-6 opacity-60">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Trusted by innovative teams worldwide</p>
                        <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center filter grayscale contrast-200 opacity-70">
                            {/* Placeholder Logos */}
                            <div className="flex items-center gap-2 text-xl font-bold font-mono"><Hexagon /> SYNTHESIS</div>
                            <div className="flex items-center gap-2 text-xl font-bold font-mono"><Box /> OMNICORP</div>
                            <div className="flex items-center gap-2 text-xl font-bold font-mono"><Orbit /> NEURALNET</div>
                            <div className="flex items-center gap-2 text-xl font-bold font-mono"><Flame /> VORTEX</div>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10"></div>

                {/* ═══ BENTO 1: BUILD SCALE MANAGE ════════════════════════════════════════ */}
                <section id="features" className="max-w-6xl mx-auto px-6 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            Build, Scale And Manage<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Entire AI Workforce</span>
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto">
                            Replace disconnected scripts and clunky terminal history with our 
                            unified, enterprise-grade Git command center.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Card Span 2 */}
                        <div className="md:col-span-2 group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden hover:border-cyan-500/30 transition-colors">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-colors"></div>
                            
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20">
                                        <Bot className="text-cyan-400" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Code Summarization</h3>
                                    <p className="text-white/60 max-w-md leading-relaxed">
                                        Generative AI analyzes your diffs to write comprehensive PR descriptions, 
                                        commit messages, and architectural summaries instantly.
                                    </p>
                                </div>
                                <div className="mt-8 rounded-xl border border-white/10 bg-[#000] p-4 font-mono text-sm text-cyan-300 shadow-inner">
                                    <span className="text-white/30">$</span> gittalk ai review pr-104<br/>
                                    <span className="text-emerald-400">✓</span> Analyzed 34 files, 1.2k lines<br/>
                                    <span className="text-emerald-400">✓</span> Generated summary & reviewer mapping
                                </div>
                            </div>
                        </div>

                        {/* Smaller Card 1 */}
                        <div className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden hover:border-amber-500/30 transition-colors">
                            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                                    <Zap className="text-amber-400" size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Universal Search (Cmd+K)</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-6">
                                    Instantly jump between repositories, active branches, PRs, and AI tools with lightning-fast fuzzy search.
                                </p>
                                <div className="rounded-lg bg-black/50 border border-white/5 p-3 flex justify-between items-center">
                                    <span className="text-white/40 text-sm border border-white/10 rounded px-2">⌘</span>
                                    <span className="text-white/40 text-sm">+</span>
                                    <span className="text-white/40 text-sm border border-white/10 rounded px-2">K</span>
                                </div>
                            </div>
                        </div>

                        {/* Smaller Card 2 */}
                        <div className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden hover:border-emerald-500/30 transition-colors">
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                                        <BarChart3 className="text-emerald-400" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">Full Observability</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        Track cycle times, review loads, and tech debt across your entire organization in real-time.
                                    </p>
                                </div>
                                <div className="mt-6 flex items-end gap-2 h-12">
                                    <div className="w-1/4 bg-white/10 h-[40%] rounded-t-sm"></div>
                                    <div className="w-1/4 bg-white/20 h-[60%] rounded-t-sm"></div>
                                    <div className="w-1/4 bg-emerald-500/60 h-[90%] rounded-t-sm"></div>
                                    <div className="w-1/4 bg-emerald-400 h-full rounded-t-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* Large Card Span 2 Bottom */}
                        <div className="md:col-span-2 group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden hover:border-purple-500/30 transition-colors">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[150%] bg-purple-500/10 rounded-full blur-[100px]"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                                <div className="flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                                        <GitBranch className="text-purple-400" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Multi-Branch Maestro</h3>
                                    <p className="text-white/60 leading-relaxed max-w-md">
                                        Visually cherry-pick, rebase interactively, and resolve 3-way merge conflicts without leaving your browser. 
                                        We make advanced git operations foolproof.
                                    </p>
                                </div>
                                <div className="flex-1 w-full bg-[#000]/50 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-white/5">
                                        <GitBranch size={16} className="text-white/40"/>
                                        <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                                        <div className="h-2 w-12 bg-purple-400 rounded-full ml-auto"></div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-purple-500/20 rounded-lg p-2 border border-purple-500/30">
                                        <GitMerge size={16} className="text-purple-400"/>
                                        <div className="h-2 w-32 bg-white/80 rounded-full"></div>
                                        <CheckCircle2 size={16} className="text-emerald-400 ml-auto"/>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-white/5">
                                        <CircleDot size={16} className="text-white/40"/>
                                        <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* ═══ BENTO 2: MORE FEATURES ════════════════════════════════════════════ */}
                <section className="bg-[#030303] border-y border-white/5 py-32 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                Few More Things<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">You're Going To Love</span>
                            </h2>
                            <p className="text-white/50 max-w-2xl mx-auto">
                                We didn't stop at the basics. Our platform is packed with utilities
                                designed to shave hours off your week.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {MINI_FEATURES.map((feat, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all text-white/60 border border-white/5">
                                        <feat.icon size={20} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white/90 mb-2">{feat.title}</h4>
                                    <p className="text-sm text-white/50 leading-relaxed">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* ═══ TESTIMONIALS ═════════════════════════════════════════════════════ */}
                <section className="max-w-7xl mx-auto px-6 py-32 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
                    
                    <div className="relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                Elevate Your AI<br />
                                <span className="text-white/50">Journey Experience</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {TESTIMONIALS.map((t, i) => (
                                <div key={i} className="flex flex-col bg-white/[0.01] border border-white/[0.05] rounded-3xl p-8 hover:border-white/15 transition-colors">
                                    <div className="flex gap-1 mb-6 text-amber-500">
                                        {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                    </div>
                                    <Quote size={32} className="text-white/10 mb-4" />
                                    <p className="text-white/70 text-lg leading-relaxed mb-8 flex-1">"{t.quote}"</p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                                            <t.icon size={18} className="text-white/60"/>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white/90">{t.author}</div>
                                            <div className="text-xs text-white/40">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* ═══ FAQS ═════════════════════════════════════════════════════════════ */}
                <section className="max-w-3xl mx-auto px-6 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">
                            Got Questions?<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">We've Got Answers</span>
                        </h2>
                    </div>
                    
                    <div className="space-y-2">
                        {FAQS.map((faq, index) => (
                            <AccordionItem key={index} title={faq.question} content={faq.answer} />
                        ))}
                    </div>
                </section>


                {/* ═══ FOOTER CTA ═══════════════════════════════════════════════════════ */}
                <section className="border-t border-white/5 py-32 px-6 text-center relative mt-20">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-gradient-to-t from-cyan-500/10 to-transparent blur-[80px] z-0 pointer-events-none"></div>
                    
                    <div className="max-w-2xl mx-auto relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                            Ready To Transform Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">Project Management?</span>
                        </h2>
                        <p className="text-lg text-white/50 mb-10 font-light">
                            Join thousands of elite developers combining the power of Git
                            with bleeding-edge AI to ship code effortlessly.
                        </p>
                        
                        <div className="flex justify-center">
                            {user ? (
                                <Link to="/dashboard" className="h-14 px-10 text-lg rounded-full bg-white text-black font-bold hover:scale-105 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center gap-2">
                                    <Layout size={20} />
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link to="/auth" className="h-14 px-10 text-lg rounded-full bg-white text-black font-bold hover:scale-105 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center gap-2">
                                    <Github size={20} />
                                    Get Started Free
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer bare minimal */}
                <footer className="w-full py-8 border-t border-white/5 text-center flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal className="text-cyan-500" size={24} />
                        <span className="text-xl font-bold tracking-tight text-white">GitTalk<span className="text-cyan-500 text-sm align-top">©</span></span>
                    </div>
                    <div className="text-xs text-white/30">&copy; 2026 GitTalk Premium Tools. All rights reserved.</div>
                </footer>

            </div>
        </div>
    );
}
