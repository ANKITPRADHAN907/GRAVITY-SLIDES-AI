import React from 'react';
import { AntigravityMode, TemplateTheme } from '../types';
import { Orbit, Compass, Zap, Pause, Play, Eye, Sparkles } from 'lucide-react';

interface AntigravityControlsProps {
  mode: AntigravityMode;
  onChangeMode: (mode: AntigravityMode) => void;
  is3DView: boolean;
  onToggle3DView: () => void;
  theme: TemplateTheme;
  hasCitations?: boolean;
  citationsCount?: number;
  onOpenCitations?: () => void;
}

export const AntigravityControls: React.FC<AntigravityControlsProps> = ({
  mode,
  onChangeMode,
  is3DView,
  onToggle3DView,
  theme,
  hasCitations,
  citationsCount = 0,
  onOpenCitations,
}) => {
  return (
    <div
      id="antigravity-hud"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 rounded-full border border-white/15 shadow-2xl backdrop-blur-2xl transition-all bg-[#101018]/90"
      style={{
        boxShadow: `0 20px 40px -15px #08080C, 0 0 25px -5px ${theme.primaryHex}33`,
      }}
    >
      {/* Zero Gravity Mode Selector */}
      <div className="flex items-center gap-1 px-1">
        <button
          id="mode-zero-g-btn"
          type="button"
          onClick={() => onChangeMode('zero-g')}
          title="Zero-G Floating Physics"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
            mode === 'zero-g'
              ? 'text-black bg-white shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Orbit className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Zero-G</span>
        </button>

        <button
          id="mode-earth-g-btn"
          type="button"
          onClick={() => onChangeMode('earth-g')}
          title="Earth Gravity (Downward Settling)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
            mode === 'earth-g'
              ? 'text-black bg-white shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>1.0 G</span>
        </button>

        <button
          id="mode-vortex-btn"
          type="button"
          onClick={() => onChangeMode('vortex')}
          title="Vortex Spiral Orbital Gravity"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
            mode === 'vortex'
              ? 'text-black bg-white shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Vortex</span>
        </button>

        <button
          id="mode-pause-btn"
          type="button"
          onClick={() => onChangeMode(mode === 'paused' ? 'zero-g' : 'paused')}
          title={mode === 'paused' ? 'Resume Motion' : 'Freeze 3D Physics'}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {mode === 'paused' ? (
            <Play className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Pause className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <div className="w-[1px] h-5 bg-white/15 mx-0.5" />

      {/* 3D Spatial Carousel View Toggle */}
      <button
        id="toggle-3d-view-btn"
        type="button"
        onClick={onToggle3DView}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
          is3DView
            ? 'text-cyan-300 font-bold bg-white/10 border border-cyan-400/40 shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>{is3DView ? '3D Orbit' : 'Deck View'}</span>
      </button>

      {/* Grounding Citations Trigger */}
      {hasCitations && onOpenCitations && (
        <>
          <div className="w-[1px] h-5 bg-white/15 mx-0.5" />
          <button
            id="hud-citations-btn"
            type="button"
            onClick={onOpenCitations}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-cyan-300 hover:bg-cyan-500/15 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Google Data ({citationsCount})</span>
          </button>
        </>
      )}
    </div>
  );
};
