import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Trash2,
  Bookmark,
  Maximize2,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpDown,
  Calendar,
  Tag
} from 'lucide-react';
import { AssetRun } from './AssetFeedItem';
import { ProjectItem } from './ProjectsPortalPage';

interface LibraryPageProps {
  assetRuns: AssetRun[];
  projects: ProjectItem[];
  onOpenModal: (imgUrl: string, title: string, prompt: string) => void;
  onTriggerUpscale4k: (b64: string) => void;
  onDelete: (id: string, fileUrl?: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpenInStudio: (taskId: string, projectId: string, prompt: string, inputImgUrl?: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  assetRuns,
  projects,
  onOpenModal,
  onTriggerUpscale4k,
  onDelete,
  onToggleBookmark,
  onOpenInStudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'architecture' | 'interior' | 'furniture'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDownload = (e: React.MouseEvent, url: string, filename?: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `civigen_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered and sorted assets
  const filteredRuns = useMemo(() => {
    return assetRuns
      .filter((run) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchPrompt = run.prompt.toLowerCase().includes(q);
          const matchTitle = run.taskTitle.toLowerCase().includes(q);
          const matchProj = (run.projectId || '').toLowerCase().includes(q);
          if (!matchPrompt && !matchTitle && !matchProj) return false;
        }

        // Category filter
        if (categoryFilter !== 'all') {
          const cat = (run.category || '').toLowerCase();
          const taskId = (run.taskId || '').toLowerCase();
          if (categoryFilter === 'architecture') {
            if (!cat.includes('arch') && !taskId.includes('arch')) return false;
          } else if (categoryFilter === 'interior') {
            if (!cat.includes('interior') && !taskId.includes('interior')) return false;
          } else if (categoryFilter === 'furniture') {
            if (!cat.includes('furniture') && !taskId.includes('furniture')) return false;
          }
        }

        // Project filter
        if (selectedProjectId !== 'all') {
          if (run.projectId !== selectedProjectId) return false;
        }

        // Bookmark filter
        if (showBookmarkedOnly && !run.isBookmarked) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return 0; // Already newest first
        return -1;
      });
  }, [assetRuns, searchQuery, categoryFilter, selectedProjectId, showBookmarkedOnly, sortBy]);

  return (
    <div style={{ padding: '28px 36px', width: '100%', maxWidth: 1600, margin: '0 auto', overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Asset Library
              </h1>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0 0' }}>
                All generated architectural renders, interior concepts, and furniture prototypes across your projects.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Pill Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ padding: '6px 12px', background: '#F1F5F9', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#334155' }}>
            Total Renders: <span style={{ color: '#2563EB', fontWeight: 700 }}>{assetRuns.length}</span>
          </div>
          <div style={{ padding: '6px 12px', background: '#F1F5F9', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#334155' }}>
            Projects: <span style={{ color: '#0F172A', fontWeight: 700 }}>{projects.length}</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search + Category Tabs + Project Filter + Sorting */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '12px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          marginBottom: 24
        }}
      >
        {/* Left: Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260, maxWidth: 420, position: 'relative' }}>
          <Search size={16} style={{ color: '#94A3B8', position: 'absolute', left: 10 }} />
          <input
            type="text"
            placeholder="Search prompt, workflow, or project ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              outline: 'none',
              background: '#F8FAFC',
              color: '#0F172A'
            }}
          />
        </div>

        {/* Middle: Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'architecture', label: 'Architecture' },
            { key: 'interior', label: 'Interior' },
            { key: 'furniture', label: 'Furniture' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key as any)}
              style={{
                border: 'none',
                background: categoryFilter === cat.key ? '#FFFFFF' : 'transparent',
                color: categoryFilter === cat.key ? '#0F172A' : '#64748B',
                fontWeight: categoryFilter === cat.key ? 700 : 500,
                fontSize: 12,
                padding: '5px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: categoryFilter === cat.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 120ms ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right: Project Filter + Bookmarked Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} ({p.name})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: showBookmarkedOnly ? '#FEF3C7' : '#FFFFFF',
              color: showBookmarkedOnly ? '#D97706' : '#64748B',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
          >
            <Bookmark size={13} fill={showBookmarkedOnly ? '#D97706' : 'none'} />
            <span>Bookmarked</span>
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      {filteredRuns.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            background: '#FFFFFF',
            border: '1.5px dashed #E2E8F0',
            borderRadius: 16,
            textAlign: 'center'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <ImageIcon size={22} style={{ color: '#94A3B8' }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', margin: '0 0 6px 0' }}>
            No generated assets found
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px 0', maxWidth: 420 }}>
            {searchQuery || categoryFilter !== 'all' || selectedProjectId !== 'all'
              ? 'Try clearing your search or category filters to view more assets.'
              : 'Generate architectural sketches, renders, or designs in the Studio to build your library.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20
          }}
        >
          {filteredRuns.map((run) => {
            const mainImg = run.images[0];
            if (!mainImg) return null;

            return (
              <div
                key={run.id}
                style={{
                  position: 'relative',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 160ms ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                {/* Image Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: run.aspectBadge === '16:9' ? '16/9' : run.aspectBadge === '9:16' ? '9/16' : '1/1',
                    background: '#F1F5F9',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onClick={() => onOpenModal(mainImg.url, run.taskTitle, run.prompt)}
                >
                  <img
                    src={mainImg.url}
                    alt={run.prompt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                    onError={(e) => {
                      if (mainImg.b64 && e.currentTarget.src !== mainImg.b64) {
                        e.currentTarget.src = mainImg.b64;
                      }
                    }}
                  />

                  {/* Top-Left: Task Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>{run.taskTitle}</span>
                  </div>

                  {/* Top-Right: Project Badge & Bookmark */}
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                    {run.projectId && (
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(6px)',
                          color: '#0F172A',
                          fontFamily: 'var(--font-mono, monospace)',
                          padding: '2px 7px',
                          borderRadius: 6,
                          fontSize: 10.5,
                          fontWeight: 700,
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}
                      >
                        {run.projectId}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(run.id);
                      }}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(6px)',
                        border: 'none',
                        color: run.isBookmarked ? '#D97706' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Bookmark"
                    >
                      <Bookmark size={12} fill={run.isBookmarked ? '#D97706' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Card Body & Prompt */}
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 12.5,
                      color: '#334155',
                      lineHeight: 1.5,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={run.prompt}
                  >
                    {run.prompt}
                  </p>

                  {/* Bottom Meta & Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: 8,
                      borderTop: '1px solid #F1F5F9'
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{run.timestamp}</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {/* Copy Prompt */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(run.id, run.prompt);
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          color: copiedId === run.id ? '#10B981' : '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Copy prompt"
                      >
                        {copiedId === run.id ? <Check size={12} /> : <Copy size={12} />}
                      </button>

                      {/* Download */}
                      <button
                        onClick={(e) => handleDownload(e, mainImg.url)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          color: '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Download image"
                      >
                        <Download size={12} />
                      </button>

                      {/* Open in Studio */}
                      <button
                        onClick={() => onOpenInStudio(run.taskId, run.projectId || 'PRJ-1001', run.prompt, run.inputImageUrl)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                          background: '#F8FAFC',
                          color: '#0F172A',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title="Open in Studio"
                      >
                        <ExternalLink size={11} />
                        <span>Studio</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this asset?')) {
                            onDelete(run.id, mainImg.url);
                          }
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: '1px solid #FEE2E2',
                          background: '#FEF2F2',
                          color: '#EF4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Delete asset"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
