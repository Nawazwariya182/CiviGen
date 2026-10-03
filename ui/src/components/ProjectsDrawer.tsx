import React from 'react';
import { X, FolderPlus, Check, Bookmark, Calendar, Image as ImageIcon, Trash2, ArrowRight } from 'lucide-react';
import { ProjectItem } from './ProjectsPortalPage';

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  projects: ProjectItem[];
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  showBookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
}

export const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  projects,
  onSelectProject,
  onCreateProject,
  showBookmarkedOnly,
  onToggleBookmarkedOnly
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-start',
        animation: 'fadeIn 150ms ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(380px, 88vw)',
          maxWidth: '100vw',
          background: '#FFFFFF',
          height: '100%',
          boxShadow: '10px 0 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#111827', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={15} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
                Projects & Bookmarks
              </h2>
              <span style={{ fontSize: 11, color: '#6B7280' }}>
                Isolated project spaces & saved renders
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action: Create New Project */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={onCreateProject}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#111827',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <FolderPlus size={15} /> Create New Project
          </button>
        </div>

        {/* Filter Toggle: Bookmarked Renders */}
        <div
          onClick={onToggleBookmarkedOnly}
          style={{
            marginTop: 14,
            padding: '10px 12px',
            borderRadius: 8,
            background: showBookmarkedOnly ? '#EFF6FF' : '#F9FAFB',
            border: showBookmarkedOnly ? '1px solid #BFDBFE' : '1px solid #E5E7EB',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 150ms ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bookmark size={14} style={{ color: showBookmarkedOnly ? '#2563EB' : '#6B7280' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: showBookmarkedOnly ? '#1D4ED8' : '#374151' }}>
                Filter Bookmarked Outputs
              </div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>
                {showBookmarkedOnly ? 'Showing starred renders only' : 'Showing all project renders'}
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={showBookmarkedOnly}
            onChange={() => {}}
            style={{ accentColor: '#2563EB', cursor: 'pointer' }}
          />
        </div>

        {/* Project List */}
        <div style={{ marginTop: 24, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF' }}>
              Your Projects ({projects.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {projects.map((p) => {
              const isActive = p.id === currentProjectId;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: isActive ? '1.5px solid #111827' : '1px solid #E5E7EB',
                    background: isActive ? '#F9FAFB' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
                        {p.id}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: '#111827', color: '#FFFFFF', padding: '1px 6px', borderRadius: 4 }}>
                          Active
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <ImageIcon size={11} /> {p.count} render(s)
                      </span>
                      <span>•</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {isActive ? (
                    <Check size={16} style={{ color: '#111827' }} />
                  ) : (
                    <ArrowRight size={14} style={{ color: '#9CA3AF' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
