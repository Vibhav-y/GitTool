import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

export function useWorkspace() {
    return useContext(WorkspaceContext);
}

export function WorkspaceProvider({ children }) {
    // Attempt to load from localStorage initially
    const [selectedRepo, setSelectedRepo] = useState(() => {
        const saved = localStorage.getItem('workspace_repo');
        return saved ? JSON.parse(saved) : null;
    });

    const [selectedBranch, setSelectedBranch] = useState(() => {
        return localStorage.getItem('workspace_branch') || 'main'; // default to main
    });

    // Save to localStorage whenever they change
    useEffect(() => {
        if (selectedRepo) {
            localStorage.setItem('workspace_repo', JSON.stringify(selectedRepo));
        } else {
            localStorage.removeItem('workspace_repo');
        }
    }, [selectedRepo]);

    useEffect(() => {
        if (selectedBranch) {
            localStorage.setItem('workspace_branch', selectedBranch);
        } else {
            localStorage.removeItem('workspace_branch');
        }
    }, [selectedBranch]);

    const value = {
        selectedRepo,
        setSelectedRepo,
        selectedBranch,
        setSelectedBranch
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}
