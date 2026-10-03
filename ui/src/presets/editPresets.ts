/**
 * CiviGen Curated Re-Edit & Inpainting Presets
 * Domain-calibrated for Qwen Image 2.1 architectural, interior, and furniture refinement.
 * Each preset provides an engineered prompt and precision-tuned denoise factor.
 */

export interface EditPreset {
  id: string;
  label: string;
  icon: string;
  category: 'architecture' | 'interior' | 'furniture' | 'all';
  group: 'lighting' | 'materials' | 'features' | 'styles' | 'refine';
  description: string;
  prompt: string;
  denoise: number;
  badge: string;
}

export const EDIT_PRESETS: EditPreset[] = [
  // =========================================================================
  // 1. ARCHITECTURE EXTERIOR PRESETS
  // =========================================================================
  {
    id: 'arch_golden_hour',
    label: 'Sunset Golden Hour',
    icon: '🌅',
    category: 'architecture',
    group: 'lighting',
    description: 'Warm twilight glow with glowing interior window illumination',
    prompt: 'Transform lighting to magical twilight sunset, warm golden hour illumination casting soft elongated shadows, warm amber interior lights glowing through floor-to-ceiling glass windows, dramatic evening sky with subtle orange and violet gradient.',
    denoise: 0.45,
    badge: 'Golden Hour'
  },
  {
    id: 'arch_dramatic_night',
    label: 'Night & Recessed LEDs',
    icon: '🌙',
    category: 'architecture',
    group: 'lighting',
    description: 'Atmospheric nighttime photography with warm soffit lighting',
    prompt: 'Convert to nighttime architectural photography, dark clear night sky, warm recessed LED soffit lighting illuminating the facade, outdoor illuminated pathways, glowing interior spaces with elegant architectural fixtures.',
    denoise: 0.48,
    badge: 'Night Scene'
  },
  {
    id: 'arch_pool_landscape',
    label: 'Infinity Pool & Garden',
    icon: '🌿',
    category: 'architecture',
    group: 'features',
    description: 'Add luxury reflection pool, palms, and travertine terrace',
    prompt: 'Add luxury manicured architectural landscaping in the foreground, modern infinity reflection pool with subtle water caustics, travertine stepping stones, tropical palms, and minimalist outdoor path lighting.',
    denoise: 0.55,
    badge: 'Landscaping'
  },
  {
    id: 'arch_shou_sugi_ban',
    label: 'Charred Timber Slats',
    icon: '🪵',
    category: 'architecture',
    group: 'materials',
    description: 'Upgrade facade with vertical charred wood and bronze accents',
    prompt: 'Upgrade facade cladding with vertical charred Shou Sugi Ban timber slats and warm teak accents, preserving the structural envelope, crisp material transitions with brushed dark bronze reveals.',
    denoise: 0.50,
    badge: 'Timber Cladding'
  },
  {
    id: 'arch_travertine_stone',
    label: 'Roman Travertine Stone',
    icon: '🏛️',
    category: 'architecture',
    group: 'materials',
    description: 'Clad exterior walls in honed beige Roman travertine',
    prompt: 'Replace exterior facade panels with honed Roman beige travertine stone with visible natural porosity, smooth architectural limestone trim, and seamless flush joints.',
    denoise: 0.50,
    badge: 'Travertine'
  },
  {
    id: 'arch_curtain_wall',
    label: 'Panoramic Glass Walls',
    icon: '🏢',
    category: 'architecture',
    group: 'features',
    description: 'Floor-to-ceiling double-glazed black aluminum facade',
    prompt: 'Upgrade all window apertures to floor-to-ceiling double-glazed black anodized aluminum curtain walls with ultra-clear low-iron glass, subtle reflection of surrounding sky and foliage.',
    denoise: 0.52,
    badge: 'Glass Facade'
  },
  {
    id: 'arch_cantilever_pergola',
    label: 'Cantilever Pergola & Louvers',
    icon: '📐',
    category: 'architecture',
    group: 'features',
    description: 'Modern steel pergola with motorized timber louver fins',
    prompt: 'Add cantilevered modern dark steel pergola over the terrace with automated motorized timber louvered shading fins, integrated micro-spotlights, and seamless architectural bracketry.',
    denoise: 0.54,
    badge: 'Pergola'
  },
  {
    id: 'arch_micro_detail_refine',
    label: '4K Micro-Texture Sharpen',
    icon: '💎',
    category: 'architecture',
    group: 'refine',
    description: 'Subtle sharpening of concrete pores, stone grains, and glass reflections',
    prompt: 'Preserve building geometry and composition with 100% precision. Enhance micro-textures: crisp concrete pores, tactile wood grain, razor-sharp window mullions, clean glass reflections, and ambient corner shading.',
    denoise: 0.35,
    badge: '4K Sharpen'
  },

  // =========================================================================
  // 2. INTERIOR DESIGN PRESETS
  // =========================================================================
  {
    id: 'interior_herringbone_floor',
    label: 'Herringbone Oak Floor',
    icon: '🪵',
    category: 'interior',
    group: 'materials',
    description: 'French herringbone natural light oak parquet hardwood',
    prompt: 'Replace existing flooring with French herringbone natural light oak parquet hardwood, matte satin polyurethane finish, subtle wood grain variation, seamless brass threshold transitions.',
    denoise: 0.46,
    badge: 'Oak Floor'
  },
  {
    id: 'interior_cove_lighting',
    label: 'Cove Lighting & Ceiling',
    icon: '💡',
    category: 'interior',
    group: 'lighting',
    description: 'Architectural false ceiling with warm indirect LED cove strip',
    prompt: 'Add architectural recessed false ceiling with continuous warm indirect 3000K LED cove strip illumination, minimalist flush downlights, and elegant shadow gap perimeter reveal.',
    denoise: 0.48,
    badge: 'Cove Lighting'
  },
  {
    id: 'interior_calacatta_marble',
    label: 'Calacatta Marble Feature Wall',
    icon: '🪨',
    category: 'interior',
    group: 'materials',
    description: 'Bookmatched Italian Calacatta Gold marble feature wall',
    prompt: 'Add high-end feature accent wall clad in bookmatched polished Italian Calacatta Gold marble with warm grey and honey veining, floating minimalist media console below.',
    denoise: 0.50,
    badge: 'Marble Wall'
  },
  {
    id: 'interior_scandi_boucle',
    label: 'Scandinavian Bouclé & Ash',
    icon: '🛋️',
    category: 'interior',
    group: 'styles',
    description: 'Curved cream bouclé sofa, bleached ash wood, wool rug',
    prompt: 'Restyle room furnishings with curated Scandinavian minimalism: curved cream textured bouclé sofa, bleached ash wood coffee table, sculptural travertine lamp, and soft wool area rug.',
    denoise: 0.58,
    badge: 'Scandinavian'
  },
  {
    id: 'interior_japandi_slats',
    label: 'Japandi Fluted Oak Slats',
    icon: '🌿',
    category: 'interior',
    group: 'styles',
    description: 'Vertical fluted acoustic wood paneling & bonsai plant',
    prompt: 'Transform space with Japandi aesthetic: vertical fluted natural oak acoustic wall paneling, bonsai plant on pedestal, low-profile linen seating, and peaceful earthy ceramic decor.',
    denoise: 0.54,
    badge: 'Japandi'
  },
  {
    id: 'interior_sheer_curtains',
    label: 'Floor-to-Ceiling Sheer Linen',
    icon: '🪟',
    category: 'interior',
    group: 'features',
    description: 'Recessed motorized flowing sheer curtains with diffused sunlight',
    prompt: 'Install ceiling-recessed motorized flowing off-white sheer linen drapery extending floor-to-ceiling across the windows, diffusing natural daytime sunlight into a soft luminous ambient glow.',
    denoise: 0.45,
    badge: 'Sheer Curtains'
  },
  {
    id: 'interior_bespoke_cabinetry',
    label: 'Bespoke Flush Cabinetry',
    icon: '📚',
    category: 'interior',
    group: 'features',
    description: 'Floor-to-ceiling minimalist cabinetry with LED display niches',
    prompt: 'Add custom floor-to-ceiling minimalist built-in cabinetry with flush handleless matte cabinetry doors, integrated open display niches with micro-LED shelf lighting, and designer books.',
    denoise: 0.52,
    badge: 'Millwork'
  },
  {
    id: 'interior_detail_polish',
    label: 'Tactile Material Polish',
    icon: '💎',
    category: 'interior',
    group: 'refine',
    description: 'Sharpen upholstery weave, marble veining, and ambient illumination',
    prompt: 'Preserve room boundaries, furniture placement, and geometry. Dramatically refine tactile textures: fabric upholstery weave, polished stone sheen, glass reflections, and ambient depth.',
    denoise: 0.35,
    badge: '4K Refine'
  },

  // =========================================================================
  // 3. FURNITURE INDUSTRIAL DESIGN PRESETS
  // =========================================================================
  {
    id: 'furn_emerald_velvet',
    label: 'Emerald Green Velvet',
    icon: '🛋️',
    category: 'furniture',
    group: 'materials',
    description: 'Rich emerald green velvet with deep diamond button tufting',
    prompt: 'Change upholstery to rich emerald green velvet fabric with deep diamond button tufting, tailored piped perimeter seams, and authentic plush nap light reaction.',
    denoise: 0.48,
    badge: 'Emerald Velvet'
  },
  {
    id: 'furn_cognac_leather',
    label: 'Cognac Saddle Leather',
    icon: '🐂',
    category: 'furniture',
    group: 'materials',
    description: 'Supple Italian saddle leather with natural pull-up patina',
    prompt: 'Change upholstery to supple hand-stitched cognac Italian saddle leather with natural pull-up patina, fine saddle stitching, and subtle surface grain texture.',
    denoise: 0.48,
    badge: 'Italian Leather'
  },
  {
    id: 'furn_walnut_brass',
    label: 'Walnut & Brushed Brass',
    icon: '🪵',
    category: 'furniture',
    group: 'materials',
    description: 'American dark walnut frame with satin champagne brass hardware',
    prompt: 'Refinish wood frame in rich deep dark American walnut with hand-rubbed oil finish, highlighted by brushed satin champagne brass metal ferrules, hardware, and accents.',
    denoise: 0.46,
    badge: 'Walnut & Brass'
  },
  {
    id: 'furn_matte_black',
    label: 'Matte Black Steel Frame',
    icon: '🖤',
    category: 'furniture',
    group: 'materials',
    description: 'Architectural powder-coated matte black steel legs and frame',
    prompt: 'Refinish all legs, frame elements, and exposed hardware in fine-textured powder-coated architectural matte black steel with clean welded joints.',
    denoise: 0.42,
    badge: 'Matte Black'
  },
  {
    id: 'furn_softbox_studio',
    label: 'Studio Cyclorama Lighting',
    icon: '💡',
    category: 'furniture',
    group: 'lighting',
    description: 'Commercial 3-point softbox studio lighting on neutral cyclorama',
    prompt: 'Enhance commercial studio product lighting: pristine neutral light grey cyclorama backdrop, soft 3-point diffused softbox lighting with crisp rim highlights, and grounded contact shadow.',
    denoise: 0.40,
    badge: 'Softbox Studio'
  },
  {
    id: 'furn_micro_refine',
    label: 'Product Detail Refinement',
    icon: '💎',
    category: 'furniture',
    group: 'refine',
    description: 'Sharpen stitch lines, genuine wood pores, and metal specular sheen',
    prompt: 'Preserve the exact furniture silhouette and dimensions. Refine micro-textures: crisp fabric weave, genuine wood pores, realistic stitching, and clean specular highlights.',
    denoise: 0.32,
    badge: 'Detail Polish'
  }
];

export function getPresetsForCategory(category?: string): EditPreset[] {
  const cat = (category || '').toLowerCase();
  if (cat.includes('interior')) {
    return EDIT_PRESETS.filter((p) => p.category === 'interior' || p.category === 'all');
  }
  if (cat.includes('furniture')) {
    return EDIT_PRESETS.filter((p) => p.category === 'furniture' || p.category === 'all');
  }
  return EDIT_PRESETS.filter((p) => p.category === 'architecture' || p.category === 'all');
}
