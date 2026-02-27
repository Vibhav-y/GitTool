import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Download, Save, Edit3, FileText, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function EditProject() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markdown, setMarkdown] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                // Ensure user owns this project
                if (data.user_id !== user.id) {
                    toast.error("Unauthorized access");
                    navigate('/dashboard');
                    return;
                }

                setProject(data);
                setMarkdown(data.generated_markdown || '');
            } catch (err) {
                console.error(err);
                toast.error('Failed to load project details.');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (user && id) fetchProject();
    }, [id, user, navigate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({ generated_markdown: markdown, updated_at: new Date() })
                .eq('id', id);

            if (error) throw error;
            toast.success("Project updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const downloadRaw = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        a.click();
        toast.success('Downloaded README.md');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--muted-foreground)' }}>Loading project...</p>
            </div>
        )
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                    <Link to="/dashboard" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px', padding: '4px 12px', height: 'auto', outline: 'none', border: 'none', background: 'transparent' }}>
                        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2rem' }}>Edit Project: {project.title}</h1>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={downloadRaw}>
                        <Download size={18} /> Export
                    </button>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="editor-container">
                <div className="editor-pane">
                    <div className="pane-header">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={16} /> Markdown Source</span>
                    </div>
                    <textarea
                        className="markdown-editor"
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        spellCheck="false"
                    />
                </div>
                <div className="editor-pane">
                    <div className="pane-header">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Live Preview</span>
                    </div>
                    <div className="markdown-preview" style={{ backgroundColor: 'var(--background)' }}>
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
