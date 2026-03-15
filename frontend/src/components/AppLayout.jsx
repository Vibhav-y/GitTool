import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import GlobalRepoSelector from './GlobalRepoSelector';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExpandableSearch from './ExpandableSearch';
import CustomScrollbar from './CustomScrollbar';
import { useRef, useState } from 'react';

export default function AppLayout() {
    const { user } = useAuth();
    const scrollRef = useRef(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    if (!user) {
        return <Navigate to="/auth" />;
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

            <main
                className="flex flex-1 flex-col h-full overflow-hidden transition-[margin-left] duration-300 ease-in-out"
                style={{ marginLeft: sidebarCollapsed ? 68 : 256 }}
            >
                {/* ── Top Header Bar ──────────────────────── */}
                <header className="flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur z-10 px-6 sm:px-8">
                    {/* Left: Dynamic Navbar Content */}
                    <div id="navbar-left" className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden" />

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {/* Expandable Search */}
                        <ExpandableSearch />

                        {/* Repo Switcher beside search */}
                        <GlobalRepoSelector />
                        
                        {/* Notification Bell */}
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-md h-9 w-9">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
                        </Button>
                    </div>
                </header>

                {/* ── Scrollable Content Area ─────────────── */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 bg-muted/20 relative">
                    <Outlet />
                </div>
                <CustomScrollbar scrollContainerRef={scrollRef} />
            </main>
        </div>
    );
}
