import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  ChevronDown,
  Cpu
} from 'lucide-react';
import { TASK_SHORT_CODES, TASK_EXAMPLE_IMAGES, TASK_INPUT_IMAGES } from '../taskConstants';

export interface TaskItem {
  id: string;
  code: string;
  title: string;
  description: string;
  inputImage: string;
  outputImage: string;
  category: 'architecture' | 'interior' | 'furniture';
  isSampleOnly?: boolean;
}

export const ALL_TASKS: TaskItem[] = [
  // 1. Architecture Design Studio
  {
    id: 'arch_text_to_arch',
    code: 'T2A',
    title: 'Text to Arch',
    description: 'Generate photorealistic architectural exteriors, luxury villas, and complex facades directly from descriptive prompts.',
    inputImage: TASK_INPUT_IMAGES['arch_text_to_arch'],
    outputImage: TASK_EXAMPLE_IMAGES['arch_text_to_arch'],
    category: 'architecture',
    isSampleOnly: true
  },
  {
    id: 'arch_sketch_to_arch',
    code: 'S2A',
    title: 'Sketch to Image Arch Render',
    description: 'Transform architectural concept sketches and line drafts into high-end luxury villa renders with crisp materials.',
    inputImage: TASK_INPUT_IMAGES['arch_sketch_to_arch'],
    outputImage: TASK_EXAMPLE_IMAGES['arch_sketch_to_arch'],
    category: 'architecture'
  },
  {
    id: 'arch_sketch_to_multiview',
    code: 'S2MVA',
    title: 'Sketch to Multi View (5 Elevations)',
    description: 'Generate 5 synchronized orthogonal elevation perspectives (front, left, right, back, top) with consistent structural identity.',
    inputImage: TASK_INPUT_IMAGES['arch_sketch_to_multiview'],
    outputImage: TASK_EXAMPLE_IMAGES['arch_sketch_to_multiview'],
    category: 'architecture'
  },
  {
    id: 'arch_image_edit',
    code: 'AIE',
    title: 'Architecture Image Editing',
    description: 'Targeted architectural modifications: replace facade cladding, update materials, or add pools and landscapes.',
    inputImage: TASK_INPUT_IMAGES['arch_image_edit'],
    outputImage: TASK_EXAMPLE_IMAGES['arch_image_edit'],
    category: 'architecture'
  },
  {
    id: 'arch_enhance_render',
    code: 'ETDTER',
    title: 'Enhance the Details of the Render',
    description: 'Refine micro-textures, sharpen concrete grains, polish glass reflections, and balance architectural lighting.',
    inputImage: TASK_INPUT_IMAGES['arch_enhance_render'],
    outputImage: TASK_EXAMPLE_IMAGES['arch_enhance_render'],
    category: 'architecture'
  },

  // 2. Interior Designing Suite
  {
    id: 'interior_sketch_to_design',
    code: 'S2ID',
    title: 'Sketch to Interior Design',
    description: 'Convert interior perspective line sketches into magazine-cover quality living spaces with designer furnishings.',
    inputImage: TASK_INPUT_IMAGES['interior_sketch_to_design'],
    outputImage: TASK_EXAMPLE_IMAGES['interior_sketch_to_design'],
    category: 'interior'
  },
  {
    id: 'interior_room_new_look',
    code: 'GYNL',
    title: 'Give You Room New Look',
    description: 'Restyle existing interior photographs with Scandinavian, Japandi, or Modern palettes while preserving room layout.',
    inputImage: TASK_INPUT_IMAGES['interior_room_new_look'],
    outputImage: TASK_EXAMPLE_IMAGES['interior_room_new_look'],
    category: 'interior'
  },
  {
    id: 'interior_image_edit',
    code: 'IDEE',
    title: 'Interior Design Image Editing',
    description: 'Targeted inpainting: swap central coffee tables, change wall textures, replace lighting fixtures or rugs.',
    inputImage: TASK_INPUT_IMAGES['interior_image_edit'],
    outputImage: TASK_EXAMPLE_IMAGES['interior_image_edit'],
    category: 'interior'
  },
  {
    id: 'interior_fully_redesign',
    code: 'FRMR',
    title: 'Fully Redesign My Room',
    description: 'Total architectural makeover of empty, cluttered, or dated spaces into luxury master suites with recessed cove lighting.',
    inputImage: TASK_INPUT_IMAGES['interior_fully_redesign'],
    outputImage: TASK_EXAMPLE_IMAGES['interior_fully_redesign'],
    category: 'interior'
  },

  // 3. Furniture Rendering & Fabrication
  {
    id: 'furniture_sketch_to_render',
    code: 'S2F',
    title: 'Sketch to Furniture',
    description: 'Transform product design sketches of armchairs, tables, and cabinets into studio-lit commercial product renders.',
    inputImage: TASK_INPUT_IMAGES['furniture_sketch_to_render'],
    outputImage: TASK_EXAMPLE_IMAGES['furniture_sketch_to_render'],
    category: 'furniture'
  },
  {
    id: 'furniture_edit',
    code: 'FE',
    title: 'Furniture Editing',
    description: 'Modify upholstery fabric, change wood finishes, swap hardware, or alter structural design components.',
    inputImage: TASK_INPUT_IMAGES['furniture_edit'],
    outputImage: TASK_EXAMPLE_IMAGES['furniture_edit'],
    category: 'furniture'
  },
  {
    id: 'furniture_text_to_render',
    code: 'T2F',
    title: 'Text-Furniture',
    description: 'Generate bespoke furniture pieces, customized wardrobes, closets, and cabinetry directly from detailed text descriptions.',
    inputImage: TASK_INPUT_IMAGES['furniture_text_to_render'],
    outputImage: TASK_EXAMPLE_IMAGES['furniture_text_to_render'],
    category: 'furniture',
    isSampleOnly: true
  }
];

/**
 * Interactive Before/After Split Comparison Slider for each task card
 */
const TaskCardSlider: React.FC<{
  inputImage: string;
  outputImage: string;
  title: string;
  isSampleOnly?: boolean;
}> = ({ inputImage, outputImage, title, isSampleOnly }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleMouseLeave = () => {
    setSliderPos(50);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '190px',
        overflow: 'hidden',
        background: '#0F172A',
        userSelect: 'none'
      }}
    >
      {/* Background: Output Render (Right side / full canvas) */}
      <img
        src={outputImage}
        alt={`${title} Render`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        loading="lazy"
      />

      {/* Foreground: Input Sketch / Source Image (Clipped from right using CSS clip-path) */}
      <img
        src={inputImage}
        alt={`${title} Input Sketch`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
        }}
        loading="lazy"
      />

      {/* Top Left Label: INPUT */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          color: '#F8FAFC',
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: '0.06em',
          padding: '2.5px 7px',
          borderRadius: 4,
          pointerEvents: 'none',
          zIndex: 10,
          textTransform: 'uppercase'
        }}
      >
        INPUT
      </div>

      {/* Top Right Label: OUTPUT RENDER or SAMPLE RENDER */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: isSampleOnly ? 'rgba(15, 23, 42, 0.75)' : '#2563EB',
          backdropFilter: isSampleOnly ? 'blur(6px)' : 'none',
          color: '#FFFFFF',
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: '0.06em',
          padding: '2.5px 7px',
          borderRadius: 4,
          pointerEvents: 'none',
          zIndex: 10,
          textTransform: 'uppercase',
          boxShadow: isSampleOnly ? 'none' : '0 1px 4px rgba(37, 99, 235, 0.4)'
        }}
      >
        {isSampleOnly ? 'SAMPLE RENDER' : 'OUTPUT RENDER'}
      </div>

      {/* Vertical Divider Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          width: 2,
          background: '#FFFFFF',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
          zIndex: 15,
          pointerEvents: 'none',
          transform: 'translateX(-50%)'
        }}
      />

      {/* Center Circular Handle with 3 dots */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${sliderPos}%`,
          transform: 'translate(-50%, -50%)',
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#334155' }} />
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#334155' }} />
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#334155' }} />
        </div>
      </div>
    </div>
  );
};

/**
 * 3D Isometric Floating Blueprint Hero Illustration in top-right
 */
const IsometricHeroGraphic: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: 320,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* Soft Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 60% 40%, rgba(37, 99, 235, 0.12) 0%, rgba(248, 250, 252, 0) 70%)',
          filter: 'blur(20px)',
          zIndex: 0
        }}
      />

      {/* 3D Stack Container */}
      <div
        style={{
          position: 'relative',
          width: 230,
          height: 120,
          perspective: 900,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Layer 1 (Bottom): Cyan/Blue Grid Plane */}
        <div
          style={{
            position: 'absolute',
            top: 25,
            left: 0,
            width: 175,
            height: 100,
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.8))',
            border: '1.5px solid rgba(191, 219, 254, 0.9)',
            boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.05)',
            transform: 'rotateX(55deg) rotateZ(-30deg) translateZ(-28px)',
            backgroundImage: `
              linear-gradient(to right, rgba(37, 99, 235, 0.16) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(37, 99, 235, 0.16) 1px, transparent 1px)
            `,
            backgroundSize: '14px 14px'
          }}
        />

        {/* Layer 2 (Middle): Wireframe Sketch Plate */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 24,
            width: 175,
            height: 100,
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: '1.5px solid rgba(203, 213, 225, 0.85)',
            boxShadow: '0 15px 20px -5px rgba(0, 0, 0, 0.08)',
            transform: 'rotateX(55deg) rotateZ(-30deg) translateZ(0px)',
            overflow: 'hidden'
          }}
        >
          <img
            src="/examples/ARCH/S2A/Input.jpg"
            alt="Wireframe Sketch"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.75,
              mixBlendMode: 'multiply'
            }}
          />
        </div>

        {/* Layer 3 (Top): Rendered Architectural Card */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 48,
            width: 175,
            height: 100,
            borderRadius: 12,
            background: '#FFFFFF',
            border: '2px solid #FFFFFF',
            boxShadow: '0 25px 35px -5px rgba(15, 23, 42, 0.22), 0 10px 15px -3px rgba(15, 23, 42, 0.12)',
            transform: 'rotateX(55deg) rotateZ(-30deg) translateZ(32px)',
            overflow: 'hidden'
          }}
        >
          <img
            src="/examples/ARCH/T2A/make%20a%20luxury%20villa%20with%203%20floors.png"
            alt="Output Render"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      {/* Blueprint Annotation Arrow: Sketch -> Render */}
      <div
        style={{
          position: 'absolute',
          bottom: 2,
          left: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#3B82F6',
          fontFamily: '"Caveat", "Architects Daughter", "Segoe UI", cursive, sans-serif',
          fontSize: 16,
          fontWeight: 700,
          fontStyle: 'italic',
          textShadow: '0 1px 2px rgba(255,255,255,0.9)',
          letterSpacing: '0.02em',
          transform: 'rotate(-4deg)'
        }}
      >
        <span>Sketch</span>
        <svg width="34" height="14" viewBox="0 0 34 14" fill="none">
          <path
            d="M2 7 C12 2, 22 12, 30 7 M26 4 L31 7 L27 11"
            stroke="#3B82F6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Render</span>
      </div>
    </div>
  );
};

interface TaskSelectionPageProps {
  currentProjectId: string;
  projectName?: string;
  categoryFilter?: 'all' | 'architecture' | 'interior' | 'furniture';
  onSelectTask: (taskId: string) => void;
  onBackToProjects: () => void;
}

export const TaskSelectionPage: React.FC<TaskSelectionPageProps> = ({
  currentProjectId,
  projectName = 'Modern Luxury Villa Conceptualization',
  categoryFilter = 'all',
  onSelectTask,
  onBackToProjects
}) => {
  const archTasks = ALL_TASKS.filter((t) => t.category === 'architecture');
  const interiorTasks = ALL_TASKS.filter((t) => t.category === 'interior');
  const furnitureTasks = ALL_TASKS.filter((t) => t.category === 'furniture');

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const renderSection = (
    key: string,
    numBadge: string,
    badgeColor: string,
    title: string,
    subtitle: string,
    tasks: TaskItem[]
  ) => {
    const isCollapsed = Boolean(collapsedCategories[key]);

    return (
      <section style={{ marginBottom: 44 }} key={key}>
        {/* Section Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Number Square Badge */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: badgeColor,
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 2px 8px ${badgeColor}33`,
                flexShrink: 0
              }}
            >
              {numBadge}
            </div>

            <div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: '#64748B',
                  margin: '2px 0 0 0',
                  lineHeight: 1.4
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Count Pill (e.g. 5 tasks ⌄) */}
          <button
            onClick={() => toggleCategory(key)}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 999,
              padding: '4px 12px',
              fontSize: 11.5,
              fontWeight: 600,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              transition: 'background 120ms ease, border-color 120ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
            title={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            <span>{tasks.length} tasks</span>
            <ChevronDown
              size={13}
              style={{
                color: '#64748B',
                transform: isCollapsed ? 'rotate(-90deg)' : 'none',
                transition: 'transform 150ms ease'
              }}
            />
          </button>
        </div>

        {/* 3-Column Task Cards Grid */}
        {!isCollapsed && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 20
            }}
            className="tasks-three-col-grid"
          >
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
                  cursor: 'pointer',
                  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -4px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Before/After Interactive Split Slider */}
                <TaskCardSlider
                  inputImage={task.inputImage}
                  outputImage={task.outputImage}
                  title={task.title}
                  isSampleOnly={task.isSampleOnly}
                />

                {/* Card Details */}
                <div
                  style={{
                    padding: '14px 16px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Code Badge + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span
                        style={{
                          background: '#0F172A',
                          color: '#FFFFFF',
                          fontSize: 10.5,
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, monospace)',
                          padding: '2px 6px',
                          borderRadius: 4,
                          letterSpacing: '0.02em',
                          flexShrink: 0
                        }}
                      >
                        {task.code}
                      </span>
                      <h3
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: '#0F172A',
                          margin: 0,
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={task.title}
                      >
                        {task.title}
                      </h3>
                    </div>

                    {/* Description (2 lines max) */}
                    <p
                      style={{
                        fontSize: 11.5,
                        color: '#64748B',
                        margin: '6px 0 14px 0',
                        lineHeight: 1.48,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 34
                      }}
                    >
                      {task.description}
                    </p>
                  </div>

                  {/* Card Footer: Specialized Pipeline & Start Workflow -> */}
                  <div
                    style={{
                      paddingTop: 10,
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        color: '#94A3B8',
                        fontSize: 11,
                        fontWeight: 500
                      }}
                    >
                      <Cpu size={12} style={{ color: '#94A3B8' }} />
                      <span>Specialized Pipeline</span>
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: '#2563EB',
                        transition: 'gap 150ms ease'
                      }}
                    >
                      Start Workflow <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#FAFAFA',
        padding: '24px 36px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: 1220, width: '100%' }}>
        {/* Top Navigation Bar: Back to Projects & Active Project Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          {/* Back Button */}
          <button
            onClick={onBackToProjects}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              transition: 'background 120ms ease, border-color 120ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <ArrowLeft size={14} /> Back to Projects
          </button>

          {/* Active Project Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: 8,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
            }}
          >
            <FolderOpen size={13} style={{ color: '#64748B' }} />
            <span style={{ fontSize: 12, color: '#64748B' }}>Active Project:</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
              {currentProjectId}
            </span>
            <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>• {projectName}</span>
          </div>
        </div>

        {/* Hero Banner: Title, Subtitle, and 3D Isometric Graphic */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            gap: 24,
            flexWrap: 'wrap'
          }}
        >
          {/* Left Text */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#2563EB',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 6
              }}
            >
              TASK WORKFLOW
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.025em',
                margin: 0,
                lineHeight: 1.15
              }}
            >
              Select Task Workflow
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: '#64748B',
                marginTop: 8,
                marginBottom: 0,
                maxWidth: 580,
                lineHeight: 1.5
              }}
            >
              Hover and slide across any card below to compare the input sketch vs generated output render before launching.
            </p>
          </div>

          {/* Right Floating Isometric Illustration */}
          <IsometricHeroGraphic />
        </div>

        {/* Category Sections */}
        {(categoryFilter === 'all' || categoryFilter === 'architecture') &&
          renderSection(
            'architecture',
            '1',
            '#2563EB',
            'Architecture Design Studio',
            'Exteriors, elevation synthesis, inpainting, and ultra-high-microtexture detail enhancements.',
            archTasks
          )}

        {(categoryFilter === 'all' || categoryFilter === 'interior') &&
          renderSection(
            'interior',
            '2',
            '#4F46E5',
            'Interior Designing Suite',
            'Perspective sketches to luxurious rooms, full redesigns, room makeovers, and element editing.',
            interiorTasks
          )}

        {(categoryFilter === 'all' || categoryFilter === 'furniture') &&
          renderSection(
            'furniture',
            '3',
            '#EA580C',
            'Furniture Rendering & Fabrication',
            'Hand-sketched furniture to commercial studio product renders, material modifications, and custom cabinetry.',
            furnitureTasks
          )}
      </div>
    </div>
  );
};
