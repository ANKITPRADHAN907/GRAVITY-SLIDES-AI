import { TemplateId, TemplateTheme } from '../types';

export const TEMPLATES: Record<TemplateId, TemplateTheme> = {
  space: {
    id: 'space',
    name: 'Cosmic Antigravity',
    tagline: 'Deep space nebulae, celestial cyan & electric violet',
    bgHex: '#08080C',
    cardBgHex: '#101018',
    primaryHex: '#22D3EE', // cyan-400
    accentHex: '#A855F7',  // purple-500
    textHex: '#E0E0FF',
    subtextHex: '#9D9DBF',
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    badge: 'Astrophysics & Sciences',
    previewGradient: 'from-[#08080C] via-purple-950/40 to-cyan-950/40',
  },
  cyber: {
    id: 'cyber',
    name: 'Cybernetic Future',
    tagline: 'High-tech neon emerald, matrix grid & circuitry',
    bgHex: '#061314',
    cardBgHex: '#0B2023',
    primaryHex: '#10B981', // emerald
    accentHex: '#06B6D4',  // cyan
    textHex: '#ECFDF5',
    subtextHex: '#6EE7B7',
    fontHeading: 'JetBrains Mono',
    fontBody: 'Plus Jakarta Sans',
    badge: 'Computer Science & AI',
    previewGradient: 'from-slate-950 via-teal-950 to-emerald-900',
  },
  biology: {
    id: 'biology',
    name: 'BioLab & Nature',
    tagline: 'Organic botanicals, vitality greens & warm moss',
    bgHex: '#0C1710',
    cardBgHex: '#152B1E',
    primaryHex: '#22C55E', // green
    accentHex: '#EAB308',  // amber
    textHex: '#F0FDF4',
    subtextHex: '#86EFAC',
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    badge: 'Ecology & Life Sciences',
    previewGradient: 'from-emerald-950 via-green-950 to-stone-900',
  },
  history: {
    id: 'history',
    name: 'Heritage & Classics',
    tagline: 'Antiquity parchment, imperial bronze & gold accents',
    bgHex: '#1A140F',
    cardBgHex: '#2B2018',
    primaryHex: '#F59E0B', // amber gold
    accentHex: '#E11D48',  // ruby
    textHex: '#FEF3C7',
    subtextHex: '#D97706',
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    badge: 'History & Humanities',
    previewGradient: 'from-stone-950 via-amber-950 to-stone-900',
  },
  minimal: {
    id: 'minimal',
    name: 'Modern Clean Slate',
    tagline: 'Sleek executive minimalism, crisp typography & cobalt',
    bgHex: '#0F172A',
    cardBgHex: '#1E293B',
    primaryHex: '#6366F1', // indigo
    accentHex: '#38BDF8',  // sky
    textHex: '#FFFFFF',
    subtextHex: '#CBD5E1',
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    badge: 'Universal & Business',
    previewGradient: 'from-slate-950 via-slate-900 to-indigo-950',
  },
  sunset: {
    id: 'sunset',
    name: 'Creative Horizon',
    tagline: 'Vibrant sunset gradients, coral embers & violet dream',
    bgHex: '#190A1A',
    cardBgHex: '#2C112D',
    primaryHex: '#F43F5E', // rose
    accentHex: '#A855F7',  // purple
    textHex: '#FFF1F2',
    subtextHex: '#FDA4AF',
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    badge: 'Arts, Literature & Media',
    previewGradient: 'from-purple-950 via-pink-950 to-rose-900',
  },
};

export const SAMPLE_TOPICS = [
  {
    topic: 'Distributed Systems & Raft Consensus Architecture',
    level: 'college' as const,
    template: 'cyber' as const,
    badge: 'B.Tech CSE',
  },
  {
    topic: 'Microprocessor 5-Stage Pipeline Hazards & Cache Coherence',
    level: 'college' as const,
    template: 'cyber' as const,
    badge: 'B.Tech ECE',
  },
  {
    topic: 'How Do Black Holes Bend Space and Time?',
    level: 'high' as const,
    template: 'space' as const,
    badge: 'Physics',
  },
  {
    topic: 'Transformer Neural Networks & Multi-Head Self-Attention',
    level: 'college' as const,
    template: 'cyber' as const,
    badge: 'AI Eng',
  },
  {
    topic: 'The Marvel of Photosynthesis and Plant Energy',
    level: 'elementary' as const,
    template: 'biology' as const,
    badge: 'Nature',
  },
  {
    topic: 'Ancient Egypt: Engineering the Great Pyramids',
    level: 'middle' as const,
    template: 'history' as const,
    badge: 'History',
  },
];
