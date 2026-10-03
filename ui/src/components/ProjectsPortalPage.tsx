import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  PlusSquare,
  Search,
  ArrowUpDown,
  LayoutGrid,
  List,
  Building2,
  Home,
  Armchair,
  Archive,
  Calendar,
  Trash2,
  ArrowRight,
  Check,
  CheckCircle2,
  MoreHorizontal,
  X,
  Edit3,
  Layers,
  FolderOpen,
  Target,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { AssetRun } from './AssetFeedItem';

export interface ProjectItem {
  id: string;
  name: string;
  category?: 'architecture' | 'interior' | 'furniture' | string;
  description?: string;
  createdAt: number;
  count?: number;
  isArchived?: boolean;
}

interface ProjectsPortalPageProps {
  projects: ProjectItem[];
  activeProjectId: string;
  assetRuns: AssetRun[];
  onSelectProject: (projectId: string) => void;
  onSetActiveProject?: (projectId: string) => void;
  onCreateProject: (name: string, category: string, description?: string) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProject?: (projectId: string, updates: Partial<ProjectItem>) => void;
}

export const ProjectsPortalPage: React.FC<ProjectsPortalPageProps> = ({
  projects,
  activeProjectId,
  assetRuns,
  onSelectProject,
  onSetActiveProject,
  onCreateProject,
  onDeleteProject,
  onUpdateProject
}) => {
  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState<'all' | 'architecture' | 'interior' | 'furniture' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'name' | 'renders'>('latest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Creation & Edit Modals
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState<'architecture' | 'interior' | 'furniture'>('architecture');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState<'architecture' | 'interior' | 'furniture'>('architecture');

  // Quick Action Dropdown State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menus on outside click
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
      // If clicking outside any open card menu
      const target = event.target as HTMLElement;
      if (!target.closest('.card-menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Thumbnail Resolver
  const getProjectThumbnail = (projectId: string, category?: string) => {
    const projectRuns = assetRuns.filter((r) => r.projectId === projectId);
    if (projectRuns.length > 0 && projectRuns[0].images.length > 0) {
      return projectRuns[0].images[0].url || projectRuns[0].images[0].b64;
    }
    // High-resolution fallback matching exact reference mockup
    if (projectId === 'PRJ-1003') {
      return '/examples/ARCH/S2A/Output.png';
    }
    if (projectId === 'PRJ-1001') {
      return '/examples/ARCH/T2A/make%20a%20luxury%20villa%20with%203%20floors.png';
    }
    if (projectId === 'PRJ-1002') {
      return '/examples/INTERIOR%20DESIGNING/GYRNL/Output.png';
    }
    if (category === 'interior') {
      return '/examples/INTERIOR%20DESIGNING/GYRNL/Output.png';
    }
    if (category === 'furniture') {
      return '/examples/FURNITURE/S2F/Output.png';
    }
    return '/examples/ARCH/T2A/make%20a%20luxury%20villa%20with%203%20floors.png';
  };

  // Render Count Resolver
  const getProjectRenderCount = (proj: ProjectItem) => {
    const realCount = assetRuns.filter((r) => r.projectId === proj.id).length;
    if (proj.count !== undefined && proj.count > realCount) {
      return proj.count;
    }
    return realCount;
  };

  // Formatted Date (e.g. "3 Oct 2026")
  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((proj) => {
        // Tab Category Filter
        if (activeFilter === 'archived') {
          if (!proj.isArchived) return false;
        } else {
          if (proj.isArchived) return false;
          if (activeFilter !== 'all' && proj.category !== activeFilter) {
            return false;
          }
        }
        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (proj.name || '').toLowerCase().includes(q);
          const matchId = (proj.id || '').toLowerCase().includes(q);
          const matchDesc = (proj.description || '').toLowerCase().includes(q);
          if (!matchName && !matchId && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') return b.createdAt - a.createdAt;
        if (sortBy === 'oldest') return a.createdAt - b.createdAt;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'renders') {
          const countA = getProjectRenderCount(a);
          const countB = getProjectRenderCount(b);
          return countB - countA;
        }
        return 0;
      });
  }, [projects, activeFilter, searchQuery, sortBy, assetRuns]);

  // Handle Project Creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newProjectName.trim() || `Design Project ${projects.length + 1}`;
    onCreateProject(name, newProjectCategory, newProjectDesc.trim());
    setNewProjectName('');
    setNewProjectDesc('');
    setIsCreatingModalOpen(false);
  };

  // Handle Project Edit/Rename
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (onUpdateProject) {
      onUpdateProject(editingProject.id, {
        name: editName.trim() || editingProject.name,
        description: editDesc.trim(),
        category: editCategory
      });
    }
    setEditingProject(null);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setEditName(proj.name);
    setEditDesc(proj.description || '');
    setEditCategory((proj.category as any) || 'architecture');
    setOpenMenuId(null);
  };

  const toggleArchiveProject = (proj: ProjectItem) => {
    if (onUpdateProject) {
      onUpdateProject(proj.id, { isArchived: !proj.isArchived });
    }
    setOpenMenuId(null);
  };

  return (
    <div
      className="projects-portal-container"
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#F8FAFC',
        padding: '36px 48px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100%'
      }}
    >
      <div style={{ maxWidth: 1280, width: '100%' }}>
        {/* ============================================================== */}
        {/* 1. HERO HEADER WITH 3D ISOMETRIC CUBE ART & CREATE BUTTON     */}
        {/* ============================================================== */}
        <div
          className="projects-portal-hero-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 36,
            position: 'relative'
          }}
        >
          {/* Left Hero Text Content */}
          <div style={{ zIndex: 1, maxWidth: 620 }}>
            {/* Pill tracking badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                color: '#2563EB',
                padding: '4px 12px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 14
              }}
            >
              <Target size={13} style={{ color: '#2563EB' }} />
              <span>Project Management & History</span>
            </div>

            {/* Main Title: Spatial Projects Hub */}
            <h1
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0
              }}
            >
              Spatial Projects <span style={{ color: '#2563EB' }}>Hub</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 14,
                color: '#64748B',
                marginTop: 10,
                lineHeight: 1.6,
                maxWidth: 540
              }}
            >
              Create a new design project or open an existing workspace. Every project maintains its own isolated generative renders, prompts, and task history.
            </p>
          </div>

          {/* Right Hero: Translucent 3D Isometric Art + Create New Project Button */}
          <div
            className="projects-hero-art-wrapper"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: 340,
              height: 140
            }}
          >
            {/* Soft Ambient Glow */}
            <div
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 320,
                height: 140,
                background: 'radial-gradient(circle at 65% 50%, rgba(191, 219, 254, 0.5) 0%, rgba(239, 246, 255, 0.1) 70%, transparent 100%)',
                filter: 'blur(16px)',
                pointerEvents: 'none'
              }}
            />

            {/* Isometric Blueprint Wireframe Lines & Floating Planes */}
            <svg
              width="340"
              height="140"
              viewBox="0 0 340 140"
              fill="none"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                pointerEvents: 'none',
                opacity: 0.85
              }}
            >
              {/* Perspective background planes */}
              <polygon
                points="160,20 250,55 200,80 110,45"
                fill="rgba(219, 234, 254, 0.4)"
                stroke="rgba(147, 197, 253, 0.45)"
                strokeWidth="1"
              />
              <polygon
                points="250,55 320,85 270,110 200,80"
                fill="rgba(191, 219, 254, 0.25)"
                stroke="rgba(147, 197, 253, 0.35)"
                strokeWidth="1"
              />

              {/* 3D Wireframe Cube (matching mockup reference) */}
              <g transform="translate(85, 35)">
                {/* Top Face */}
                <polygon
                  points="26,0 52,13 26,26 0,13"
                  fill="none"
                  stroke="#93C5FA"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {/* Left Face */}
                <polygon
                  points="0,13 26,26 26,56 0,43"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {/* Right Face */}
                <polygon
                  points="52,13 26,26 26,56 52,43"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {/* Internal axis/grid guide */}
                <line x1="13" y1="6.5" x2="39" y2="19.5" stroke="rgba(147, 197, 253, 0.45)" strokeWidth="0.9" strokeDasharray="2 2" />
                <line x1="26" y1="26" x2="26" y2="42" stroke="rgba(147, 197, 253, 0.45)" strokeWidth="0.9" strokeDasharray="2 2" />
              </g>

              {/* Secondary micro-cube in background */}
              <g transform="translate(230, 25) scale(0.65)" opacity="0.6">
                <polygon points="26,0 52,13 26,26 0,13" fill="none" stroke="#BFDBFE" strokeWidth="1.4" />
                <polygon points="0,13 26,26 26,56 0,43" fill="none" stroke="#93C5FD" strokeWidth="1.4" />
                <polygon points="52,13 26,26 26,56 52,43" fill="none" stroke="#60A5FA" strokeWidth="1.4" />
              </g>
            </svg>

            {/* Elevated Primary Action Button */}
            <button
              onClick={() => setIsCreatingModalOpen(true)}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 10,
                padding: '12px 22px',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.25), 0 4px 10px -2px rgba(15, 23, 42, 0.1)',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 14px 30px -4px rgba(15, 23, 42, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 10px 25px -4px rgba(15, 23, 42, 0.25), 0 4px 10px -2px rgba(15, 23, 42, 0.1)';
              }}
            >
              <PlusSquare size={16} />
              <span>Create New Project</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. FILTER TABS PILL GROUP & SEARCH / CONTROLS BAR              */}
        {/* ============================================================== */}
        <div
          className="projects-filter-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 28
          }}
        >
          {/* Left: Filter Tabs Capsule */}
          <div
            className="projects-filter-capsule scroll-strip-no-scrollbar"
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: 4,
              display: 'inline-flex',
              gap: 3,
              alignItems: 'center',
              overflowX: 'auto',
              maxWidth: '100%'
            }}
          >
            {[
              { id: 'all', label: 'All Projects', icon: <LayoutGrid size={13} /> },
              { id: 'architecture', label: 'Architecture', icon: <Building2 size={13} /> },
              { id: 'interior', label: 'Interior', icon: <Home size={13} /> },
              { id: 'furniture', label: 'Furniture', icon: <Armchair size={13} /> },
              { id: 'archived', label: 'Archived', icon: <Archive size={13} /> }
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    border: 'none',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#0F172A' : '#64748B',
                    boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                    transition: 'all 140ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#64748B';
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Search, Sort Dropdown & View Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search Input Field */}
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '8px 12px 8px 34px',
                  fontSize: 13,
                  color: '#0F172A',
                  width: 220,
                  outline: 'none',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: 2,
                    display: 'flex'
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: 'relative' }} ref={sortRef}>
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '8px 13px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease'
                }}
              >
                <ArrowUpDown size={13} style={{ color: '#64748B' }} />
                <span>
                  {sortBy === 'latest' && 'Latest First'}
                  {sortBy === 'oldest' && 'Oldest First'}
                  {sortBy === 'name' && 'Alphabetical (A-Z)'}
                  {sortBy === 'renders' && 'Most Renders'}
                </span>
                <ChevronDown size={13} style={{ color: '#94A3B8' }} />
              </button>

              {sortDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: 6,
                    boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
                    zIndex: 40,
                    minWidth: 170,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  {[
                    { id: 'latest', label: 'Latest First' },
                    { id: 'oldest', label: 'Oldest First' },
                    { id: 'name', label: 'Alphabetical (A-Z)' },
                    { id: 'renders', label: 'Most Renders' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as any);
                        setSortDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: 6,
                        border: 'none',
                        background: sortBy === option.id ? '#EFF6FF' : 'transparent',
                        color: sortBy === option.id ? '#1D4ED8' : '#334155',
                        fontSize: 12.5,
                        fontWeight: sortBy === option.id ? 600 : 400,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.id && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Toggle: Grid vs List */}
            <div
              style={{
                display: 'flex',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: 3,
                gap: 2
              }}
            >
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                style={{
                  border: 'none',
                  background: viewMode === 'grid' ? '#F1F5F9' : 'transparent',
                  color: viewMode === 'grid' ? '#2563EB' : '#94A3B8',
                  padding: 6,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List View"
                style={{
                  border: 'none',
                  background: viewMode === 'list' ? '#F1F5F9' : 'transparent',
                  color: viewMode === 'list' ? '#2563EB' : '#94A3B8',
                  padding: 6,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SECTION TITLE: Existing Projects (3)                        */}
        {/* ============================================================== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Layers size={18} style={{ color: '#0F172A' }} />
          <h2 style={{ fontSize: 16.5, fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Existing Projects ({filteredProjects.length})
          </h2>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px dashed #CBD5E1',
              borderRadius: 16,
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}
            >
              <FolderOpen size={24} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
              No projects found
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', maxWidth: 400, margin: '0 0 20px 0' }}>
              {searchQuery
                ? `No projects matching "${searchQuery}". Try a different search query.`
                : 'There are no projects in this category yet. Create your first project to get started.'}
            </p>
            <button
              onClick={() => setIsCreatingModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <PlusSquare size={15} /> Create New Project
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. PROJECT CARDS (3-COLUMN GRID MATCHING MOCKUP)               */}
        {/* ============================================================== */}
        {viewMode === 'grid' ? (
          <div
            className="projects-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: 24
            }}
          >
            {filteredProjects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              const renderCount = getProjectRenderCount(proj);
              const thumbnail = getProjectThumbnail(proj.id, proj.category);
              const isMenuOpen = openMenuId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  style={{
                    background: '#FFFFFF',
                    border: isActive ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? '0 10px 25px -5px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.1)'
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 0, 0, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                >
                  {/* Thumbnail Cover Banner */}
                  <div
                    style={{
                      height: 195,
                      width: '100%',
                      position: 'relative',
                      background: '#0F172A',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={thumbnail}
                      alt={proj.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.95,
                        transition: 'transform 400ms ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                    />

                    {/* Gradient overlay for badges */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.1) 45%, transparent 70%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Top-Left: Project ID Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'rgba(15, 23, 42, 0.78)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#FFFFFF',
                        padding: '4px 9px',
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono, monospace)',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {proj.id}
                    </div>

                    {/* Top-Right: Active Project Badge + Options Menu */}
                    <div
                      className="card-menu-container"
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {isActive && (
                        <div
                          style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.35)'
                          }}
                        >
                          <CheckCircle2 size={12} />
                          <span>Active Project</span>
                        </div>
                      )}

                      {/* Options Button (•••) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : proj.id);
                        }}
                        title="Project Options"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.88)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1E293B',
                          cursor: 'pointer',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
                          transition: 'all 120ms ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.88)')}
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {/* Card Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: 34,
                            right: 0,
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: 10,
                            padding: 6,
                            boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.16), 0 4px 8px -2px rgba(15, 23, 42, 0.06)',
                            zIndex: 30,
                            minWidth: 180,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                          }}
                        >
                          {!isActive && onSetActiveProject && (
                            <button
                              onClick={() => {
                                onSetActiveProject(proj.id);
                                setOpenMenuId(null);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '7px 10px',
                                borderRadius: 6,
                                border: 'none',
                                background: 'transparent',
                                color: '#0F172A',
                                fontSize: 12.5,
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'left'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <CheckCircle2 size={14} style={{ color: '#2563EB' }} /> Set as Active
                            </button>
                          )}

                          <button
                            onClick={() => openEditModal(proj)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '7px 10px',
                              borderRadius: 6,
                              border: 'none',
                              background: 'transparent',
                              color: '#0F172A',
                              fontSize: 12.5,
                              fontWeight: 500,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Edit3 size={14} style={{ color: '#64748B' }} /> Rename / Edit
                          </button>

                          <button
                            onClick={() => toggleArchiveProject(proj)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '7px 10px',
                              borderRadius: 6,
                              border: 'none',
                              background: 'transparent',
                              color: '#0F172A',
                              fontSize: 12.5,
                              fontWeight: 500,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Archive size={14} style={{ color: '#64748B' }} />
                            {proj.isArchived ? 'Unarchive Project' : 'Archive Project'}
                          </button>

                          {projects.length > 1 && (
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                if (confirm(`Delete project "${proj.name}" (${proj.id})?`)) {
                                  onDeleteProject(proj.id);
                                }
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '7px 10px',
                                borderRadius: 6,
                                border: 'none',
                                background: 'transparent',
                                color: '#EF4444',
                                fontSize: 12.5,
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                borderTop: '1px solid #F1F5F9',
                                marginTop: 2
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <Trash2 size={14} /> Delete Project
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom-Left: N renders generated badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#F8FAFC',
                        padding: '3px 9px',
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 600
                      }}
                    >
                      {renderCount} {renderCount === 1 ? 'render generated' : 'renders generated'}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div
                    style={{
                      padding: '20px 20px 16px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Project Name */}
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#0F172A',
                          margin: '0 0 6px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={proj.name}
                      >
                        {proj.name}
                      </h3>

                      {/* Project Description (2-line clamp) */}
                      <p
                        style={{
                          fontSize: 12.5,
                          color: '#64748B',
                          margin: '0 0 16px 0',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 38
                        }}
                      >
                        {proj.description || 'Spatial workspace with isolated generative pipeline, prompts, and design task configurations.'}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 14,
                        borderTop: '1px solid #F1F5F9'
                      }}
                    >
                      {/* Date */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          color: '#64748B'
                        }}
                      >
                        <Calendar size={13} style={{ color: '#94A3B8' }} />
                        <span>{formatDate(proj.createdAt)}</span>
                      </div>

                      {/* Right Footer Actions: Trash + Open Tasks Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {projects.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete project "${proj.name}" (${proj.id})?`)) {
                                onDeleteProject(proj.id);
                              }
                            }}
                            title="Delete Project"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#94A3B8',
                              padding: '6px',
                              cursor: 'pointer',
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 120ms ease, background 120ms ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#EF4444';
                              e.currentTarget.style.background = '#FEF2F2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#94A3B8';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}

                        {/* Open Tasks -> Button */}
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: isActive ? '#2563EB' : '#0F172A',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 16px',
                            fontSize: 12.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 140ms ease',
                            boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          <span>Open Tasks</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ============================================================== */
          /* LIST VIEW (ALTERNATIVE CONDENSED TABLE)                        */
          /* ============================================================== */
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            {filteredProjects.map((proj, idx) => {
              const isActive = proj.id === activeProjectId;
              const renderCount = getProjectRenderCount(proj);
              const thumbnail = getProjectThumbnail(proj.id, proj.category);

              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom: idx < filteredProjects.length - 1 ? '1px solid #F1F5F9' : 'none',
                    cursor: 'pointer',
                    background: isActive ? '#F8FAFC' : '#FFFFFF',
                    borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                    transition: 'background 120ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#FAFAFA';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img
                      src={thumbnail}
                      alt={proj.name}
                      style={{
                        width: 72,
                        height: 50,
                        borderRadius: 8,
                        objectFit: 'cover',
                        border: '1px solid #E2E8F0'
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontWeight: 700,
                            fontSize: 11,
                            background: '#0F172A',
                            color: '#FFFFFF',
                            padding: '2px 6px',
                            borderRadius: 4
                          }}
                        >
                          {proj.id}
                        </span>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                          {proj.name}
                        </h4>
                        {isActive && (
                          <span
                            style={{
                              background: '#EFF6FF',
                              color: '#2563EB',
                              border: '1px solid #DBEAFE',
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '1px 7px',
                              borderRadius: 9999
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0, maxWidth: 500 }}>
                        {proj.description || 'Spatial workspace with isolated generative pipelines.'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ fontSize: 12, color: '#64748B', textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{renderCount} renders</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{formatDate(proj.createdAt)}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {projects.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete project "${proj.name}" (${proj.id})?`)) {
                              onDeleteProject(proj.id);
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            padding: 6,
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: isActive ? '#2563EB' : '#0F172A',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 8,
                          padding: '7px 14px',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Open Tasks <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 5. CREATE NEW PROJECT MODAL DIALOG                             */}
      {/* ============================================================== */}
      {isCreatingModalOpen && (
        <div
          onClick={() => setIsCreatingModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20
          }}
        >
          <div
            className="create-project-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              maxWidth: 520,
              width: '100%',
              padding: '28px 30px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  Create New Project
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                  Initialize an isolated spatial project workspace with dedicated tasks and prompts.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              {/* Project Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Commercial Tower, Kyoto Minimalist Villa"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 9,
                    fontSize: 13.5,
                    color: '#0F172A',
                    outline: 'none',
                    transition: 'border-color 150ms ease'
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#D1D5DB')}
                />
              </div>

              {/* Design Discipline */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Primary Discipline
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'architecture', label: 'Architecture', icon: <Building2 size={13} /> },
                    { id: 'interior', label: 'Interior', icon: <Home size={13} /> },
                    { id: 'furniture', label: 'Furniture', icon: <Armchair size={13} /> }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewProjectCategory(cat.id as any)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '10px 10px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: newProjectCategory === cat.id ? '1.5px solid #0F172A' : '1px solid #E2E8F0',
                        background: newProjectCategory === cat.id ? '#0F172A' : '#FFFFFF',
                        color: newProjectCategory === cat.id ? '#FFFFFF' : '#475569',
                        transition: 'all 120ms ease'
                      }}
                    >
                      {cat.icon} <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Brief Notes / Style Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Modern commercial building concept with glass facade, landscape design, and concrete accents."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 9,
                    fontSize: 13,
                    color: '#0F172A',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.5
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#D1D5DB')}
                />
              </div>

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    background: 'transparent',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 20px',
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <span>Create Project & Select Tasks</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. EDIT / RENAME PROJECT MODAL                                  */}
      {/* ============================================================== */}
      {editingProject && (
        <div
          onClick={() => setEditingProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              maxWidth: 500,
              width: '100%',
              padding: '28px 30px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  Edit Project Details
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>
                  Update name, description, or discipline for {editingProject.id}.
                </p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 9,
                    fontSize: 13.5,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Discipline
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'architecture', label: 'Architecture' },
                    { id: 'interior', label: 'Interior' },
                    { id: 'furniture', label: 'Furniture' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setEditCategory(cat.id as any)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: editCategory === cat.id ? '1.5px solid #0F172A' : '1px solid #E2E8F0',
                        background: editCategory === cat.id ? '#0F172A' : '#FFFFFF',
                        color: editCategory === cat.id ? '#FFFFFF' : '#475569'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 9,
                    fontSize: 13,
                    color: '#0F172A',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  style={{
                    padding: '9px 16px',
                    background: 'transparent',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 18px',
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
