export const TASK_SHORT_CODES: Record<string, string> = {
  arch_text_to_arch: 'T2A',
  arch_sketch_to_arch: 'S2A',
  arch_sketch_to_multiview: 'S2MVA',
  arch_image_edit: 'AIE',
  arch_enhance_render: 'ETDTER',
  interior_sketch_to_design: 'S2ID',
  interior_room_new_look: 'GYNL',
  interior_image_edit: 'IDEE',
  interior_fully_redesign: 'FRMR',
  furniture_sketch_to_render: 'S2F',
  furniture_edit: 'FE',
  furniture_text_to_render: 'T2F'
};

export const SHORT_CODE_TO_TASK_ID: Record<string, string> = {
  T2A: 'arch_text_to_arch',
  S2A: 'arch_sketch_to_arch',
  S2MVA: 'arch_sketch_to_multiview',
  AIE: 'arch_image_edit',
  ETDTER: 'arch_enhance_render',
  ETDOTR: 'arch_enhance_render',
  S2ID: 'interior_sketch_to_design',
  GYNL: 'interior_room_new_look',
  GYRNL: 'interior_room_new_look',
  IDEE: 'interior_image_edit',
  IDIE: 'interior_image_edit',
  FRMR: 'interior_fully_redesign',
  S2F: 'furniture_sketch_to_render',
  FE: 'furniture_edit',
  T2F: 'furniture_text_to_render'
};

export const SUITE_TASKS = {
  architecture: [
    'arch_text_to_arch',
    'arch_sketch_to_arch',
    'arch_sketch_to_multiview',
    'arch_image_edit',
    'arch_enhance_render'
  ],
  interior_furniture: [
    'interior_sketch_to_design',
    'interior_room_new_look',
    'interior_image_edit',
    'interior_fully_redesign',
    'furniture_sketch_to_render',
    'furniture_edit',
    'furniture_text_to_render'
  ]
};

export const TASK_EXAMPLE_IMAGES: Record<string, string> = {
  arch_text_to_arch: '/examples/ARCH/T2A/make%20a%20luxury%20villa%20with%203%20floors.png',
  arch_sketch_to_arch: '/examples/ARCH/S2A/Output.png',
  arch_sketch_to_multiview: '/examples/ARCH/S2MVA/Front.png',
  arch_image_edit: '/examples/ARCH/AIE/Output.png',
  arch_enhance_render: '/examples/ARCH/ETDOTR/Output.png',
  interior_sketch_to_design: '/examples/INTERIOR%20DESIGNING/S2ID/Output.png',
  interior_room_new_look: '/examples/INTERIOR%20DESIGNING/GYRNL/Output.png',
  interior_image_edit: '/examples/INTERIOR%20DESIGNING/IDIE/2ef4a26e-36a2-4844-a69f-01b5045ce54e.png',
  interior_fully_redesign: '/examples/INTERIOR%20DESIGNING/FRMR/Ouput.png',
  furniture_sketch_to_render: '/examples/FURNITURE/S2F/Output.png',
  furniture_edit: '/examples/FURNITURE/FE/Output.png',
  furniture_text_to_render: '/examples/FURNITURE/T2F/Create%20a%20detailed%20big%20closet%20to%20store%20My%20Clothings.png'
};

export const TASK_INPUT_IMAGES: Record<string, string> = {
  arch_sketch_to_arch: '/examples/ARCH/S2A/Input.jpg',
  arch_sketch_to_multiview: '/examples/ARCH/S2MVA/Input.jpg',
  arch_image_edit: '/examples/ARCH/AIE/input.png',
  arch_enhance_render: '/examples/ARCH/ETDOTR/input.png',
  interior_sketch_to_design: '/examples/INTERIOR%20DESIGNING/S2ID/Input.jpg',
  interior_room_new_look: '/examples/INTERIOR%20DESIGNING/GYRNL/Input.avif',
  interior_image_edit: '/examples/INTERIOR%20DESIGNING/IDIE/d43dac51-50e8-481b-bd96-ac6646881ad8.png',
  interior_fully_redesign: '/examples/INTERIOR%20DESIGNING/FRMR/Input.webp',
  furniture_sketch_to_render: '/examples/FURNITURE/S2F/Input.jpg',
  furniture_edit: '/examples/FURNITURE/FE/input.png'
};

