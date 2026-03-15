import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ExpandableSearch() {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef(null);

    // Focus input when expanding
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isExpanded) {
                setIsExpanded(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isExpanded]);

    // Command/Ctrl + K shortcut wrapper could be added here later.

    return (
        <div className="relative flex items-center h-full">
            {/* Overlay */}
            {isExpanded && (
                <div 
                    className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Icon Button / Search Input Wrapper */}
            <div className={`relative z-50 flex items-center transition-all duration-300 ease-in-out ${isExpanded ? 'w-64 sm:w-80' : 'w-9'}`}>
                {!isExpanded ? (
                    <button 
                        onClick={() => setIsExpanded(true)}
                        className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors"
                        aria-label="Open search"
                    >
                        <Search size={18} />
                    </button>
                ) : (
                    <div className="relative w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Global Search (Esc to close)"
                            className="pl-9 pr-4 w-full bg-background shadow-md border-primary/20 focus-visible:ring-primary/30"
                            onBlur={() => setIsExpanded(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
