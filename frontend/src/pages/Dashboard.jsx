import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, FileText, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setProjects(data || []);
            } catch (error) {
                toast.error('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchProjects();
    }, [user]);

    const deleteProject = async (id) => {
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
            toast.success('Project deleted');
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px' }}>Welcome back! Here are your recent README projects.</p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <Link to="/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <Plus size={18} /> Create New README
                </Link>
                <Link to="/templates" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <BookOpen size={18} /> Browse Templates
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            ) : projects.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                    <Clock size={32} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--foreground)' }}>No Recent Projects</h3>
                    <p>Create your first stunning README to see it here.</p>
                </div>
            ) : (
                <div className="repo-grid">
                    {projects.map(project => (
                        <div key={project.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', fontWeight: 600 }}>
                                    <FileText className="text-cyan" size={20} />
                                    {project.title}
                                </h3>
                                <button onClick={() => deleteProject(project.id)} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', outline: 'none', padding: '4px' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', flex: 1, marginBottom: '24px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {project.description || 'No description provided.'}
                            </p>
                            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                                    {new Date(project.created_at).toLocaleDateString()}
                                </span>
                                <Link to={`/project/${project.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.875rem', height: 'auto' }}>
                                    Edit Project
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
