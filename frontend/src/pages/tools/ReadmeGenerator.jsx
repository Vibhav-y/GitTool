import NavbarPortal from '../../components/NavbarPortal';
import React from 'react';
import { FileText, Wand2 } from 'lucide-react';

export default function ReadmeGenerator() {
    return (
        <div className="tool-page">
            <NavbarPortal>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText size={18} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h2 className="tool-page-title">README Generator</h2>
                        <span className="hidden sm:inline text-border">|</span>
                        <p className="tool-page-desc">Generate comprehensive README.md files for your repositories automatically.</p>
                    </div>
                </div>
            </NavbarPortal>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Wand2 size={48} className="mb-4 text-primary opacity-50" />
                    <h3 className="mb-2 text-lg font-bold text-foreground">Coming Soon</h3>
                    <p className="max-w-md text-sm">
                        The intelligent README generation capabilities are currently being wired up. Check back soon!
                    </p>
                </div>
            </div>
        </div>
    );
}
