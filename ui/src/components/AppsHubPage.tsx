import React from 'react';
import {
  Building2,
  Home,
  Armchair,
  Sparkles,
  ArrowRight,
  Layers,
  Compass,
  Cpu,
  Plus,
  FolderOpen,
  CheckCircle2
} from 'lucide-react';
import { TASK_SHORT_CODES } from '../taskConstants';

interface AppsHubPageProps {
  currentProjectId: string;
  onSelectApp: (suite: 'architecture' | 'interior_furniture', taskId: string) => void;
  onCreateNewProject: () => void;
}

export const AppsHubPage: React.FC<AppsHubPageProps> = ({
  currentProjectId,
  onSelectApp,
  onCreateNewProject
}) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#FAFAFA',
        padding: '36px 40px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Top Hero Banner */}
      <div style={{ maxWidth: 1180, width: '100%', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', border: '1px solid #DBEAFE', color: '#1D4ED8', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
              <Compass size={13} /> Spatial Design Suites
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
              Applications & Design Workspaces
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280', marginTop: 6, maxWidth: 640 }}>
              Select a specialized studio to launch an isolated generative workspace. Every render is linked to your active project.
            </p>
          </div>

          {/* Project ID Tag & New Project Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '8px 14px', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Active Project</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
                {currentProjectId}
              </div>
            </div>
            <button
              onClick={onCreateNewProject}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#111827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 150ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Plus size={13} /> New Project
            </button>
          </div>
        </div>
      </div>

      {/* 2 Main Studio Cards */}
      <div
        style={{
          maxWidth: 1180,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
          gap: 24
        }}
      >
        {/* Card 1: Architecture Studio */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 200ms ease, box-shadow 200ms ease'
          }}
        >
          {/* Card Header Banner */}
          <div
            style={{
              height: 160,
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1, color: '#FFFFFF' }}>
              <Building2 size={180} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
                Suite 01 • Architecture
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                4 Workflows
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Architecture Design Studio
              </h2>
              <p style={{ fontSize: 13, color: '#CBD5E1', marginTop: 4 }}>
                Exterior massing, conceptual sketch rendering, material edits & 4K facades.
              </p>
            </div>
          </div>

          {/* Tools List */}
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {[
              {
                id: 'arch_text_to_arch',
                short: 'T2A',
                title: 'Text to Arch',
                desc: 'Generate luxury villas, facades & structures directly from text'
              },
              {
                id: 'arch_sketch_to_arch',
                short: 'S2A',
                title: 'Sketch to Image Arch Render',
                desc: 'Transform hand-drawn conceptual pencil sketches into realistic buildings'
              },
              {
                id: 'arch_image_edit',
                short: 'AIE',
                title: 'Architecture Image Editing',
                desc: 'Modify exterior facade materials, glazing, foliage & surroundings'
              },
              {
                id: 'arch_enhance_render',
                short: 'ETDOTR',
                title: 'Enhance Details of Render',
                desc: 'Deep latent unsharp micro-textures and hyper-detail enhancement'
              }
            ].map((tool) => (
              <div
                key={tool.id}
                onClick={() => onSelectApp('architecture', tool.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #F3F4F6',
                  background: '#FAFAFA',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAFAFA';
                  e.currentTarget.style.borderColor = '#F3F4F6';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#111827',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: 4,
                      minWidth: 46,
                      textAlign: 'center'
                    }}
                  >
                    {tool.short}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                      {tool.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                      {tool.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: '#9CA3AF' }} />
              </div>
            ))}
          </div>

          {/* Launch Suite Button */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA' }}>
            <button
              onClick={() => onSelectApp('architecture', 'arch_text_to_arch')}
              style={{
                width: '100%',
                background: '#111827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Launch Architecture Studio <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 2: Interior & Furniture Studio */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 200ms ease, box-shadow 200ms ease'
          }}
        >
          {/* Card Header Banner */}
          <div
            style={{
              height: 160,
              background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1, color: '#FFFFFF' }}>
              <Home size={180} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
                Suite 02 • Interior & Furniture
              </span>
              <span style={{ fontSize: 12, color: '#A8A29E', fontWeight: 500 }}>
                7 Workflows
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Interior & Furniture Studio
              </h2>
              <p style={{ fontSize: 13, color: '#D6D3D1', marginTop: 4 }}>
                Room redesigns, lighting atmospheric swaps, bespoke joinery & furniture prototypes.
              </p>
            </div>
          </div>

          {/* Tools List */}
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {[
              {
                id: 'interior_sketch_to_design',
                short: 'S2ID',
                title: 'Sketch to Interior Design',
                desc: 'Perspective sketches & floor plans into magazine-cover spaces'
              },
              {
                id: 'interior_room_new_look',
                short: 'GYRNL',
                title: 'Give Your Room New Look',
                desc: 'Restyle wall finishes, flooring, materials & mood while retaining walls'
              },
              {
                id: 'interior_image_edit',
                short: 'IDIE',
                title: 'Interior Design Image Editing',
                desc: 'Targeted furniture swaps, wall finish modifications & light moods'
              },
              {
                id: 'interior_fully_redesign',
                short: 'FRMR',
                title: 'Fully Redesign My Room',
                desc: 'Complete high-end spatial overhaul and material transformation'
              },
              {
                id: 'furniture_sketch_to_render',
                short: 'S2F',
                title: 'Sketch to Furniture',
                desc: 'Hand-drawn chair, table, or sofa sketch into manufactured render'
              },
              {
                id: 'furniture_edit',
                short: 'FE',
                title: 'Furniture Editing',
                desc: 'Swap upholstery fabrics, leather grains, oak finishes & metal hardware'
              },
              {
                id: 'furniture_text_to_render',
                short: 'T2F',
                title: 'Text-Furniture',
                desc: 'Bespoke cabinetry, walk-in closets & joinery from textual descriptions'
              }
            ].map((tool) => (
              <div
                key={tool.id}
                onClick={() => onSelectApp('interior_furniture', tool.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #F3F4F6',
                  background: '#FAFAFA',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAFAFA';
                  e.currentTarget.style.borderColor = '#F3F4F6';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#44403C',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: 4,
                      minWidth: 46,
                      textAlign: 'center'
                    }}
                  >
                    {tool.short}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                      {tool.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                      {tool.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: '#9CA3AF' }} />
              </div>
            ))}
          </div>

          {/* Launch Suite Button */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA' }}>
            <button
              onClick={() => onSelectApp('interior_furniture', 'interior_sketch_to_design')}
              style={{
                width: '100%',
                background: '#111827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Launch Interior & Furniture Studio <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
