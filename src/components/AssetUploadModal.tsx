import React, { useState, useRef } from 'react';
import { X, Upload, Check, RefreshCw, Sparkles, Sliders } from 'lucide-react';
import { removeWhiteBackground } from '../utils/assetManager';

interface AssetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroImage: string;
  categoryImage: string;
  onUpdateHeroImage: (dataUrl: string) => void;
  onUpdateCategoryImage: (dataUrl: string) => void;
  onResetAssets: () => void;
  hasCustomHero: boolean;
  hasCustomCategory: boolean;
}

export const AssetUploadModal: React.FC<AssetUploadModalProps> = ({
  isOpen,
  onClose,
  heroImage,
  categoryImage,
  onUpdateHeroImage,
  onUpdateCategoryImage,
  onResetAssets,
  hasCustomHero,
  hasCustomCategory,
}) => {
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [loadingHero, setLoadingHero] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const heroInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (
    file: File,
    type: 'hero' | 'category'
  ) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      if (type === 'hero') {
        setLoadingHero(true);
        try {
          const finalImage = autoRemoveBg ? await removeWhiteBackground(result) : result;
          onUpdateHeroImage(finalImage);
        } finally {
          setLoadingHero(false);
        }
      } else {
        setLoadingCategory(true);
        try {
          const finalImage = autoRemoveBg ? await removeWhiteBackground(result) : result;
          onUpdateCategoryImage(finalImage);
        } finally {
          setLoadingCategory(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Character Asset Manager"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#0d0d12] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono-numbers text-[#a100ff] uppercase tracking-widest">
              <Sparkles size={13} />
              <span>CUSTOM PERSONA ASSETS</span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
              Character Asset Manager
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-neutral-400 text-xs sm:text-sm mt-3">
          Upload or drag & drop your exact reference images (<code className="text-purple-300">1790257010973.png</code> & <code className="text-purple-300">1790301417831.png</code>). They are stored directly in your browser with full original quality.
        </p>

        {/* Auto Background Removal Toggle */}
        <div className="mt-4 p-3 rounded-xl bg-[#13131a] border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders size={16} className="text-[#a100ff]" />
            <div>
              <span className="text-xs font-semibold text-white block">
                Auto-Remove White Studio Background
              </span>
              <span className="text-[11px] text-neutral-400">
                Transforms white studio backdrop into seamless transparency for the dark gallery
              </span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoRemoveBg}
            onClick={() => setAutoRemoveBg(!autoRemoveBg)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              autoRemoveBg ? 'bg-[#8b00ff]' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                autoRemoveBg ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Two Upload Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Card 1: Top Person / Laptop Hero (1790257010973.png) */}
          <div className="p-4 rounded-xl bg-[#08080b] border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-xs uppercase text-white tracking-wide">
                  Top Person — Laptop Hero
                </span>
                {hasCustomHero && (
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center gap-1">
                    <Check size={11} /> Custom
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 font-mono-numbers mb-3">
                Asset: 1790257010973.png
              </p>

              {/* Preview Thumbnail */}
              <div className="relative aspect-[3/4] rounded-lg bg-[#0f0f14] border border-neutral-800/80 overflow-hidden flex items-center justify-center p-2 mb-3">
                <img
                  src={heroImage}
                  alt="Hero Laptop Person Preview"
                  className="w-full h-full object-contain"
                />
                {loadingHero && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-purple-300">
                    Processing image...
                  </div>
                )}
              </div>
            </div>

            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileProcess(file, 'hero');
              }}
            />

            <button
              onClick={() => heroInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-lg bg-[#14121f] hover:bg-[#1f1933] border border-purple-900/60 hover:border-purple-600 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload size={14} />
              <span>Select 1790257010973.png</span>
            </button>
          </div>

          {/* Card 2: Bottom Person / Category Pointer (1790301417831.png) */}
          <div className="p-4 rounded-xl bg-[#08080b] border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-xs uppercase text-white tracking-wide">
                  Bottom Person — Categories
                </span>
                {hasCustomCategory && (
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center gap-1">
                    <Check size={11} /> Custom
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 font-mono-numbers mb-3">
                Asset: 1790301417831.png
              </p>

              {/* Preview Thumbnail */}
              <div className="relative aspect-[3/4] rounded-lg bg-[#0f0f14] border border-neutral-800/80 overflow-hidden flex items-center justify-center p-2 mb-3">
                <img
                  src={categoryImage}
                  alt="Category Pointer Person Preview"
                  className="w-full h-full object-contain"
                />
                {loadingCategory && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-purple-300">
                    Processing image...
                  </div>
                )}
              </div>
            </div>

            <input
              ref={categoryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileProcess(file, 'category');
              }}
            />

            <button
              onClick={() => categoryInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-lg bg-[#14121f] hover:bg-[#1f1933] border border-purple-900/60 hover:border-purple-600 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload size={14} />
              <span>Select 1790301417831.png</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
          <button
            onClick={onResetAssets}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8b00ff] to-[#a100ff] text-white text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
