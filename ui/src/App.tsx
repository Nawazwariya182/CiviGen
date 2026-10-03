import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Sliders,
  Code,
  Download,
  Copy,
  Check,
  Layers,
  Cpu,
  Bookmark,
  Trash2,
  Filter,
  Grid,
  Columns,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Maximize2,
  RefreshCw,
  FolderOpen,
  Square,
  Sun,
  Palette,
  Compass,
  ArrowLeft,
  LayoutGrid,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Agentation } from 'agentation';
import { ApiPlaygroundTab } from './components/ApiPlaygroundTab';
import { AssetFeedItem, AssetRun } from './components/AssetFeedItem';
import { CustomSelect, SelectOption } from './components/CustomSelect';
import { CustomSlider } from './components/CustomSlider';
import { CustomSwitch } from './components/CustomSwitch';
import { Magnet } from './components/Magnet';
import { AppsHubPage } from './components/AppsHubPage';
import { ProjectsPortalPage, ProjectItem } from './components/ProjectsPortalPage';
import { TaskSelectionPage } from './components/TaskSelectionPage';
import { LibraryPage } from './components/LibraryPage';
import { ProjectsDrawer } from './components/ProjectsDrawer';
import { DotMatrixLoaderCard } from './components/DotMatrixLoaderCard';
import { QwenLogo } from './components/ModelLogos';
import {
  AspectRatioCards,
  ResolutionCards,
  StylePresetCards,
  LightingPresetCards
} from './components/ScrollableCards';
import {
  TASK_SHORT_CODES,
  SHORT_CODE_TO_TASK_ID,
  SUITE_TASKS,
  TASK_EXAMPLE_IMAGES,
  TASK_INPUT_IMAGES
} from './taskConstants';
import { getPresetsForCategory, EditPreset } from './presets/editPresets';

interface TaskDef {
  id: string;
  category: string;
  title: string;
  description: string;
  example_prompt: string;
  default_model: string;
  default_width: number;
  default_height: number;
  default_steps: number;
  default_cfg: number;
  default_denoise: number;
  requires_image: boolean;
}

// Helper function to resolve default example input for tasks that take sketches/images
export const getTaskDefaultInput = (taskId: string): string | undefined => {
  return TASK_INPUT_IMAGES[taskId];
};

interface ParsedRoute {
  view: 'projects' | 'tasks' | 'studio';
  projectId?: string;
  prefix: string; // 'pjk' | 'prj'
  taskId?: string;
  tab?: 'assets' | 'api' | 'library';
}

export const parseUrlRoute = (pathname: string): ParsedRoute => {
  const parts = pathname.split('/').filter(Boolean);
  // Example: ['library'], ['api'], ['pjk-1002', 'tasks', 'S2F'] or ['prj-1002', 'tasks'] or ['projects'] or []
  if (parts.length >= 1 && parts[0].toLowerCase() === 'library') {
    return { view: 'projects', prefix: 'prj', tab: 'library' };
  }

  if (parts.length >= 1 && parts[0].toLowerCase() === 'api') {
    return { view: 'projects', prefix: 'prj', tab: 'api' };
  }

  if (parts.length >= 2 && parts[1].toLowerCase() === 'tasks') {
    const rawProj = parts[0];
    const prefix = rawProj.toLowerCase().startsWith('pjk') ? 'pjk' : 'prj';
    const num = rawProj.replace(/\D/g, '') || '1001';
    const projId = `PRJ-${num}`;

    if (parts.length >= 3) {
      const shortCode = parts[2].toUpperCase();
      const mappedTaskId = SHORT_CODE_TO_TASK_ID[shortCode];
      return {
        view: 'studio',
        projectId: projId,
        prefix,
        taskId: mappedTaskId || 'arch_text_to_arch',
        tab: 'assets'
      };
    }

    return {
      view: 'tasks',
      projectId: projId,
      prefix,
      tab: 'assets'
    };
  }

  if (parts.length >= 1 && parts[0].toLowerCase() === 'projects') {
    return { view: 'projects', prefix: 'prj', tab: 'assets' };
  }

  return {
    view: 'projects',
    prefix: 'prj',
    tab: 'assets'
  };
};

export function App() {
  const initialRoute = React.useMemo(() => parseUrlRoute(window.location.pathname), []);

  // URL Prefix: 'pjk' or 'prj' (preserves user preference e.g. pjk-1002)
  const [urlPrefix, setUrlPrefix] = useState<string>(initialRoute.prefix);

  // Navigation & View Modes: 'projects' | 'tasks' | 'studio'
  const [currentView, setCurrentView] = useState<'projects' | 'tasks' | 'studio'>(initialRoute.view);
  const [activeTab, setActiveTab] = useState<'assets' | 'api' | 'library'>(initialRoute.tab || 'assets');
  const [activeSuite, setActiveSuite] = useState<'all' | 'architecture' | 'interior_furniture'>('all');

  // Resizable Sidebar
  const [sidebarWidth, setSidebarWidth] = useState<number>(340);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Project Management
  const [currentProjectId, setCurrentProjectId] = useState<string>(initialRoute.projectId || 'PRJ-1001');
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const defaultList: ProjectItem[] = [
      {
        id: 'PRJ-1003',
        name: 'New',
        category: 'architecture',
        description: 'Modern commercial building concept with glass facade and landscape design.',
        createdAt: new Date('2026-10-03T09:00:00').getTime(),
        count: 9
      },
      {
        id: 'PRJ-1001',
        name: 'Modern Luxury Villa Conceptualization',
        category: 'architecture',
        description: 'Multi-story modern glass villa, concrete textures, and spatial layouts.',
        createdAt: new Date('2026-10-02T14:30:00').getTime(),
        count: 7
      },
      {
        id: 'PRJ-1002',
        name: 'Scandinavian Penthouse & Furniture',
        category: 'interior',
        description: 'Warm minimalist living space makeover and bespoke furniture prototypes.',
        createdAt: new Date('2026-10-01T11:00:00').getTime(),
        count: 0
      }
    ];
    const saved = localStorage.getItem('ai_arch_projects_list');
    if (saved) {
      try {
        const parsed: ProjectItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const has1003 = parsed.some((p) => p.id === 'PRJ-1003');
          if (!has1003) {
            return [defaultList[0], ...parsed];
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return defaultList;
  });

  useEffect(() => {
    localStorage.setItem('ai_arch_projects_list', JSON.stringify(projects));
  }, [projects]);

  const activeProjectObj = projects.find((p) => p.id === currentProjectId);
  const [isProjectsDrawerOpen, setIsProjectsDrawerOpen] = useState<boolean>(false);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false);
  const [showAppMenu, setShowAppMenu] = useState<boolean>(false);

  // Workspace controls
  const [zoomLevel, setZoomLevel] = useState<number>(3); // 1 to 5
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'architecture' | 'interior' | 'furniture'>('all');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<'all' | 'architecture' | 'interior' | 'furniture'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  // Model & Task
  const [model, setModel] = useState<string>('qwen');
  const [tasks, setTasks] = useState<Record<string, TaskDef>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialRoute.taskId || 'arch_text_to_arch');

  // Prompts
  const [prompt, setPrompt] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [presetTypeFilter, setPresetTypeFilter] = useState<'all' | 'lighting' | 'materials' | 'features' | 'refine'>('all');
  const [isPresetDrawerOpen, setIsPresetDrawerOpen] = useState<boolean>(true);

  // Reference Images
  const [referenceImages, setReferenceImages] = useState<Array<{ id: string; name: string; base64: string; width?: number; height?: number }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [aspectRatio, setAspectRatio] = useState<string>('auto');
  const [detectedRatio, setDetectedRatio] = useState<string>('1:1');
  const [resolution, setResolution] = useState<string>('1K');
  const [stylePreset, setStylePreset] = useState<string>('auto');
  const [lightingPreset, setLightingPreset] = useState<string>('auto');

  // Advanced Settings Accordion
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(25);
  const [cfg, setCfg] = useState<number>(1.0);
  const [denoise, setDenoise] = useState<number>(1.0);
  const [seed, setSeed] = useState<number>(-1);
  const [isRandomSeed, setIsRandomSeed] = useState<boolean>(true);
  const [tiledVae, setTiledVae] = useState<boolean>(false);
  const [upscale4k, setUpscale4k] = useState<boolean>(false);

  // Generation & Feed State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [assetRuns, setAssetRuns] = useState<AssetRun[]>([]);
  const [selectedRunIds, setSelectedRunIds] = useState<Set<string>>(new Set());
  const [modalImage, setModalImage] = useState<{ url: string; title: string; prompt: string } | null>(null);

  // Synchronize browser URL bar with current view, project, and task (e.g. /pjk-1002/tasks/S2F)
  useEffect(() => {
    let targetPath = '/';
    const num = currentProjectId.replace(/\D/g, '') || '1001';
    const projSlug = `${urlPrefix}-${num}`;
    const taskCode = TASK_SHORT_CODES[selectedTaskId] || 'T2A';

    if (activeTab === 'library') {
      targetPath = '/library';
    } else if (activeTab === 'api') {
      targetPath = '/api';
    } else if (currentView === 'projects') {
      targetPath = '/';
    } else if (currentView === 'tasks') {
      targetPath = `/${projSlug}/tasks`;
    } else if (currentView === 'studio') {
      targetPath = `/${projSlug}/tasks/${taskCode}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({ currentView, currentProjectId, selectedTaskId, urlPrefix, activeTab }, '', targetPath);
    }
  }, [currentView, currentProjectId, selectedTaskId, urlPrefix, activeTab]);

  // Handle browser Back / Forward history navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseUrlRoute(window.location.pathname);
      if (route.prefix) setUrlPrefix(route.prefix);
      if (route.projectId) setCurrentProjectId(route.projectId);
      if (route.taskId) setSelectedTaskId(route.taskId);
      if (route.tab) {
        setActiveTab(route.tab);
      } else {
        setActiveTab('assets');
      }
      setCurrentView(route.view);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Resizable Sidebar Listeners
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(260, Math.min(e.clientX, 650));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Load Saved Outputs on Mount (Notice: example images are NOT loaded into the feed!)
  useEffect(() => {
    const fetchTasksAndSavedOutputs = async () => {
      try {
        const [taskRes, outRes] = await Promise.all([
          fetch('/api/v1/tasks'),
          fetch('/api/v1/outputs')
        ]);

        if (taskRes.ok) {
          const taskData = await taskRes.json();
          setTasks(taskData.tasks || {});
        }

        const loadedRuns: AssetRun[] = [];

        // Load Real Saved Outputs from Server for projects
        if (outRes.ok) {
          const outData = await outRes.json();
          if (outData.outputs && outData.outputs.length > 0) {
            outData.outputs.forEach((out: any) => {
              const inputImg = out.input_image_url || undefined;
              loadedRuns.push({
                id: out.id || out.filename,
                projectId: out.project_id || 'PRJ-1001',
                taskId: out.task_id || 'arch_text_to_arch',
                taskTitle: out.task_title || 'Generated Render',
                category: out.category || 'architecture',
                timestamp: out.timestamp ? new Date(out.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Saved',
                prompt: out.prompt || 'Architectural visual',
                resolutionBadge: out.resolution || '1k',
                aspectBadge: '1:1',
                inputImageUrl: inputImg,
                images: [
                  {
                    url: out.file_url,
                    label: 'Saved Render',
                    width: out.width,
                    height: out.height
                  }
                ]
              });
            });
          }
        }

        setAssetRuns(loadedRuns);
      } catch (err) {
        console.error('Error fetching initial assets:', err);
      }
    };

    fetchTasksAndSavedOutputs();

    // Check if generation is actively ongoing on the backend (e.g. user refreshed the page)
    const checkActiveGeneration = async () => {
      try {
        const progRes = await fetch('/api/v1/generation-progress');
        if (progRes.ok) {
          const progData = await progRes.json();
          if (progData.is_generating) {
            console.log('Restoring active generation after page refresh:', progData);
            setIsGenerating(true);
            setCurrentView('studio');
            setActiveTab('assets');

            const savedStr = localStorage.getItem('civigen_active_generation');
            if (savedStr) {
              try {
                const saved = JSON.parse(savedStr);
                if (saved.projectId) setCurrentProjectId(saved.projectId);
                if (saved.taskId) setSelectedTaskId(saved.taskId);
                if (saved.prompt) setPrompt(saved.prompt);
              } catch {}
            }
          }
        }
      } catch (err) {
        console.warn('Active generation check error:', err);
      }
    };

    checkActiveGeneration();
  }, []);

  // Background watcher: keeps generation active and reloads outputs when done (even if page was refreshed)
  useEffect(() => {
    if (!isGenerating) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const progRes = await fetch('/api/v1/generation-progress');
        if (progRes.ok) {
          const progData = await progRes.json();
          if (isMounted && !progData.is_generating) {
            console.log('Backend finished generation, reloading outputs...');
            clearInterval(interval);

            // Re-fetch outputs from backend so the fresh render is in the feed
            const outRes = await fetch('/api/v1/outputs');
            if (outRes.ok) {
              const outData = await outRes.json();
              if (outData.outputs && outData.outputs.length > 0) {
                const refreshedRuns: AssetRun[] = outData.outputs.map((out: any) => ({
                  id: out.id || out.filename,
                  projectId: out.project_id || currentProjectId,
                  taskId: out.task_id || selectedTaskId,
                  taskTitle: out.task_title || 'Generated Render',
                  category: out.category || 'architecture',
                  timestamp: out.timestamp ? new Date(out.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
                  prompt: out.prompt || prompt,
                  resolutionBadge: out.resolution || '1k',
                  aspectBadge: '1:1',
                  inputImageUrl: out.input_image_url || undefined,
                  images: [
                    {
                      url: out.file_url,
                      label: 'AI Output',
                      width: out.width,
                      height: out.height
                    }
                  ]
                }));
                setAssetRuns((prev) => {
                  const refreshedIds = new Set(refreshedRuns.map((r) => r.id));
                  const sessionRuns = prev.filter((r) => !refreshedIds.has(r.id));
                  return [...refreshedRuns, ...sessionRuns];
                });
              }
            }

            localStorage.removeItem('civigen_active_generation');
            setIsGenerating(false);
          }
        }
      } catch (err) {
        console.warn('Generation watcher poll error:', err);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isGenerating, currentProjectId, selectedTaskId, prompt]);

  // Project Creation & Portal Handlers
  const handleSelectProjectFromPortal = (projId: string) => {
    setCurrentProjectId(projId);
    setCurrentView('tasks');
  };

  const handleCreateProjectFromPortal = (name: string, category: string, description?: string) => {
    const nextNum = projects.length > 0
      ? Math.max(...projects.map((p) => parseInt(p.id.replace(/\D/g, '') || '1000', 10))) + 1
      : 1001;
    const newId = `PRJ-${nextNum}`;
    const newProj: ProjectItem = {
      id: newId,
      name,
      category,
      description,
      createdAt: Date.now()
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newId);
    setCurrentView('tasks');
  };

  const handleDeleteProjectFromPortal = (projId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projId));
    setAssetRuns((prev) => prev.filter((r) => r.projectId !== projId));
    if (currentProjectId === projId) {
      const remaining = projects.filter((p) => p.id !== projId);
      if (remaining.length > 0) {
        setCurrentProjectId(remaining[0].id);
      }
    }
  };

  const handleUpdateProject = (projId: string, updates: Partial<ProjectItem>) => {
    setProjects((prev) => prev.map((p) => (p.id === projId ? { ...p, ...updates } : p)));
  };

  const handleSelectTaskFromSelectionPage = (taskId: string) => {
    handleTaskChange(taskId);
    setCurrentView('studio');
    setActiveTab('assets');
  };

  const handleCreateNewProject = () => {
    const nextNum = projects.length > 0
      ? Math.max(...projects.map((p) => parseInt(p.id.replace(/\D/g, '') || '1000', 10))) + 1
      : 1001;
    const newId = `PRJ-${nextNum}`;
    const newProj: ProjectItem = {
      id: newId,
      name: `Project ${newId}`,
      createdAt: Date.now()
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newId);
    setCurrentView('tasks');
    setIsProjectsDrawerOpen(false);
  };

  // Launch Suite from Apps Hub
  const handleSelectAppFromHub = (suite: 'architecture' | 'interior_furniture', taskId: string) => {
    setActiveSuite(suite);
    handleTaskChange(taskId);
    setCurrentView('studio');
    setActiveTab('assets');
  };

  // Update prompt & defaults when task changes
  const handleTaskChange = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = tasks[taskId];
    if (task) {
      setPrompt(task.example_prompt || '');
      setSteps(task.default_steps || 25);
      setCfg(task.default_cfg || 1.0);
      setDenoise(task.default_denoise || 1.0);
      setModel(task.default_model || 'qwen');
    }
  };

  // Helper to measure image aspect ratio
  const detectImageRatio = (imgElement: HTMLImageElement): string => {
    const r = imgElement.width / imgElement.height;
    if (Math.abs(r - 1.0) < 0.08) return '1:1';
    if (Math.abs(r - 1.77) < 0.12) return '16:9';
    if (Math.abs(r - 0.56) < 0.08) return '9:16';
    if (Math.abs(r - 1.5) < 0.08) return '3:2';
    if (Math.abs(r - 0.67) < 0.08) return '2:3';
    if (Math.abs(r - 1.33) < 0.08) return '4:3';
    if (Math.abs(r - 0.75) < 0.08) return '3:4';
    if (Math.abs(r - 1.25) < 0.08) return '5:4';
    if (Math.abs(r - 0.8) < 0.08) return '4:5';
    if (Math.abs(r - 2.33) < 0.15) return '21:9';
    if (Math.abs(r - 2.0) < 0.12) return '2:1';
    if (Math.abs(r - 0.5) < 0.08) return '1:2';
    if (r > 2.6) return '32:9';
    if (r > 1.2) return '16:9';
    if (r < 0.8) return '9:16';
    return '1:1';
  };

  // 1-Click Load Example Image for current task into editor (does not pollute feed)
  const handleLoadExample = async () => {
    const task = tasks[selectedTaskId];
    if (!task) return;
    try {
      const res = await fetch('/api/v1/examples');
      const data = await res.json();
      const currentEx = data.examples?.find((e: any) => e.task_id === selectedTaskId);
      if (currentEx && currentEx.input_file_url) {
        const imgRes = await fetch(currentEx.input_file_url);
        const blob = await imgRes.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const b64 = reader.result as string;
          const img = new Image();
          img.onload = () => {
            const detected = detectImageRatio(img);
            setDetectedRatio(detected);
            setReferenceImages([{
              id: 'example_input',
              name: 'Example Input',
              base64: b64,
              width: img.width,
              height: img.height
            }]);
          };
          img.src = b64;
        };
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      console.error('Failed to load example image:', err);
    }
  };

  // Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const detected = detectImageRatio(img);
          setDetectedRatio(detected);
          setReferenceImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              name: file.name,
              base64: b64,
              width: img.width,
              height: img.height
            }
          ]);
        };
        img.src = b64;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReferenceImage = (id: string) => {
    setReferenceImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length === 0) {
        setDetectedRatio('1:1');
      }
      return filtered;
    });
  };

  // Enhance Prompt Action
  const handleEnhancePrompt = async () => {
    if (isEnhancing) return;
    setIsEnhancing(true);
    try {
      const s = stylePreset === 'auto' ? '' : stylePreset;
      const l = lightingPreset === 'auto' ? '' : lightingPreset;
      const res = await fetch(`/api/v1/enhance-prompt?prompt=${encodeURIComponent(prompt || '')}&style=${encodeURIComponent(s)}&lighting=${encodeURIComponent(l)}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setPrompt(data.enhanced_prompt);
      }
    } catch (err) {
      console.error('Enhance failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Dimensions based on Aspect Ratio and Resolution
  const calculateDimensions = () => {
    const base = resolution === '2K' ? 1536 : 1024;
    let ratio = aspectRatio;

    if (ratio === 'auto') {
      if (referenceImages.length > 0 && referenceImages[0].width && referenceImages[0].height) {
        const refW = referenceImages[0].width;
        const refH = referenceImages[0].height;
        let w = base;
        let h = base;
        if (refW >= refH) {
          w = base;
          h = Math.max(512, Math.round((base * (refH / refW)) / 32) * 32);
        } else {
          h = base;
          w = Math.max(512, Math.round((base * (refW / refH)) / 32) * 32);
        }
        return { width: w, height: h, ratioBadge: `${detectedRatio} (Auto)` };
      }
      ratio = '1:1';
    }

    switch (ratio) {
      case '16:9':
        return { width: Math.round(base * 1.33 / 32) * 32, height: Math.round(base * 0.75 / 32) * 32, ratioBadge: '16:9' };
      case '9:16':
        return { width: Math.round(base * 0.75 / 32) * 32, height: Math.round(base * 1.33 / 32) * 32, ratioBadge: '9:16' };
      case '4:3':
        return { width: Math.round(base * 1.15 / 32) * 32, height: Math.round(base * 0.85 / 32) * 32, ratioBadge: '4:3' };
      case '3:4':
        return { width: Math.round(base * 0.85 / 32) * 32, height: Math.round(base * 1.15 / 32) * 32, ratioBadge: '3:4' };
      case '3:2':
        return { width: Math.round(base * 1.22 / 32) * 32, height: Math.round(base * 0.82 / 32) * 32, ratioBadge: '3:2' };
      case '2:3':
        return { width: Math.round(base * 0.82 / 32) * 32, height: Math.round(base * 1.22 / 32) * 32, ratioBadge: '2:3' };
      case '5:4':
        return { width: Math.round(base * 1.12 / 32) * 32, height: Math.round(base * 0.89 / 32) * 32, ratioBadge: '5:4' };
      case '4:5':
        return { width: Math.round(base * 0.89 / 32) * 32, height: Math.round(base * 1.12 / 32) * 32, ratioBadge: '4:5' };
      case '21:9':
        return { width: Math.round(base * 1.6 / 32) * 32, height: Math.round(base * 0.68 / 32) * 32, ratioBadge: '21:9' };
      case '2:1':
        return { width: Math.round(base * 1.41 / 32) * 32, height: Math.round(base * 0.71 / 32) * 32, ratioBadge: '2:1' };
      case '1:2':
        return { width: Math.round(base * 0.71 / 32) * 32, height: Math.round(base * 1.41 / 32) * 32, ratioBadge: '1:2' };
      case '32:9':
        return { width: Math.round(base * 1.88 / 32) * 32, height: Math.round(base * 0.53 / 32) * 32, ratioBadge: '32:9' };
      default:
        return { width: base, height: base, ratioBadge: '1:1' };
    }
  };

  // Main Generate Action (attached to active project ID)
  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    // On mobile screens, auto-collapse controls so user immediately sees the generative progress in the feed
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }

    try {
      localStorage.setItem('civigen_active_generation', JSON.stringify({
        projectId: currentProjectId,
        taskId: selectedTaskId,
        prompt: prompt,
        timestamp: Date.now()
      }));

      const dims = calculateDimensions();
      const currentSeed = isRandomSeed ? -1 : seed;
      const effectiveStyle = stylePreset === 'auto' ? '' : stylePreset;
      const effectiveLighting = lightingPreset === 'auto' ? '' : lightingPreset;

      let effectivePrompt = prompt.trim();
      if (selectedTaskId === 'interior_fully_redesign') {
        effectivePrompt = 'Comprehensive high-end interior architectural redesign, preserving the exact room layout, structural walls, window openings, and space boundaries. Upgraded luxury ceiling details with indirect cove lighting, balanced environment daylight and ambient illumination, photorealistic textures, Hasselblad 35mm optical lens, subtle 10mm wide filter, smooth natural background bokeh, ray-traced global illumination, 8k render.';
      }

      const res = await fetch('/api/v1/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedTaskId,
          prompt: effectivePrompt,
          style: effectiveStyle,
          lighting: effectiveLighting,
          model: model,
          images_base64: referenceImages.map((img) => img.base64),
          width: dims.width,
          height: dims.height,
          steps: steps,
          cfg: cfg,
          denoise: denoise,
          seed: currentSeed,
          upscale_4k: upscale4k,
          project_id: currentProjectId
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: res.statusText }));
        alert(`Generation Failed (${res.status}): ${errData.detail || 'The model server returned an error.'}`);
        return;
      }

      const data = await res.json();
      const taskInfo = tasks[selectedTaskId];
      const isMulti = Boolean(data.metadata?.is_multiview && data.metadata?.views?.length);
      const imagesList = isMulti
        ? data.metadata.views.map((v: any) => ({
            url: v.file_url || v.image_base64,
            b64: v.image_base64,
            label: v.name
          }))
        : [
            {
              url: data.file_url || data.image_base64,
              b64: data.image_base64,
              label: 'AI Output',
              width: data.width,
              height: data.height
            }
          ];

      const newRun: AssetRun = {
        id: data.file_url ? data.file_url.split('/').pop() : `run_${Date.now()}`,
        projectId: currentProjectId,
        taskId: selectedTaskId,
        taskTitle: taskInfo?.title || 'Architecture Render',
        category: taskInfo?.category || 'architecture',
        timestamp: 'Just now',
        prompt: effectivePrompt || (taskInfo?.title || 'Architecture Render'),
        resolutionBadge: upscale4k ? '4k' : resolution.toLowerCase(),
        aspectBadge: dims.ratioBadge,
        inputImageUrl: referenceImages.length > 0
          ? referenceImages[0].base64
          : (data.metadata?.input_image_url || undefined),
        isMultiView: isMulti,
        images: imagesList
      };
      setAssetRuns((prev) => [newRun, ...prev]);
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProjectId ? { ...p, count: p.count + 1 } : p))
      );
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      localStorage.removeItem('civigen_active_generation');
      setIsGenerating(false);
    }
  };

  // Immediate Stop Generation Action
  const handleStopGeneration = async () => {
    try {
      await fetch('/api/v1/generation/stop', { method: 'POST' });
    } catch (err) {
      console.error('Failed to send stop signal:', err);
    } finally {
      localStorage.removeItem('civigen_active_generation');
      setIsGenerating(false);
    }
  };

  // Delete Action for single asset
  const handleDeleteAsset = async (id: string, fileUrl?: string) => {
    try {
      const filename = fileUrl ? fileUrl.split('/').pop() : id;
      if (filename && filename.endsWith('.png')) {
        await fetch(`/api/v1/outputs/${filename}`, { method: 'DELETE' });
      }
      setAssetRuns((prev) => prev.filter((r) => r.id !== id));
      setSelectedRunIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProjectId ? { ...p, count: Math.max(0, p.count - 1) } : p))
      );
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Bulk Delete Selected
  const handleDeleteSelected = async () => {
    if (selectedRunIds.size === 0) return;
    if (!confirm(`Delete ${selectedRunIds.size} selected asset(s)?`)) return;

    for (const id of Array.from(selectedRunIds)) {
      const run = assetRuns.find((r) => r.id === id);
      const filename = run?.images[0]?.url ? run.images[0].url.split('/').pop() : id;
      if (filename && filename.endsWith('.png')) {
        try {
          await fetch(`/api/v1/outputs/${filename}`, { method: 'DELETE' });
        } catch {}
      }
    }

    setAssetRuns((prev) => prev.filter((r) => !selectedRunIds.has(r.id)));
    setSelectedRunIds(new Set());
  };

  const handleToggleSelectRun = (id: string) => {
    setSelectedRunIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handleToggleBookmark = (id: string) => {
    setAssetRuns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  // 4K Upscale
  const handleTriggerUpscale4k = async (base64Img: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/upscale-4k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64Img })
      });
      if (res.ok) {
        const data = await res.json();
        const newRun: AssetRun = {
          id: data.file_url ? data.file_url.split('/').pop() : `upscale_${Date.now()}`,
          projectId: currentProjectId,
          taskId: 'arch_enhance_render',
          taskTitle: '4K Latent Tile Refine',
          category: 'architecture',
          timestamp: 'Just now',
          prompt: '4K Latent Tiled High-Frequency Micro-Texture Refinement',
          resolutionBadge: '4k',
          aspectBadge: `${data.width}x${data.height}`,
          images: [
            {
              url: data.file_url || data.image_base64,
              b64: data.image_base64,
              label: '4K UHD Refined',
              width: data.width,
              height: data.height
            }
          ]
        };
        setAssetRuns((prev) => [newRun, ...prev]);
      }
    } catch (err) {
      console.error('4K Upscale failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateAssetRun = (updatedRun: AssetRun) => {
    setAssetRuns((prev) =>
      prev.map((r) => (r.id === updatedRun.id || r.images[0]?.url === updatedRun.inputImageUrl ? updatedRun : r))
    );
  };

  const handleClearAll = () => {
    if (confirm(`Clear all rendered assets from project ${currentProjectId}?`)) {
      setAssetRuns((prev) => prev.filter((r) => r.projectId && r.projectId !== currentProjectId));
    }
  };

  // Open asset in Studio directly from Library
  const handleOpenInStudioFromLibrary = (
    taskId: string,
    projectId: string,
    imgPrompt: string,
    inputImgUrl?: string
  ) => {
    if (projectId) {
      setCurrentProjectId(projectId);
    }
    if (taskId) {
      setSelectedTaskId(taskId);
      const task = tasks[taskId];
      if (task) {
        setSteps(task.default_steps || 25);
        setCfg(task.default_cfg || 1.0);
        setDenoise(task.default_denoise || 1.0);
        setModel(task.default_model || 'qwen');
      }
    }
    if (imgPrompt) {
      setPrompt(imgPrompt);
    }
    if (inputImgUrl) {
      setReferenceImages([
        {
          id: `ref_${Date.now()}`,
          name: 'library_reference.png',
          base64: inputImgUrl
        }
      ]);
    }
    setCurrentView('studio');
    setActiveTab('assets');
  };

  // Load asset as reference in Studio for re-editing with calibrated presets
  const handleSendToStudio = (imageUrl: string, promptText?: string, cat?: string) => {
    const img = new Image();
    img.onload = () => {
      const detected = detectImageRatio(img);
      setDetectedRatio(detected);
      setReferenceImages([{
        id: `ref_${Date.now()}`,
        name: 'Asset Reference',
        base64: imageUrl,
        width: img.width,
        height: img.height
      }]);
    };
    img.src = imageUrl;

    const c = cat || (selectedTaskId.startsWith('arch') ? 'architecture' : selectedTaskId.startsWith('interior') ? 'interior' : 'furniture');
    if (c === 'architecture') {
      setSelectedTaskId('arch_image_edit');
      setDenoise(0.52);
    } else if (c === 'interior') {
      setSelectedTaskId('interior_image_edit');
      setDenoise(0.52);
    } else {
      setSelectedTaskId('furniture_edit');
      setDenoise(0.48);
    }

    if (promptText) {
      setPrompt(promptText);
    }
    setCurrentView('studio');
    setActiveTab('assets');
    setIsSidebarCollapsed(false);
  };

  const handleSelectPreset = (p: EditPreset) => {
    setActivePresetId(p.id);
    setPrompt(p.prompt);
    setDenoise(p.denoise);
  };

  // Cycle Grid Layout on Grid Button click
  const handleCycleGrid = () => {
    setZoomLevel((prev) => (prev >= 5 ? 1 : prev + 1));
  };

  // Filtered Runs for Active Project
  const currentProjectRuns = assetRuns.filter((r) => {
    const matchesProject = !r.projectId || r.projectId === currentProjectId;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesBookmark = !showBookmarkedOnly || r.isBookmarked;
    return matchesProject && matchesCategory && matchesBookmark;
  });

  // Model Options with Official Logos
  const modelOptions: SelectOption[] = [
    {
      value: 'qwen',
      label: 'Qwen Image 2.1 (8B DiT)',
      badge: 'Alibaba / 8B DiT',
      icon: <QwenLogo size={18} />
    }
  ];

  // Filter Task Options strictly by category so "no other should be show"
  const currentTaskCategory = React.useMemo(() => {
    if (activeSuite === 'architecture' || selectedTaskId.startsWith('arch_')) return 'architecture';
    if (activeSuite === 'interior_furniture') {
      if (selectedTaskId.startsWith('furniture_')) return 'furniture';
      return 'interior';
    }
    if (selectedTaskId.startsWith('interior_')) return 'interior';
    if (selectedTaskId.startsWith('furniture_')) return 'furniture';
    return 'architecture';
  }, [activeSuite, selectedTaskId]);

  const taskOptions: SelectOption[] = React.useMemo(() => {
    if (currentTaskCategory === 'architecture') {
      return [
        {
          value: 'arch_text_to_arch',
          label: 'T2A • Text to Arch',
          group: 'Architecture',
          imageUrl: TASK_EXAMPLE_IMAGES['arch_text_to_arch']
        },
        {
          value: 'arch_sketch_to_arch',
          label: 'S2A • Sketch to Image Arch Render',
          group: 'Architecture',
          imageUrl: TASK_EXAMPLE_IMAGES['arch_sketch_to_arch']
        },
        {
          value: 'arch_image_edit',
          label: 'AIE • Architecture Image Editing',
          group: 'Architecture',
          imageUrl: TASK_EXAMPLE_IMAGES['arch_image_edit']
        },
        {
          value: 'arch_enhance_render',
          label: 'ETDOTR • Enhance Details of Render',
          group: 'Architecture',
          imageUrl: TASK_EXAMPLE_IMAGES['arch_enhance_render']
        }
      ];
    } else if (currentTaskCategory === 'interior') {
      return [
        {
          value: 'interior_sketch_to_design',
          label: 'S2ID • Sketch to Interior Design',
          group: 'Interior Design',
          imageUrl: TASK_EXAMPLE_IMAGES['interior_sketch_to_design']
        },
        {
          value: 'interior_room_new_look',
          label: 'GYRNL • Give Your Room New Look',
          group: 'Interior Design',
          imageUrl: TASK_EXAMPLE_IMAGES['interior_room_new_look']
        },
        {
          value: 'interior_image_edit',
          label: 'IDIE • Interior Design Image Editing',
          group: 'Interior Design',
          imageUrl: TASK_EXAMPLE_IMAGES['interior_image_edit']
        },
        {
          value: 'interior_fully_redesign',
          label: 'FRMR • Fully Redesign My Room',
          group: 'Interior Design',
          imageUrl: TASK_EXAMPLE_IMAGES['interior_fully_redesign']
        }
      ];
    } else {
      return [
        {
          value: 'furniture_sketch_to_render',
          label: 'S2F • Sketch to Furniture',
          group: 'Furniture',
          imageUrl: TASK_EXAMPLE_IMAGES['furniture_sketch_to_render']
        },
        {
          value: 'furniture_edit',
          label: 'FE • Furniture Editing',
          group: 'Furniture',
          imageUrl: TASK_EXAMPLE_IMAGES['furniture_edit']
        },
        {
          value: 'furniture_text_to_render',
          label: 'T2F • Text-Furniture',
          group: 'Furniture',
          imageUrl: TASK_EXAMPLE_IMAGES['furniture_text_to_render']
        }
      ];
    }
  }, [currentTaskCategory]);

  const categoryPresets = React.useMemo(() => {
    return getPresetsForCategory(currentTaskCategory as 'architecture' | 'interior' | 'furniture');
  }, [currentTaskCategory]);

  const filteredPresets = React.useMemo(() => {
    if (presetTypeFilter === 'all') return categoryPresets;
    return categoryPresets.filter((p) => p.group === presetTypeFilter);
  }, [categoryPresets, presetTypeFilter]);

  const activePreset = React.useMemo(() => {
    return categoryPresets.find((p) => p.id === activePresetId);
  }, [categoryPresets, activePresetId]);

  // Ratio Options
  const ratioOptions: SelectOption[] = [
    {
      value: 'auto',
      label: referenceImages.length > 0 ? `Auto (${detectedRatio} Detected)` : 'Auto (Match Image / 1:1)',
      badge: 'Smart'
    },
    { value: '1:1', label: '1:1 Square' },
    { value: '16:9', label: '16:9 Landscape' },
    { value: '9:16', label: '9:16 Portrait' },
    { value: '4:3', label: '4:3 Standard' },
    { value: '3:4', label: '3:4 Vertical' },
    { value: '21:9', label: '21:9 Panoramic' }
  ];

  // Resolution Options
  const resolutionOptions: SelectOption[] = [
    { value: '1K', label: '1K (1024px)' },
    { value: '2K', label: '2K (1536px)' }
  ];

  // Style Options (Defaults to Auto)
  const styleOptions: SelectOption[] = [
    { value: 'auto', label: 'Auto (Prompt-Driven)', badge: 'Default' },
    { value: 'Modern Luxury Villa', label: 'Modern Luxury' },
    { value: 'Minimalist Japandi', label: 'Japandi' },
    { value: 'Industrial Brutalist', label: 'Brutalist' },
    { value: 'Biophilic Contemporary', label: 'Biophilic' },
    { value: 'Mid-Century Modern', label: 'Mid-Century' },
    { value: 'Scandinavian Warm', label: 'Scandinavian' }
  ];

  // Lighting Options (Defaults to Auto)
  const lightingOptions: SelectOption[] = [
    { value: 'auto', label: 'Auto (Natural Lighting)', badge: 'Default' },
    { value: 'Twilight Golden Hour', label: 'Twilight Golden Hour' },
    { value: 'Overcast Soft Daylight', label: 'Overcast Soft Light' },
    { value: 'Warm Interior Accent', label: 'Warm Interior Light' },
    { value: 'Cinematic Architectural Dusk', label: 'Cinematic Dusk' },
    { value: 'Crisp High Noon', label: 'Crisp High Noon' }
  ];

  return (
    <div className="app-container">
      {/* Top Navigation Bar with (projectid)/apps/T2A Breadcrumb */}
      <header className="top-nav">
        <div className="nav-left">
          {/* CiviGen Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('projects');
              setActiveTab('assets');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '2px 8px 2px 2px',
              borderRadius: 8,
              transition: 'opacity 150ms ease',
              marginRight: 4
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1.0')}
            title="CiviGen AI Studio - Return to Projects"
          >
            <img
              src="/logo.png"
              alt="CiviGen"
              style={{
                height: 28,
                width: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Scoped Segmented Breadcrumb Path */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12.5,
              fontWeight: 600,
              background: '#F8FAFC',
              padding: '3px 6px',
              borderRadius: 10,
              border: '1px solid #E2E8F0'
            }}
          >
            {/* Projects Root Link */}
            <button
              onClick={() => {
                setCurrentView('projects');
                setActiveTab('assets');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                border: 'none',
                background: currentView === 'projects' ? '#0F172A' : 'transparent',
                color: currentView === 'projects' ? '#FFFFFF' : '#475569',
                fontSize: 12.5,
                fontWeight: currentView === 'projects' ? 700 : 500,
                padding: '4px 8px',
                borderRadius: 7,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              title="View All Projects Portal"
            >
              <FolderOpen size={13} style={{ color: currentView === 'projects' ? '#93C5FD' : '#64748B' }} />
              <span>Projects</span>
            </button>

            {/* In Tasks view: show only Projects > PRJ-XXXX */}
            {currentView === 'tasks' && (
              <>
                <ChevronRight size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid #1E293B',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 9px',
                    borderRadius: 7,
                    letterSpacing: '-0.01em'
                  }}
                  title={`Current Project: ${currentProjectId}`}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10B981',
                      boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)'
                    }}
                  />
                  <span>{currentProjectId}</span>
                </div>
              </>
            )}

            {/* In Studio view: show Projects > PRJ-XXXX > Tasks > [Thumbnail + Code] */}
            {currentView === 'studio' && (
              <>
                <ChevronRight size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />
                <button
                  onClick={() => {
                    setCurrentView('tasks');
                    setActiveTab('assets');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#1E293B',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 9px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                  title="Switch Project Tasks"
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10B981'
                    }}
                  />
                  <span>{currentProjectId}</span>
                </button>

                <ChevronRight size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />

                <button
                  onClick={() => {
                    setCurrentView('tasks');
                    setActiveTab('assets');
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#475569',
                    fontSize: 12.5,
                    fontWeight: 500,
                    padding: '4px 7px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  title="Select Task Workflow"
                >
                  Tasks
                </button>

                <ChevronRight size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />

                {/* Specific Tool Short Code with example thumbnail */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowAppMenu(!showAppMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      border: '1px solid #0F172A',
                      background: '#0F172A',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '3px 8px 3px 4px',
                      borderRadius: 7,
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      transition: 'all 150ms ease'
                    }}
                    title={`Current Workflow: ${TASK_SHORT_CODES[selectedTaskId] || 'APP'} (Click to switch)`}
                  >
                    {TASK_EXAMPLE_IMAGES[selectedTaskId] && (
                      <img
                        src={TASK_EXAMPLE_IMAGES[selectedTaskId]}
                        alt=""
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 5,
                          objectFit: 'cover',
                          border: '1px solid rgba(255, 255, 255, 0.25)'
                        }}
                      />
                    )}
                    <span>{TASK_SHORT_CODES[selectedTaskId] || 'APP'}</span>
                    <ChevronDown
                      size={12}
                      style={{
                        color: '#94A3B8',
                        transform: showAppMenu ? 'rotate(180deg)' : 'none',
                        transition: 'transform 180ms ease'
                      }}
                    />
                  </button>

                  {/* High-End Workflow Switcher Dropdown Menu */}
                  {showAppMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 36,
                        left: 0,
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid #E2E8F0',
                        borderRadius: 14,
                        boxShadow: '0 20px 45px -8px rgba(15, 23, 42, 0.18), 0 8px 16px -4px rgba(15, 23, 42, 0.08)',
                        zIndex: 60,
                        width: 350,
                        padding: '8px 6px',
                        maxHeight: 400,
                        overflowY: 'auto'
                      }}
                    >
                      <div
                        style={{
                          padding: '6px 10px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #F1F5F9',
                          marginBottom: 6
                        }}
                      >
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          Switch Workflow Pipeline
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            background: '#F1F5F9',
                            color: '#475569',
                            padding: '2px 7px',
                            borderRadius: 9999
                          }}
                        >
                          11 Pipelines
                        </span>
                      </div>

                      {/* Group: Architecture */}
                      <div style={{ padding: '4px 8px 2px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Architecture
                      </div>
                      {[
                        'arch_text_to_arch',
                        'arch_sketch_to_arch',
                        'arch_image_edit',
                        'arch_enhance_render'
                      ].map((tId) => {
                        const isSel = selectedTaskId === tId;
                        const code = TASK_SHORT_CODES[tId];
                        return (
                          <div
                            key={tId}
                            onClick={() => {
                              handleTaskChange(tId);
                              setShowAppMenu(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 9px',
                              borderRadius: 8,
                              fontSize: 12,
                              background: isSel ? '#EFF6FF' : 'transparent',
                              border: isSel ? '1px solid #BFDBFE' : '1px solid transparent',
                              color: isSel ? '#1E40AF' : '#1E293B',
                              cursor: 'pointer',
                              marginBottom: 2,
                              transition: 'all 120ms ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSel) e.currentTarget.style.background = '#F8FAFC';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSel) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                              {TASK_EXAMPLE_IMAGES[tId] && (
                                <img
                                  src={TASK_EXAMPLE_IMAGES[tId]}
                                  alt=""
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    objectFit: 'cover',
                                    border: '1px solid #E2E8F0',
                                    flexShrink: 0
                                  }}
                                />
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-mono, monospace)',
                                      fontWeight: 700,
                                      fontSize: 11,
                                      background: isSel ? '#1D4ED8' : '#0F172A',
                                      color: '#FFFFFF',
                                      padding: '1px 5px',
                                      borderRadius: 4
                                    }}
                                  >
                                    {code}
                                  </span>
                                  <span style={{ fontWeight: 600, fontSize: 12 }}>{tasks[tId]?.title || tId}</span>
                                </div>
                              </div>
                            </div>
                            {isSel && <Check size={14} style={{ color: '#2563EB', flexShrink: 0 }} />}
                          </div>
                        );
                      })}

                      {/* Group: Interior Design */}
                      <div style={{ padding: '8px 8px 2px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Interior Design
                      </div>
                      {[
                        'interior_sketch_to_design',
                        'interior_room_new_look',
                        'interior_image_edit',
                        'interior_fully_redesign'
                      ].map((tId) => {
                        const isSel = selectedTaskId === tId;
                        const code = TASK_SHORT_CODES[tId];
                        return (
                          <div
                            key={tId}
                            onClick={() => {
                              handleTaskChange(tId);
                              setShowAppMenu(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 9px',
                              borderRadius: 8,
                              fontSize: 12,
                              background: isSel ? '#EFF6FF' : 'transparent',
                              border: isSel ? '1px solid #BFDBFE' : '1px solid transparent',
                              color: isSel ? '#1E40AF' : '#1E293B',
                              cursor: 'pointer',
                              marginBottom: 2,
                              transition: 'all 120ms ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSel) e.currentTarget.style.background = '#F8FAFC';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSel) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                              {TASK_EXAMPLE_IMAGES[tId] && (
                                <img
                                  src={TASK_EXAMPLE_IMAGES[tId]}
                                  alt=""
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    objectFit: 'cover',
                                    border: '1px solid #E2E8F0',
                                    flexShrink: 0
                                  }}
                                />
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-mono, monospace)',
                                      fontWeight: 700,
                                      fontSize: 11,
                                      background: isSel ? '#1D4ED8' : '#0F172A',
                                      color: '#FFFFFF',
                                      padding: '1px 5px',
                                      borderRadius: 4
                                    }}
                                  >
                                    {code}
                                  </span>
                                  <span style={{ fontWeight: 600, fontSize: 12 }}>{tasks[tId]?.title || tId}</span>
                                </div>
                              </div>
                            </div>
                            {isSel && <Check size={14} style={{ color: '#2563EB', flexShrink: 0 }} />}
                          </div>
                        );
                      })}

                      {/* Group: Furniture Rendering */}
                      <div style={{ padding: '8px 8px 2px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Furniture Rendering
                      </div>
                      {[
                        'furniture_sketch_to_render',
                        'furniture_edit',
                        'furniture_text_to_render'
                      ].map((tId) => {
                        const isSel = selectedTaskId === tId;
                        const code = TASK_SHORT_CODES[tId];
                        return (
                          <div
                            key={tId}
                            onClick={() => {
                              handleTaskChange(tId);
                              setShowAppMenu(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 9px',
                              borderRadius: 8,
                              fontSize: 12,
                              background: isSel ? '#EFF6FF' : 'transparent',
                              border: isSel ? '1px solid #BFDBFE' : '1px solid transparent',
                              color: isSel ? '#1E40AF' : '#1E293B',
                              cursor: 'pointer',
                              marginBottom: 2,
                              transition: 'all 120ms ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSel) e.currentTarget.style.background = '#F8FAFC';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSel) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                              {TASK_EXAMPLE_IMAGES[tId] && (
                                <img
                                  src={TASK_EXAMPLE_IMAGES[tId]}
                                  alt=""
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    objectFit: 'cover',
                                    border: '1px solid #E2E8F0',
                                    flexShrink: 0
                                  }}
                                />
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-mono, monospace)',
                                      fontWeight: 700,
                                      fontSize: 11,
                                      background: isSel ? '#1D4ED8' : '#0F172A',
                                      color: '#FFFFFF',
                                      padding: '1px 5px',
                                      borderRadius: 4
                                    }}
                                  >
                                    {code}
                                  </span>
                                  <span style={{ fontWeight: 600, fontSize: 12 }}>{tasks[tId]?.title || tId}</span>
                                </div>
                              </div>
                            </div>
                            {isSel && <Check size={14} style={{ color: '#2563EB', flexShrink: 0 }} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Studio-only action buttons: Clear all and Bookmark */}
          {currentView === 'studio' && (
            <>
              <button className="clear-btn" onClick={handleClearAll} title="Clear renders in active project">
                <Trash2 size={14} /> Clear all
              </button>

              <button
                className="icon-btn"
                title="Projects & Bookmarks Manager"
                onClick={() => setIsProjectsDrawerOpen(!isProjectsDrawerOpen)}
                style={{
                  background: isProjectsDrawerOpen ? '#111827' : '#FFFFFF',
                  color: isProjectsDrawerOpen ? '#FFFFFF' : '#4B5563',
                  position: 'relative'
                }}
              >
                <Bookmark size={15} />
                {assetRuns.some((r) => r.isBookmarked) && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#F59E0B'
                    }}
                  />
                )}
              </button>
            </>
          )}
        </div>

        {/* Center Tabs: Segmented Nav Control matching progressive disclosure */}
        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${currentView === 'projects' && activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('projects');
              setActiveTab('assets');
            }}
          >
            <FolderOpen size={13} /> Projects
          </button>

          {/* User Feedback 2: For project view, we should NOT see Tasks */}
          {currentView !== 'projects' && (
            <button
              className={`nav-tab-btn ${currentView === 'tasks' && activeTab === 'assets' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('tasks');
                setActiveTab('assets');
              }}
            >
              <Compass size={13} /> Tasks
            </button>
          )}

          {/* User Feedback 2 & 3: For project and tasks view, we should NOT see Studio */}
          {currentView === 'studio' && (
            <button
              className={`nav-tab-btn ${currentView === 'studio' && activeTab === 'assets' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('studio');
                setActiveTab('assets');
              }}
            >
              <Layers size={13} /> Studio
            </button>
          )}

          {/* User Feedback 4: Add Library tab where all generated images can be seen */}
          <button
            className={`nav-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
            title="Browse all generated renders and concepts across projects"
          >
            <ImageIcon size={13} /> Library
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <Code size={13} /> API
          </button>
        </div>

        {/* Right Tools: Conditioned per view matching reference mockup */}
        <div className="nav-right" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Feedback 2: Filter button shown in Tasks only */}
          {currentView === 'tasks' && (
            <div style={{ position: 'relative' }}>
              <button
                className={`icon-btn ${taskCategoryFilter !== 'all' ? 'active' : ''}`}
                title={`Filter Tasks by Category (Active: ${taskCategoryFilter})`}
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                style={{
                  background: taskCategoryFilter !== 'all' ? '#111827' : '#FFFFFF',
                  color: taskCategoryFilter !== 'all' ? '#FFFFFF' : '#4B5563',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: taskCategoryFilter !== 'all' ? '4px 10px' : '6px'
                }}
              >
                <Filter size={14} />
                {taskCategoryFilter !== 'all' && (
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>
                    {taskCategoryFilter}
                  </span>
                )}
              </button>

              {showFilterMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: 42,
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 8,
                    padding: 6,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minWidth: 170
                  }}
                >
                  {[
                    { key: 'all', label: 'All Tasks (11)' },
                    { key: 'architecture', label: '1. Architecture (4)' },
                    { key: 'interior', label: '2. Interior (4)' },
                    { key: 'furniture', label: '3. Furniture (3)' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setTaskCategoryFilter(item.key as any);
                        setShowFilterMenu(false);
                      }}
                      style={{
                        border: 'none',
                        background: taskCategoryFilter === item.key ? '#F3F4F6' : 'transparent',
                        color: taskCategoryFilter === item.key ? '#111827' : '#4B5563',
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: taskCategoryFilter === item.key ? 600 : 400,
                        borderRadius: 6,
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Studio View Right Controls: Brightness/Zoom Slider + Grid + Sidebar Toggle */}
          {currentView === 'studio' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sun size={14} style={{ color: '#4B5563' }} />
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="studio-zoom-slider"
                  title="Adjust Grid Density"
                  style={{
                    width: 70,
                    height: 3,
                    accentColor: '#111827',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <button
                className="icon-btn"
                title={`Cycle Grid Density (Current Zoom: ${zoomLevel})`}
                onClick={handleCycleGrid}
                style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB' }}
              >
                <LayoutGrid size={14} />
              </button>

              <button
                className="icon-btn"
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid #E5E7EB',
                  background: isSidebarCollapsed ? '#111827' : '#FFFFFF',
                  color: isSidebarCollapsed ? '#FFFFFF' : '#4B5563'
                }}
              >
                <Columns size={14} />
              </button>
            </div>
          )}

          {/* User profile avatar matching reference mockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            title="CivGen Account (N)"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#E2E8F0',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid #CBD5E1'
              }}
            >
              N
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout: Either API, Library, Projects Portal, Task Selection, or Generation Studio */}
      {activeTab === 'api' ? (
        <main className="workspace-content">
          <ApiPlaygroundTab />
        </main>
      ) : activeTab === 'library' ? (
        <LibraryPage
          assetRuns={assetRuns}
          projects={projects}
          onOpenModal={(imgUrl, title, prompt) => setModalImage({ url: imgUrl, title, prompt })}
          onTriggerUpscale4k={handleTriggerUpscale4k}
          onDelete={handleDeleteAsset}
          onToggleBookmark={handleToggleBookmark}
          onOpenInStudio={handleOpenInStudioFromLibrary}
        />
      ) : currentView === 'projects' ? (
        <ProjectsPortalPage
          projects={projects}
          activeProjectId={currentProjectId}
          assetRuns={assetRuns}
          onSelectProject={handleSelectProjectFromPortal}
          onSetActiveProject={setCurrentProjectId}
          onCreateProject={handleCreateProjectFromPortal}
          onDeleteProject={handleDeleteProjectFromPortal}
          onUpdateProject={handleUpdateProject}
        />
      ) : currentView === 'tasks' ? (
        <TaskSelectionPage
          currentProjectId={currentProjectId}
          projectName={activeProjectObj?.name || 'Design Project'}
          categoryFilter={taskCategoryFilter}
          onSelectTask={handleSelectTaskFromSelectionPage}
          onBackToProjects={() => setCurrentView('projects')}
        />
      ) : (
        <div className="main-layout">
          {/* Feedback 1: Left Control Sidebar - Fully Resizable */}
          {!isSidebarCollapsed && (
            <aside
              className="sidebar-panel"
              style={{
                width: sidebarWidth,
                minWidth: 260,
                maxWidth: 650,
                flexShrink: 0
              }}
            >
              {/* Draggable Resize Handle */}
              <div
                className={`sidebar-resizer ${isResizing ? 'is-resizing' : ''}`}
                onMouseDown={startResizing}
                title="Drag to resize sidebar"
              />

              {/* Suite Navigation Banner (Locked suite reminder) */}
              {activeSuite !== 'all' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: '#F3F4F6',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#374151'
                  }}
                >
                  <span>
                    Suite: {activeSuite === 'architecture' ? 'Architecture' : 'Interior & Furniture'}
                  </span>
                  <button
                    onClick={() => setActiveSuite('all')}
                    style={{ border: 'none', background: 'transparent', color: '#2563EB', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                  >
                    Show All
                  </button>
                </div>
              )}

              {/* Model Select */}
              <div className="form-group">
                <label className="form-label">Model</label>
                <CustomSelect
                  value={model}
                  onChange={(val) => setModel(val)}
                  options={modelOptions}
                  icon={<Cpu size={14} />}
                />
              </div>

              {/* Task Category & Preset */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label className="form-label">Task Preset</label>
                  {selectedTaskId !== 'arch_text_to_arch' && selectedTaskId !== 'furniture_text_to_render' && (
                    <button
                      onClick={handleLoadExample}
                      style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      title="Load example ground-truth input asset into editor"
                    >
                      <FolderOpen size={12} /> Load Example
                    </button>
                  )}
                </div>
                <CustomSelect
                  value={selectedTaskId}
                  onChange={(val) => handleTaskChange(val)}
                  options={taskOptions}
                  icon={<Layers size={14} />}
                />
              </div>

              {/* Reference Images Slots: Hidden for text-only pipelines T2A and T2F */}
              {selectedTaskId !== 'arch_text_to_arch' && selectedTaskId !== 'furniture_text_to_render' && (
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Reference Images</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div
                      className="ref-add-box"
                      onClick={() => fileInputRef.current?.click()}
                      title="Add Reference Sketch or Photo"
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 8,
                        border: '1.5px dashed #D1D5DB',
                        background: '#FAFAFA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#9CA3AF',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <Plus size={20} />
                    </div>

                    {referenceImages.map((img, idx) => (
                      <div
                        key={img.id}
                        style={{
                          position: 'relative',
                          width: 58,
                          height: 58,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: '1.5px solid #E5E7EB',
                          background: '#F3F4F6'
                        }}
                      >
                        <img src={img.base64} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {idx === referenceImages.length - 1 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 3,
                              right: 3,
                              width: 15,
                              height: 15,
                              borderRadius: '50%',
                              background: '#2563EB',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }}
                          >
                            <Check size={9} strokeWidth={3} />
                          </div>
                        )}
                        <button
                          className="ref-remove-btn"
                          onClick={() => removeReferenceImage(img.id)}
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.65)',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}

                    {referenceImages.length === 0 && (
                      <>
                        <div
                          style={{
                            width: 58,
                            height: 58,
                            borderRadius: 8,
                            border: '1.5px dashed #E5E7EB',
                            background: '#FCFCFC'
                          }}
                        />
                        <div
                          style={{
                            width: 58,
                            height: 58,
                            borderRadius: 8,
                            border: '1.5px dashed #E5E7EB',
                            background: '#FCFCFC'
                          }}
                        />
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              {/* Prompt Textarea: Hidden for FRMR (automated full architectural redesign) */}
              {selectedTaskId === 'interior_fully_redesign' ? (
                <div className="form-group">
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(30, 64, 175, 0.02))',
                      border: '1px solid #BFDBFE',
                      borderRadius: 10,
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#1E40AF', fontWeight: 600, fontSize: 12 }}>
                      <Sparkles size={14} /> Full Architectural Redesign Mode
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                      Automated end-to-end interior redesign active. Preserves the exact room envelope, wall layout, and window openings while professionally upgrading finishes, ceilings, materials, and environment lighting.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Re-Edit & Style Presets Selector */}
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 6
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Sparkles size={13} style={{ color: '#4F46E5' }} /> Re-Edit Presets
                        </label>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            background: '#EEF2FF',
                            color: '#4F46E5',
                            padding: '1px 6px',
                            borderRadius: 4,
                            border: '1px solid #E0E7FF'
                          }}
                        >
                          Calibrated Denoise
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPresetDrawerOpen(!isPresetDrawerOpen)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#6B7280',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          padding: 0
                        }}
                      >
                        <span>{isPresetDrawerOpen ? 'Collapse' : 'Browse Presets'}</span>
                        <ChevronDown
                          size={12}
                          style={{
                            transform: isPresetDrawerOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 150ms ease'
                          }}
                        />
                      </button>
                    </div>

                    {isPresetDrawerOpen && (
                      <div
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: 10,
                          padding: 8,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8
                        }}
                      >
                        {/* Filter Chips */}
                        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2 }}>
                          {(['all', 'lighting', 'materials', 'features', 'refine'] as const).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setPresetTypeFilter(cat)}
                              style={{
                                padding: '2px 8px',
                                fontSize: 10.5,
                                fontWeight: presetTypeFilter === cat ? 700 : 500,
                                background: presetTypeFilter === cat ? '#0F172A' : '#FFFFFF',
                                color: presetTypeFilter === cat ? '#FFFFFF' : '#475569',
                                border: presetTypeFilter === cat ? '1px solid #0F172A' : '1px solid #E2E8F0',
                                borderRadius: 6,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {cat === 'all' ? 'All' : cat === 'lighting' ? '💡 Lighting' : cat === 'materials' ? '🪵 Materials' : cat === 'features' ? '🏛️ Elements' : '✨ Polish'}
                            </button>
                          ))}
                        </div>

                        {/* Presets Grid */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                            gap: 6,
                            maxHeight: 180,
                            overflowY: 'auto',
                            paddingRight: 2
                          }}
                        >
                          {filteredPresets.map((p) => {
                            const isActive = activePresetId === p.id;
                            return (
                              <div
                                key={p.id}
                                onClick={() => {
                                  handleSelectPreset(p);
                                  if (referenceImages.length > 0) {
                                    if (p.category === 'architecture' && selectedTaskId === 'arch_text_to_arch') {
                                      setSelectedTaskId('arch_image_edit');
                                    } else if (p.category === 'furniture' && selectedTaskId === 'furniture_text_to_render') {
                                      setSelectedTaskId('furniture_edit');
                                    }
                                  }
                                }}
                                style={{
                                  background: isActive ? '#EFF6FF' : '#FFFFFF',
                                  border: isActive ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                                  borderRadius: 8,
                                  padding: '6px 8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 3,
                                  transition: 'all 120ms ease'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                                  <span style={{ fontSize: 13 }}>{p.icon}</span>
                                  <span
                                    style={{
                                      fontSize: 9.5,
                                      fontFamily: 'var(--font-mono, monospace)',
                                      fontWeight: 700,
                                      background: isActive ? '#DBEAFE' : '#F1F5F9',
                                      color: isActive ? '#1D4ED8' : '#475569',
                                      padding: '1px 4px',
                                      borderRadius: 4
                                    }}
                                    title={`Denoise calibrated to ${p.denoise}`}
                                  >
                                    {p.denoise}
                                  </span>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#1E293B', lineHeight: 1.25 }}>
                                  {p.label}
                                </span>
                                <span style={{ fontSize: 9.5, color: '#64748B', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {p.description}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {activePreset && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              borderRadius: 6,
                              padding: '4px 8px',
                              fontSize: 10.5,
                              color: '#1E40AF'
                            }}
                          >
                            <span>Active Preset: <strong>{activePreset.label}</strong> (Denoise: {activePreset.denoise})</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePresetId(null);
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 0 }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Prompt</label>
                  <div className="prompt-wrapper" style={{ position: 'relative', width: '100%' }}>
                    <textarea
                      className="prompt-textarea"
                      placeholder="What do you want to see?"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 110,
                        padding: '12px 14px 44px 14px',
                        borderRadius: 10,
                        border: '1.5px solid #E5E7EB',
                        fontSize: 13,
                        lineHeight: 1.55,
                        color: '#111827',
                        background: '#FFFFFF',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button
                      className={`enhance-btn ${isEnhancing ? 'loading' : ''}`}
                      title="Enhance prompt with photographic lighting and optical quality"
                      onClick={handleEnhancePrompt}
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#4F46E5',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <Sparkles size={15} />
                    </button>
                  </div>
                </div>
              </>
            )}

              {/* Aspect Ratio 4-Column Cards */}
              <AspectRatioCards
                value={aspectRatio}
                onChange={(val) => setAspectRatio(val)}
                detectedRatio={referenceImages.length > 0 ? detectedRatio : undefined}
              />

              {/* Resolution 4-Pill Cards */}
              <ResolutionCards
                value={resolution}
                onChange={(val) => setResolution(val)}
              />

              {/* Style Preset 4-Card Grid */}
              <StylePresetCards
                value={stylePreset}
                onChange={(val) => setStylePreset(val)}
              />

              {/* Lighting Atmosphere 4-Card Grid */}
              <LightingPresetCards
                value={lightingPreset}
                onChange={(val) => setLightingPreset(val)}
              />

              {/* Custom Advanced Settings Accordion */}
              <div>
                <div
                  className="accordion-header"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#374151',
                    padding: '8px 0'
                  }}
                >
                  <span>Advanced Settings</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: showAdvanced ? 'rotate(180deg)' : 'none',
                      transition: 'transform 200ms ease'
                    }}
                  />
                </div>

                {showAdvanced && (
                  <div className="accordion-body">
                    <CustomSlider
                      label="Inference Steps"
                      value={steps}
                      min={10}
                      max={40}
                      onChange={(val) => setSteps(val)}
                    />

                    <CustomSlider
                      label="CFG Scale"
                      value={cfg}
                      min={0.5}
                      max={4.0}
                      step={0.1}
                      onChange={(val) => setCfg(val)}
                    />

                    <CustomSlider
                      label="Denoise Strength"
                      value={denoise}
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      onChange={(val) => setDenoise(val)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#64748B', marginTop: -2, marginBottom: 8, padding: '0 2px' }}>
                      <span title="Denoise 0.10 - 0.40: Preserves exact structural lines, sharpens micro-textures">0.35 Polish</span>
                      <span title="Denoise 0.45 - 0.55: Calibrated for materials, textures, and lighting">0.50 Re-Edit</span>
                      <span title="Denoise 0.70 - 1.00: High structural variation / redesign">0.85 Overhaul</span>
                    </div>

                    <div className="form-group" style={{ marginTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Seed</span>
                        <button
                          onClick={() => setIsRandomSeed(!isRandomSeed)}
                          style={{ border: 'none', background: 'none', color: '#2563EB', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                        >
                          {isRandomSeed ? 'Randomized' : 'Fixed'}
                        </button>
                      </div>
                      <input
                        type="number"
                        className="input-control"
                        disabled={isRandomSeed}
                        value={isRandomSeed ? '' : seed}
                        onChange={(e) => setSeed(Number(e.target.value))}
                        placeholder="Randomized Seed"
                      />
                    </div>

                    <CustomSwitch
                      label="4K Latent Tile Refine"
                      checked={upscale4k}
                      onChange={(val) => setUpscale4k(val)}
                      description="Secondary high-frequency unsharp VAE pass"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Generate Button Matching Reference Mockup: [ ✦ Generate | ↥ Credit ] */}
              <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                {isGenerating ? (
                  <button
                    type="button"
                    className="btn-stop-generation"
                    onClick={handleStopGeneration}
                    style={{
                      width: '100%',
                      height: 42,
                      borderRadius: 8,
                      background: '#DC2626',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
                    }}
                  >
                    <Square size={13} fill="currentColor" />
                    <span>Stop Generation</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    style={{
                      width: '100%',
                      height: 42,
                      borderRadius: 8,
                      background: '#0F172A',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.25)',
                      transition: 'all 150ms ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#1E293B')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#0F172A')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
                      <Sparkles size={14} style={{ color: '#FFFFFF' }} />
                      <span>Generate</span>
                    </div>
                    <div style={{ width: 1, height: 18, background: 'rgba(255, 255, 255, 0.25)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 16px', color: '#94A3B8', fontSize: 12, fontWeight: 500 }}>
                      <Upload size={12} style={{ color: '#94A3B8' }} />
                      <span style={{ color: '#E2E8F0' }}>Credit</span>
                    </div>
                  </button>
                )}
              </div>
            </aside>
          )}

          {/* Feedback 2: Workspace Feed - Clean, isolated to active project, no pre-dumped examples */}
          <main className="workspace-content">
            <div className="assets-feed">
              {/* Halftone Dot Matrix Wave Loader Card while generating */}
              {isGenerating && (
                <DotMatrixLoaderCard
                  modelName="Qwen Image 2.1 (8B DiT)"
                  taskCode={TASK_SHORT_CODES[selectedTaskId] || 'GEN'}
                  prompt={prompt}
                  onCancel={handleStopGeneration}
                  onStop={handleStopGeneration}
                />
              )}

              {/* Bulk Action Header when items are selected */}
              {selectedRunIds.size > 0 && (
                <div
                  style={{
                    background: '#111827',
                    color: '#FFFFFF',
                    padding: '10px 16px',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {selectedRunIds.size} asset(s) selected
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setSelectedRunIds(new Set())}
                      style={{ border: 'none', background: 'transparent', color: '#9CA3AF', cursor: 'pointer', fontSize: 12 }}
                    >
                      Deselect
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      style={{
                        background: '#DC2626',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Trash2 size={13} /> Delete Selected
                    </button>
                  </div>
                </div>
              )}

              {/* Clean Empty State when no renders exist for this project yet and not generating */}
              {currentProjectRuns.length === 0 && !isGenerating ? (
                <div style={{ textAlign: 'center', padding: '120px 20px', color: '#9CA3AF' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      color: '#6B7280'
                    }}
                  >
                    <Layers size={28} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                    No renders in project {currentProjectId} yet
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, maxWidth: 440, margin: '6px auto 16px' }}>
                    Configure your parameters on the left and click Generate, or click below to load a sample prompt into the editor.
                  </p>
                  <button
                    onClick={handleLoadExample}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#374151',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    Load Sample Prompt & Sketch into Editor
                  </button>
                </div>
              ) : (
                currentProjectRuns.map((run) => (
                  <AssetFeedItem
                    key={run.id}
                    run={run}
                    zoomLevel={zoomLevel}
                    isSelected={selectedRunIds.has(run.id)}
                    onToggleSelect={handleToggleSelectRun}
                    onDelete={handleDeleteAsset}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenModal={(url, title, promptText) => setModalImage({ url, title, prompt: promptText })}
                    onTriggerUpscale4k={handleTriggerUpscale4k}
                    onUpdateAssetRun={handleUpdateAssetRun}
                    onSendToStudio={handleSendToStudio}
                  />
                ))
              )}
            </div>
          </main>

          {/* Floating Mobile Studio Toggle Button */}
          <button
            type="button"
            className="mobile-studio-toggle-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Open Controls" : "View Render Feed"}
          >
            {isSidebarCollapsed ? (
              <>
                <Sliders size={14} />
                <span>Controls &amp; Parameters</span>
              </>
            ) : (
              <>
                <Layers size={14} />
                <span>View Feed ({currentProjectRuns.length})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Projects & Bookmarks Drawer */}
      <ProjectsDrawer
        isOpen={isProjectsDrawerOpen}
        onClose={() => setIsProjectsDrawerOpen(false)}
        currentProjectId={currentProjectId}
        projects={projects}
        onSelectProject={(id) => {
          setCurrentProjectId(id);
          setIsProjectsDrawerOpen(false);
        }}
        onCreateProject={handleCreateNewProject}
        showBookmarkedOnly={showBookmarkedOnly}
        onToggleBookmarkedOnly={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
      />

      {/* High-Resolution Lightbox Modal Viewer */}
      {modalImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: 32
          }}
          onClick={() => setModalImage(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage.url}
              alt={modalImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 12,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            />
            <div style={{ marginTop: 12, color: '#FFFFFF', textAlign: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{modalImage.title}</h3>
              <p style={{ fontSize: 13, color: '#9CA3AF', maxWidth: 700, margin: '4px auto 0' }}>
                {modalImage.prompt}
              </p>
            </div>
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#111827'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Visual Feedback with Agentation */}
      <Agentation endpoint="http://localhost:4747" />
    </div>
  );
}
