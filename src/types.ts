export type StudentLevel = 'elementary' | 'middle' | 'high' | 'college';

export type TemplateId = 'space' | 'cyber' | 'biology' | 'history' | 'minimal' | 'sunset';

export interface TemplateTheme {
  id: TemplateId;
  name: string;
  tagline: string;
  bgHex: string;
  cardBgHex: string;
  primaryHex: string;
  accentHex: string;
  textHex: string;
  subtextHex: string;
  fontHeading: string;
  fontBody: string;
  badge: string;
  previewGradient: string;
}

export interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  speakerNotes: string;
  imagePrompt: string;
  imageUrl: string;
  imageCaption?: string;
  callout?: string;
  layoutType: 'title' | 'split-right' | 'split-left' | 'cards' | 'quote' | 'summary';
  aiVisualType?: 'ai-diagram' | 'sourced';
  svgCode?: string;
  sourcedImageUrl?: string;
  aiGeneratedImageUrl?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface PresentationData {
  id: string;
  topic: string;
  studentLevel: StudentLevel;
  slideCount: number;
  templateId: TemplateId;
  theme: TemplateTheme;
  title: string;
  subtitle: string;
  audienceTakeaway: string;
  slides: Slide[];
  sources: GroundingSource[];
  createdAt: string;
}

export interface GeneratePresentationRequest {
  topic: string;
  studentLevel: StudentLevel;
  slideCount: number;
  templateId?: TemplateId;
  customNotes?: string;
  useAdvancedAiVisuals?: boolean;
}

export type AntigravityMode = 'zero-g' | 'earth-g' | 'vortex' | 'paused';
