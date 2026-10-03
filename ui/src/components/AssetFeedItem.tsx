import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Sparkles,
  Layers,
  Maximize2,
  Trash2,
  MoveHorizontal,
  X,
  Edit3,
  Copy,
  MoreHorizontal,
  Check,
  LayoutGrid
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { DotMatrixLoaderCard } from './DotMatrixLoaderCard';

export interface AssetRun {
  id: string;
  projectId?: string;
  isBookmarked?: boolean;
  taskId: string;
  taskTitle: string;
  category: string;
  timestamp: string;
  prompt: string;
  resolutionBadge: string;
  aspectBadge: string;
  images: Array<{
    url: string;
    b64?: string;
    label?: string;
    width?: number;
    height?: number;
  }>;
  inputImageUrl?: string;
  isMultiView?: boolean;
}

interface AssetFeedItemProps {
  run: AssetRun;
  zoomLevel: number;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onDelete?: (id: string, fileUrl?: string) => void;
  onToggleBookmark?: (id: string) => void;
  onOpenModal: (imgUrl: string, title: string, prompt: string) => void;
  onTriggerUpscale4k: (b64: string) => void;
  onUpdateAssetRun?: (updatedRun: AssetRun) => void;
}

export const AssetFeedItem: React.FC<AssetFeedItemProps> = ({
  run,
  zoomLevel,
  isSelected = false,
  onToggleSelect,
  onDelete,
  onToggleBookmark,
  onOpenModal,
  onTriggerUpscale4k,
  onUpdateAssetRun
}) => {
  const [localRun, setLocalRun] = useState<AssetRun>(run);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [copied, setCopied] = useState<boolean>(false);
  const [showImageMenu, setShowImageMenu] = useState<boolean>(false);

  // In-place edit state
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState<boolean>(false);
  const [editInstruction, setEditInstruction] = useState<string>('');
  const [editDenoise, setEditDenoise] = useState<number>(1.0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const popoverRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const imageMenuRef = useRef<HTMLDivElement>(null);

  // Sync localRun if parent run prop updates externally
  useEffect(() => {
    setLocalRun(run);
  }, [run]);

  // Focus textarea when popover opens
  useEffect(() => {
    if (isEditPopoverOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isEditPopoverOpen]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsEditPopoverOpen(false);
      }
      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node)) {
        setShowImageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = (e: React.MouseEvent, url: string, filename?: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `render_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(localRun.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this generated asset?')) {
      if (onDelete) {
        onDelete(localRun.id, localRun.images[0]?.url);
      }
    }
  };

  const getCategorySuggestions = () => {
    const cat = (localRun.category || '').toLowerCase();
    const taskId = (localRun.taskId || '').toLowerCase();
    if (cat.includes('interior') || taskId.includes('interior')) {
      return [
        'Add Calacatta marble surfaces',
        'Warm oak chevron hardwood floor',
        'Recessed LED cove ceiling lights',
        'Japandi minimalist indoor plants',
        'Cozy evening twilight ambience'
      ];
    }
    if (cat.includes('furniture') || taskId.includes('furniture')) {
      return [
        'Deep emerald velvet fabric',
        'Solid dark walnut wood frame',
        'Brushed brass accents & feet',
        'Cognac top-grain Italian leather',
        'Minimalist matte black metal'
      ];
    }
    return [
      'Add infinity swimming pool in front',
      'Dark charred timber facade louvers',
      'Golden hour twilight sunset sky',
      'Rooftop garden with lush greenery',
      'Floor-to-ceiling panoramic glass panels'
    ];
  };

  const handleAddChip = (text: string) => {
    setEditInstruction((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      if (trimmed.endsWith('.')) return `${trimmed} ${text}`;
      return `${trimmed}, ${text}`;
    });
    textareaRef.current?.focus();
  };

  // Trigger in-place edit request to backend
  const handleApplyEdit = async () => {
    if (!editInstruction.trim() || isEditing) return;

    const currentImg = localRun.images[0];
    if (!currentImg) {
      alert('No image found in this card to edit.');
      return;
    }

    setIsEditPopoverOpen(false);
    setIsEditing(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let b64 = currentImg.b64;
      if (!b64 && currentImg.url) {
        try {
          const res = await fetch(currentImg.url);
          const blob = await res.blob();
          b64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn('Could not read image blob, server will use image_urls:', err);
        }
      }

      let editTaskId = 'arch_image_edit';
      let editTaskTitle = 'Architecture Inpainting Edit';
      const cat = (localRun.category || '').toLowerCase();
      const tId = (localRun.taskId || '').toLowerCase();

      if (cat.includes('interior') || tId.includes('interior')) {
        editTaskId = 'interior_image_edit';
        editTaskTitle = 'Interior Design Image Edit';
      } else if (cat.includes('furniture') || tId.includes('furniture')) {
        editTaskId = 'furniture_edit';
        editTaskTitle = 'Furniture Design Image Edit';
      }

      const imgWidth = currentImg.width || 1024;
      const imgHeight = currentImg.height || 1024;

      const reqBody = {
        task_id: editTaskId,
        prompt: editInstruction.trim(),
        images_base64: b64 ? [b64] : [],
        image_urls: currentImg.url ? [currentImg.url] : [],
        project_id: localRun.projectId || 'PRJ-1001',
        denoise: editDenoise,
        width: imgWidth,
        height: imgHeight,
        steps: 25,
        model: 'qwen'
      };

      const res = await fetch('/api/v1/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
        signal: controller.signal
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errData.detail || `Server returned error status ${res.status}`);
      }

      const data = await res.json();
      const newImageUrl = data.file_url || data.image_base64;
      const preEditUrl = currentImg.url || currentImg.b64;

      const updatedRun: AssetRun = {
        ...localRun,
        id: data.file_url ? data.file_url.split('/').pop() : `edit_${Date.now()}`,
        taskTitle: editTaskTitle,
        prompt: `${localRun.prompt} [Edit: ${editInstruction.trim()}]`,
        timestamp: 'Just now',
        inputImageUrl: preEditUrl,
        images: [
          {
            url: newImageUrl,
            b64: data.image_base64,
            label: 'AI Inpainting Output',
            width: data.width,
            height: data.height
          }
        ]
      };

      setLocalRun(updatedRun);
      setViewMode('compare');
      if (onUpdateAssetRun) {
        onUpdateAssetRun(updatedRun);
      }
      setEditInstruction('');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Edit cancelled by user');
      } else {
        console.error('In-place edit failed:', err);
        alert(`Edit Failed: ${err.message || 'Error communicating with model server.'}`);
      }
    } finally {
      setIsEditing(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopEdit = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    try {
      await fetch('/api/v1/generation/stop', { method: 'POST' });
    } catch (err) {
      console.warn('Stop generation request notice:', err);
    }
    setIsEditing(false);
  };

  // Determine if this run has an input image to show side-by-side
  const hasInputImage = Boolean(
    localRun.inputImageUrl &&
    !localRun.taskId.includes('_text_to_') &&
    localRun.inputImageUrl !== localRun.images[0]?.url
  );

  // Compute exact resolution text to match mockup: e.g. 1216 x 864 or 1024 x 1024
  const resLabel = localRun.images[0]?.width && localRun.images[0]?.height
    ? `${localRun.images[0].width} x ${localRun.images[0].height}`
    : localRun.resolutionBadge === '1k'
    ? '1024 x 1024'
    : localRun.resolutionBadge.toUpperCase();

  return (
    <div
      className={`asset-run-card ${isSelected ? 'selected' : ''}`}
      style={{
        borderRadius: 12,
        padding: '16px 0 24px 0',
        background: 'transparent',
        transition: 'all 150ms ease'
      }}
    >
      {/* Top Header Matching Exact Reference Mockup */}
      <div
        className="asset-run-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 6
        }}
      >
        {/* Left Side: Checkbox + Title • Timestamp + Project Badge + Grid/Compare Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="checkbox"
            className="asset-checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect && onToggleSelect(localRun.id)}
            title="Select asset"
            style={{
              width: 16,
              height: 16,
              accentColor: '#111827',
              cursor: 'pointer',
              borderRadius: 4
            }}
          />

          <span style={{ fontWeight: 700, fontSize: 13.5, color: '#111827' }}>
            {localRun.taskTitle} <span style={{ color: '#9CA3AF', margin: '0 2px' }}>•</span>{' '}
            <span style={{ color: '#6B7280', fontWeight: 400, fontSize: 12.5 }}>{localRun.timestamp}</span>
          </span>

          {localRun.projectId && (
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 600,
                fontSize: 11,
                background: '#F3F4F6',
                color: '#4B5563',
                border: '1px solid #E5E7EB',
                padding: '2px 8px',
                borderRadius: 6
              }}
              title={`Project ID: ${localRun.projectId}`}
            >
              {localRun.projectId}
            </span>
          )}

          {hasInputImage && (
            <div
              style={{
                display: 'inline-flex',
                background: '#F3F4F6',
                borderRadius: 6,
                padding: 2,
                gap: 2,
                marginLeft: 4
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontWeight: viewMode === 'grid' ? 700 : 500,
                  background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'grid' ? '#111827' : '#6B7280',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <LayoutGrid size={11} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compare')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontWeight: viewMode === 'compare' ? 700 : 500,
                  background: viewMode === 'compare' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'compare' ? '#111827' : '#6B7280',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  boxShadow: viewMode === 'compare' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <MoveHorizontal size={11} /> Comparison Slider
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Resolution + Aspect Ratio Badges + Action Buttons: [Edit] [Download] [Copy] [Trash] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 500,
              fontSize: 11,
              background: '#F3F4F6',
              color: '#4B5563',
              border: '1px solid #E5E7EB',
              padding: '2px 8px',
              borderRadius: 6
            }}
          >
            {resLabel}
          </span>

          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 500,
              fontSize: 11,
              background: '#F3F4F6',
              color: '#4B5563',
              border: '1px solid #E5E7EB',
              padding: '2px 8px',
              borderRadius: 6
            }}
          >
            {localRun.aspectBadge || '1:1'}
          </span>

          {/* Edit Button with Floating Inpainting Popover */}
          <div style={{ position: 'relative' }} ref={popoverRef}>
            <button
              type="button"
              className="icon-btn edit-asset-btn"
              title="Edit render with AI"
              onClick={() => setIsEditPopoverOpen((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                fontSize: 12,
                fontWeight: 600,
                background: isEditPopoverOpen ? '#111827' : '#FFFFFF',
                color: isEditPopoverOpen ? '#FFFFFF' : '#1F2937',
                border: isEditPopoverOpen ? '1px solid #111827' : '1px solid #D1D5DB',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isEditPopoverOpen ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <Edit3 size={12} style={{ color: isEditPopoverOpen ? '#38BDF8' : '#2563EB' }} />
              <span>Edit</span>
            </button>

            {/* In-Place AI Inpainting Popover */}
            {isEditPopoverOpen && (
              <div
                className="floating-edit-popover"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 9px)',
                  right: 0,
                  width: 380,
                  maxWidth: '92vw',
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 20px 35px -8px rgba(0, 0, 0, 0.18), 0 6px 16px -4px rgba(0, 0, 0, 0.08)',
                  padding: '16px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  textAlign: 'start'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: 22,
                    width: 12,
                    height: 12,
                    background: '#FFFFFF',
                    borderLeft: '1px solid #E5E7EB',
                    borderTop: '1px solid #E5E7EB',
                    transform: 'rotate(45deg)'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: '#111827' }}>
                    <Sparkles size={14} style={{ color: '#2563EB' }} />
                    <span>In-Place AI Inpaint &amp; Redesign</span>
                  </div>
                  <button
                    onClick={() => setIsEditPopoverOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 2 }}
                  >
                    <X size={15} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Edit Instruction</label>
                  <textarea
                    ref={textareaRef}
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    placeholder="e.g., Add modern wooden louvers, change floor to Italian white marble..."
                    style={{
                      width: '100%',
                      minHeight: 70,
                      padding: '8px 10px',
                      fontSize: 12,
                      borderRadius: 8,
                      border: '1px solid #D1D5DB',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                    <span>Inpainting Precision</span>
                    <span style={{ color: '#111827', fontFamily: 'monospace' }}>{editDenoise.toFixed(2)}</span>
                  </div>

                  {/* Preset Pills */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    {[
                      { label: 'Full Inpaint (1.0)', val: 1.0 },
                      { label: 'Balanced (0.80)', val: 0.8 },
                      { label: 'Subtle (0.60)', val: 0.6 }
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setEditDenoise(p.val)}
                        style={{
                          flex: 1,
                          padding: '4px 6px',
                          fontSize: 10.5,
                          fontWeight: editDenoise === p.val ? 700 : 500,
                          borderRadius: 6,
                          border: editDenoise === p.val ? '1px solid #111827' : '1px solid #E5E7EB',
                          background: editDenoise === p.val ? '#111827' : '#F9FAFB',
                          color: editDenoise === p.val ? '#FFFFFF' : '#4B5563',
                          cursor: 'pointer',
                          transition: 'all 120ms ease'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min={0.3}
                    max={1.0}
                    step={0.05}
                    value={editDenoise}
                    onChange={(e) => setEditDenoise(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#111827', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                    <span>Subtle Retouch</span>
                    <span>Complete Inpainting (Recommended)</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>
                    Quick Architectural Suggestions:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {getCategorySuggestions().map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddChip(sug)}
                        style={{
                          background: '#F3F4F6',
                          border: '1px solid #E5E7EB',
                          borderRadius: 9999,
                          padding: '3px 9px',
                          fontSize: 11,
                          color: '#374151',
                          cursor: 'pointer'
                        }}
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 4, paddingTop: 10, borderTop: '1px solid #F3F4F6' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditPopoverOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '6px 12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyEdit}
                    disabled={!editInstruction.trim() || isEditing}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: editInstruction.trim() && !isEditing ? '#0F172A' : '#9CA3AF',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 7,
                      padding: '7px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: editInstruction.trim() && !isEditing ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Apply Edit</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            type="button"
            className="icon-btn"
            title="Download Asset Image"
            onClick={(e) => handleDownload(e, localRun.images[0]?.url)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#4B5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Download size={13} />
          </button>

          {/* Copy Prompt Button */}
          <button
            type="button"
            className="icon-btn"
            title="Copy prompt text to clipboard"
            onClick={handleCopy}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: copied ? '#10B981' : '#4B5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            className="icon-btn"
            title="Delete this Asset"
            onClick={handleDelete}
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
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Prompt Preview Line Matching Reference Mockup */}
      <p
        style={{
          fontSize: 13,
          color: '#4B5563',
          margin: '0 0 12px 0',
          lineHeight: 1.5,
          fontWeight: 400
        }}
        title={localRun.prompt}
      >
        {localRun.prompt}
      </p>

      {/* Main Visuals Area */}
      {isEditing ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              borderRadius: 8,
              color: '#4338CA',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14
            }}
          >
            <Sparkles size={13} />
            <span>AI Inpainting Edit in progress: &ldquo;{editInstruction}&rdquo;</span>
          </div>
          <DotMatrixLoaderCard
            onStop={handleStopEdit}
            onCancel={handleStopEdit}
            prompt={editInstruction}
            taskCode={localRun.taskId}
          />
        </div>
      ) : viewMode === 'compare' && hasInputImage && localRun.images[0] ? (
        <BeforeAfterSlider
          beforeUrl={localRun.inputImageUrl!}
          afterUrl={localRun.images[0].url}
          beforeLabel="Input Reference"
          afterLabel={`${localRun.taskTitle} Output`}
          onOpenModal={(url, title) => onOpenModal(url, title, localRun.prompt)}
        />
      ) : (
        /* Image Grid: 2 Equal Columns for Dual-image tasks; Single Column matching width for text-to-arch */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasInputImage ? 'repeat(2, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
            gap: 16,
            width: '100%'
          }}
        >
          {/* 1. Input Reference Sketch (When applicable) */}
          {hasInputImage && localRun.inputImageUrl && (
            <div
              className="asset-image-card"
              style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                aspectRatio: localRun.aspectBadge === '9:16' ? '9/16' : localRun.aspectBadge === '16:9' ? '16/9' : '1/1'
              }}
              onClick={() => onOpenModal(localRun.inputImageUrl!, `${localRun.taskTitle} (Input Reference)`, localRun.prompt)}
            >
              <img
                src={localRun.inputImageUrl}
                alt="Input Reference"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              {/* Top-Left Dark Blue Pill Badge: ✎ Input */}
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  zIndex: 5
                }}
              >
                <Edit3 size={11} />
                <span>Input</span>
              </div>
            </div>
          )}

          {/* 2. Output Render Image */}
          {localRun.images[0] && (
            <div
              className="asset-image-card"
              style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                aspectRatio: localRun.aspectBadge === '9:16' ? '9/16' : localRun.aspectBadge === '16:9' ? '16/9' : '1/1'
              }}
              onClick={() => onOpenModal(localRun.images[0].url, `${localRun.taskTitle} Output`, localRun.prompt)}
            >
              <img
                src={localRun.images[0].url}
                alt={localRun.taskTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
                onError={(e) => {
                  if (localRun.images[0].b64 && e.currentTarget.src !== localRun.images[0].b64) {
                    e.currentTarget.src = localRun.images[0].b64;
                  }
                }}
              />

              {/* Top-Left Vibrant Blue Pill Badge: ✦ Output (shown if input exists) */}
              {hasInputImage && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(37, 99, 235, 0.95)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                    zIndex: 5
                  }}
                >
                  <Sparkles size={11} />
                  <span>Output</span>
                </div>
              )}

              {/* Top-Right Menu Button: ••• */}
              <div
                ref={imageMenuRef}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setShowImageMenu((prev) => !prev)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                    transition: 'all 150ms ease'
                  }}
                  title="More actions"
                >
                  <MoreHorizontal size={15} />
                </button>

                {showImageMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 36,
                      right: 0,
                      background: '#FFFFFF',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                      padding: 5,
                      minWidth: 175,
                      zIndex: 30,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowImageMenu(false);
                        onOpenModal(localRun.images[0].url, `${localRun.taskTitle} Output`, localRun.prompt);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '7px 10px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#1E293B',
                        borderRadius: 6,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Maximize2 size={13} />
                      <span>Inspect Fullscreen</span>
                    </button>

                    {localRun.images[0]?.b64 && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowImageMenu(false);
                          onTriggerUpscale4k(localRun.images[0].b64!);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '7px 10px',
                          border: 'none',
                          background: 'transparent',
                          fontSize: 12,
                          fontWeight: 500,
                          color: '#2563EB',
                          borderRadius: 6,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Sparkles size={13} />
                        <span>4K Latent Tile Refine</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        setShowImageMenu(false);
                        handleDownload(e, localRun.images[0]?.url);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '7px 10px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#1E293B',
                        borderRadius: 6,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Download size={13} />
                      <span>Download PNG</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
