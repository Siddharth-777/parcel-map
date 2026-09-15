import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  UploadCloud,
  Crosshair,
  Sparkles,
  CheckCircle2,
  Download,
  Layers,
  Building,
  Navigation,
  Database,
} from 'lucide-react';

export default function LandingPage({ setCurrentView }) {
  const [heroSheetOpacity, setHeroSheetOpacity] = useState(50);
  const [perspectiveStep, setPerspectiveStep] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(2);

  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const updateSplit = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setHeroSheetOpacity(percent);
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updateSplit(e);
  }, [updateSplit]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    updateSplit(e);
  }, [updateSplit]);

  const handlePointerUp = useCallback((e) => {
    isDragging.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* ======================================================================= */}
      {/* SECTION 1: HERO SECTION (INTERACTIVE BEFORE/AFTER SPLIT COMPARISON) */}
      {/* ======================================================================= */}
      <section className="relative min-h-[88vh] w-full flex items-center overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
        {/* Subtle Light Grid Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Pipeline Progression Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] mb-6 w-fit shadow-xs">
              <span className="font-mono text-[#475569]">Drone Image</span>
              <span className="text-[#94A3B8]">→</span>
              <span className="font-mono font-bold text-[#0F172A]">AI Analysis</span>
              <span className="text-[#94A3B8]">→</span>
              <span className="font-mono font-bold text-emerald-700">Digital Cadastral Map</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] leading-[1.1] mb-6">
              AI-Enabled Urban Cadastral Mapping &{' '}
              <span className="text-[#0F172A] underline decoration-2 decoration-slate-300 underline-offset-8">
                Parcel Delineation.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mb-8">
              Automate preliminary urban parcel boundaries, building
              footprints, and road corridors from high-resolution drone
              imagery (ORI), DSM/DTM elevation models, and GNSS/CORS survey
              data.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="h-12 px-6 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Start Cadastral Survey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('workflow');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-12 px-6 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Explore NAKSHA Workflow</span>
                <ArrowUpRight className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>

            {/* Hero Footnote */}
            <div className="pt-6 border-t border-[#E2E8F0] max-w-lg">
              <p className="text-xs text-[#64748B] leading-relaxed">
                Solves the manual feature extraction bottleneck at the MAP-1
                survey stage for Survey of India (SOI), State Revenue
                Departments (COSS), and Urban Local Bodies (ULBs).
              </p>
            </div>
          </motion.div>

          {/* Right Column: Interactive Exact Before/After Cadastral Extraction Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 relative flex flex-col items-center"
          >
            <div
              ref={containerRef}
              className="relative w-full max-w-[620px] aspect-[4/3] rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-xl bg-slate-950 select-none cursor-ew-resize touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* BASE LAYER: Layer 1 — Ground (Drone Imagery) */}
              <img
                src="/layer-ground.jpg"
                alt="Layer 1 — Ground (Original Drone Imagery)"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* LEFT LABEL: Original Drone Image */}
              <div className="absolute top-4 left-4 z-10 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[11px] font-mono font-bold text-white shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>ORIGINAL DRONE IMAGERY (0.05m GSD)</span>
              </div>

              {/* RIGHT LAYER: Layer 4 — Cadastral (AI Output) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${heroSheetOpacity}%)` }}
              >
                <img
                  src="/layer-cadastral.jpg"
                  alt="Layer 4 — AI Digital Cadastral Map"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* RIGHT LABEL: AI Digital Cadastral Map */}
                <div className="absolute top-4 right-4 z-10 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-400 text-[11px] font-mono font-bold text-emerald-400 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AI DIGITAL CADASTRAL MAP (DERIVED)</span>
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.6)] z-20 pointer-events-none"
                style={{ left: `${heroSheetOpacity}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0F172A] border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
                  ⇄
                </div>
              </div>

              {/* Bottom Slider Control */}
              <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#0F172A]/90 backdrop-blur-md px-4 py-2 flex items-center gap-3 pointer-events-auto">
                <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-wider shrink-0">
                  RAW DRONE
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heroSheetOpacity}
                  onChange={(e) => setHeroSheetOpacity(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
                />
                <span className="text-[10px] font-mono font-bold text-white tabular-nums shrink-0 w-[38px] text-center">
                  {Math.round(heroSheetOpacity)}/{Math.round(100 - heroSheetOpacity)}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider shrink-0">
                  AI CADASTRAL
                </span>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* SECTION 2: NAKSHA SOP — 3D STACK VISUALIZATION */}
      {/* ======================================================================= */}
      <section
        id="extraction-preview"
        className="relative w-full h-screen bg-[#0F172A] border-b border-[#1E293B]"
      >
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8 py-10 sm:py-14 h-full flex flex-col">
          {/* Section Header */}
          <div className="max-w-3xl mb-6">
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#94A3B8] mb-2">
              NAKSHA STANDARD OPERATING PROCEDURE
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
              Four Layer, One dataset.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Four stages from raw drone capture to GIS-ready land records — each layer
              builds on the last under the National Geospatial Mission framework.
            </p>
          </div>

          {/* 3D Layer Stack Container */}
          <div className="relative flex gap-6 lg:gap-10 flex-1 min-h-0">
            {/* Left: Layer Navigation with MAP codes */}
            <div className="hidden sm:flex flex-col items-center pt-8 relative">
              {/* Vertical line */}
              <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-px bg-white/16"></div>
              {/* Layer buttons */}
              <div className="relative flex flex-col gap-5 z-10">
                {[
                  { id: 0, code: 'Layer-1', label: 'Ground' },
                  { id: 1, code: 'Layer-2', label: 'Source Plan' },
                  { id: 2, code: 'Layer-3', label: 'Parcel' },
                  { id: 3, code: 'Layer-4', label: 'Cadastral' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setPerspectiveStep(btn.id)}
                    className={`flex items-center gap-2.5 text-left transition-all cursor-pointer group ${
                      perspectiveStep >= btn.id ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full transition-all ${
                      perspectiveStep === btn.id ? 'bg-white scale-125' : 'bg-white/40'
                    }`}></span>
                    <div className="flex flex-col">
                      <span className={`text-[9px] font-mono uppercase tracking-wider transition-colors ${
                        perspectiveStep === btn.id ? 'text-white/90' : 'text-white/30'
                      }`}>
                        {btn.code}
                      </span>
                      <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors leading-tight ${
                        perspectiveStep === btn.id ? 'text-white font-bold' : 'text-white/50'
                      }`}>
                        {btn.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Center: 3D Isometric Layer Stack */}
            <div className="flex-1 relative min-h-0 flex flex-col">
              {/* Layer Info — above the image container */}
              <div className="mb-3 min-h-[48px] flex items-center">
                {perspectiveStep === 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">Layer 1 · Ground</p>
                    <p className="text-[11px] sm:text-xs font-mono text-white/60 mt-1 leading-relaxed max-w-lg">Geo-referenced satellite/drone base imagery of the terrain</p>
                  </div>
                )}
                {perspectiveStep === 1 && (
                  <div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">Layer 2 · Source Plan</p>
                    <p className="text-[11px] sm:text-xs font-mono text-white/60 mt-1 leading-relaxed max-w-lg">Revenue survey sketch overlaid with boundary measurements</p>
                  </div>
                )}
                {perspectiveStep === 2 && (
                  <div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">Layer 3 · Parcel</p>
                    <p className="text-[11px] sm:text-xs font-mono text-white/60 mt-1 leading-relaxed max-w-lg">AI-extracted parcel polygons with ownership attribution</p>
                  </div>
                )}
                {perspectiveStep === 3 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <div>
                      <p className="text-xs sm:text-sm font-mono font-bold text-emerald-300 uppercase tracking-wider">Layer 4 · Cadastral</p>
                      <p className="text-[11px] sm:text-xs font-mono text-white/70 mt-1 leading-relaxed">Cadastral map created — all layers merged into one GIS-ready dataset</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image container */}
              <div className="relative flex-1 min-h-0 flex items-center justify-center">
              <div className="relative aspect-square h-full max-w-full rounded-2xl bg-black border border-white/[0.06] shadow-2xl overflow-hidden"
                style={{ perspective: '2200px' }}
              >
                {/* 3D transformed container */}
                <div
                  className="absolute inset-0 z-10 transition-transform duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: perspectiveStep === 3
                      ? 'rotateX(0deg) rotateZ(0deg) scale(0.9)'
                      : 'rotateX(50deg) rotateZ(-40deg) scale(0.55)',
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Layer 00: Ground */}
                  <div
                    className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden transition-all duration-700"
                    style={{
                      transform: perspectiveStep === 3 ? 'translateZ(0px) scale(0.91)' : 'translateZ(0px)',
                      opacity: 1,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                  >
                    <img
                      src="/layer-ground.jpg"
                      alt="Layer 1 — Ground"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Layer 01: Source Plan */}
                  <div
                    className={`absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden transition-all duration-700 ${
                      perspectiveStep >= 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: perspectiveStep === 3
                        ? 'translateZ(0px) scale(0.91)'
                        : `translateZ(${perspectiveStep >= 1 ? '80px' : '160px'})`,
                      boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
                    }}
                  >
                    <img
                      src="/layer-source-plan.jpg"
                      alt="Layer 2 — Source Plan"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Layer 02: Parcel */}
                  <div
                    className={`absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden transition-all duration-700 ${
                      perspectiveStep >= 2 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: perspectiveStep === 3
                        ? 'translateZ(0px) scale(0.91)'
                        : `translateZ(${perspectiveStep >= 2 ? '160px' : '240px'})`,
                      boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
                    }}
                  >
                    <img
                      src="/layer-parcel.jpg"
                      alt="Layer 3 — Parcel"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Layer 03: Cadastral — flat combined final view */}
                  {perspectiveStep === 3 && (
                    <div
                      className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden transition-all duration-700 opacity-100"
                      style={{
                        transform: 'translateZ(1px) scale(0.91)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
                      }}
                    >
                      <img
                        src="/layer-cadastral.jpg"
                        alt="Layer 4 — Cadastral"
                        className="w-full h-full object-cover brightness-[0.85]"
                      />
                    </div>
                  )}
                </div>
              </div>
              </div>

              {/* Mobile layer buttons */}
              <div className="flex sm:hidden items-center gap-2 mt-4 overflow-x-auto pb-2">
                {[
                  { id: 0, label: 'Ground' },
                  { id: 1, label: 'Source Plan' },
                  { id: 2, label: 'Parcel' },
                  { id: 3, label: 'Cadastral' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setPerspectiveStep(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                      perspectiveStep === btn.id
                        ? 'bg-white text-[#0F172A]'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Progress bar */}
            <div className="hidden lg:flex flex-col items-center pt-8 pb-8">
              <div className="relative w-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full bg-white rounded-full transition-all duration-500"
                  style={{ height: `${((perspectiveStep + 1) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ======================================================================= */}
      {/* SECTION 3: 5-STEP NAKSHA SOP & PROCESS TIMELINE */}
      {/* ======================================================================= */}
      <section
        id="workflow"
        className="py-24 w-full bg-[#FAF9F5] text-[#111827] border-b border-[#E5E7EB]"
      >
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8">
          {/* Section Headline */}
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-[#0F172A] mb-4">
              NAKSHA Standard Operating Procedure: Flight to Final Cadastre.
            </h2>
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              Automating the MAP-1 feature extraction stage to accelerate
              MAP-2 field verification (Ground Truthing) and MAP-3 legal
              ownership finalization under the National Geospatial Mission.
            </p>
          </div>

          {/* Sliding Step Carousel */}
          {(() => {
            const steps = [
              {
                id: 1,
                time: 'MAP-1.1',
                icon: UploadCloud,
                img: '/map-1.1.jpg',
                title: 'Drone & Elevation Ingestion',
                desc: 'Ingest raw drone photos (2D Nadir & 5-camera Oblique), True Ortho-Rectified Imagery (ORI), and DSM/DTM elevation models.',
              },
              {
                id: 2,
                time: 'MAP-1.2',
                icon: Crosshair,
                img: '/map-1.2.jpg',
                title: 'GNSS/CORS Coordinate Fix',
                desc: 'Survey of India Area of Interest (AOI) boundary lock using Ground Control Points (GCPs) and RTK Rover survey data.',
              },
              {
                id: 3,
                time: 'MAP-1.3',
                icon: Sparkles,
                img: '/map-1.3.jpg',
                title: 'AI Parcel & Building Extraction',
                desc: 'Deep learning models (U-Net/Mask R-CNN) delineate parcel boundaries, building footprints, road corridors, and land-use classes.',
              },
              {
                id: 4,
                time: 'MAP-2.0',
                icon: CheckCircle2,
                img: '/map-2.0.jpg',
                title: 'Ground Truthing (GT) Verification',
                desc: 'Web-GIS dashboard for field surveyors to cross-check AI preliminary drafts against RTK coordinates and resolve discrepancies.',
              },
              {
                id: 5,
                time: 'MAP-3.0',
                icon: Download,
                img: '/map-3.0.jpg',
                title: 'Land Stack & PostGIS Export',
                desc: 'Export GIS-ready layers (Shapefile, GeoJSON, PostGIS) directly to TNGIS, ULB tax systems, and National Land Stack.',
              },
            ];
            const current = steps[activeWorkflowStep - 1];
            return (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Step navigation pills */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-64 shrink-0">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = activeWorkflowStep === step.id;
                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveWorkflowStep(step.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0F172A] text-white shadow-lg'
                            : 'bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-white/60' : 'text-[#94A3B8]'}`}>
                            {step.time}
                          </span>
                          <span className="text-[12px] font-semibold leading-tight">
                            {step.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Active step content with slide */}
                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-lg">
                    {/* Dominant image */}
                    <div className="relative w-full h-64 sm:h-80 lg:h-[420px] bg-[#0F172A]">
                      <img
                        key={current.id}
                        src={current.img}
                        alt={`${current.time} - ${current.title}`}
                        className="w-full h-full object-contain animate-[fadeSlide_0.4s_ease-out]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {/* Overlay info on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <span className="inline-block text-[11px] font-mono font-bold text-white/80 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-lg mb-3">
                          {current.time}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          {current.title}
                        </h3>
                        <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                          {current.desc}
                        </p>
                      </div>
                      {/* Step counter */}
                      <div className="absolute top-5 right-5 text-[11px] font-mono font-bold text-white/70 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        {activeWorkflowStep} / 5
                      </div>
                    </div>

                    {/* Bottom navigation arrows */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-[#FAFAFA]">
                      <button
                        onClick={() => setActiveWorkflowStep(Math.max(1, activeWorkflowStep - 1))}
                        disabled={activeWorkflowStep === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Previous
                      </button>
                      {/* Progress dots */}
                      <div className="flex gap-1.5">
                        {steps.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setActiveWorkflowStep(s.id)}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                              activeWorkflowStep === s.id
                                ? 'bg-[#0F172A] w-5'
                                : 'bg-[#CBD5E1] hover:bg-[#94A3B8]'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setActiveWorkflowStep(Math.min(5, activeWorkflowStep + 1))}
                        disabled={activeWorkflowStep === 5}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-[#0F172A] text-white hover:bg-[#1E293B]"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ======================================================================= */}
      {/* SECTION 4: SYSTEM FUNCTIONAL REQUIREMENTS (6 Cards) */}
      {/* ======================================================================= */}
      <section id="features" className="py-24 w-full bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
              System Functional Requirements
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-4 mb-4 tracking-tight">
              Core AI/ML Modules for Urban Cadastral Preparation
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Engineered to meet the exact technical components specified by
              DoLR, Survey of India, and TNeGA for urban land record
              modernization.
            </p>
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: 'Automatic Parcel Boundary Delineation',
                desc: 'Deep learning segmentation (U-Net, Mask R-CNN) detects and traces plot boundary lines without manual mouse digitizing.',
                meta: 'Automated 1st-Draft Boundary Vectors',
              },
              {
                icon: Building,
                title: 'Building Footprint Identification',
                desc: 'Delineates individual buildings and separates structural roof overhangs from true ground footprints using DSM/DTM height data.',
                meta: 'DSM / DTM Height Disambiguation',
              },
              {
                icon: Navigation,
                title: 'Roads, Pathways & Access Corridors',
                desc: 'Extracts narrow internal alleys, cart tracks, and access corridors common in dense Indian urban settlements and old city quarters.',
                meta: 'Narrow Lane & Pathway Snapping',
              },
              {
                icon: Sparkles,
                title: 'Land-Use Feature Classification',
                desc: 'Categorizes parcels and areas by use type (residential, commercial, industrial, vacant, institutional) beyond simple geometry.',
                meta: 'Multi-Class Land Use Categorization',
              },
              {
                icon: CheckCircle2,
                title: 'Automated Topology QA & Generation',
                desc: 'Enforces spatial integrity rules ensuring properly shared boundaries between adjacent parcels with zero gaps and zero overlaps.',
                meta: 'Automated Polygon Topology Module',
              },
              {
                icon: Database,
                title: 'GIS-Ready Outputs for TNGIS & PostGIS',
                desc: 'Outputs directly usable by GeoServer, PostGIS, QGIS, ESRI Shapefile, and GeoJSON without manual schema conversion.',
                meta: 'PostGIS · GeoServer · Shapefile · GeoJSON',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-black hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] mb-6 group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2.5 group-hover:text-black transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#E2E8F0] text-[11px] font-mono font-bold text-[#0F172A] tracking-wider uppercase">
                    {feat.meta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* SECTION 5: STAKEHOLDER VALUE & PROJECT OUTCOMES */}
      {/* ======================================================================= */}
      <section id="benefits" className="py-20 w-full bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-3">
              National Scale & Impact
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Deployed under the DILRMP & National Geospatial Mission to modernize urban land records across India.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E8F0] rounded-xl overflow-hidden border border-[#E2E8F0]">
            <div className="p-6 sm:p-8 bg-white">
              <span className="text-3xl sm:text-4xl font-black text-[#0F172A] font-mono block mb-1">152</span>
              <span className="text-xs font-bold text-[#0F172A]">Pilot ULBs</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">26 States · 4,142 sq. km</span>
            </div>
            <div className="p-6 sm:p-8 bg-white">
              <span className="text-3xl sm:text-4xl font-black text-[#10B981] font-mono block mb-1">4,912</span>
              <span className="text-xs font-bold text-[#0F172A]">Scale-Up Target</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">National coverage</span>
            </div>
            <div className="p-6 sm:p-8 bg-white">
              <span className="text-3xl sm:text-4xl font-black text-[#B45309] font-mono block mb-1">₹194 Cr</span>
              <span className="text-xs font-bold text-[#0F172A]">Central Funding</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">100% Govt of India</span>
            </div>
            <div className="p-6 sm:p-8 bg-white">
              <span className="text-3xl sm:text-4xl font-black text-[#0F172A] font-mono block mb-1">100%</span>
              <span className="text-xs font-bold text-[#0F172A]">GIS-Ready</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">PostGIS · TNGIS · QGIS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* SECTION 6: READY TO CONVERT CTA */}
      {/* ======================================================================= */}
      <section className="py-24 w-full bg-gradient-to-b from-white to-[#F1F5F9] text-center relative overflow-hidden border-b border-[#E2E8F0]">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-6 shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-4">
            Ready to Automate Urban Cadastral Mapping?
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed mb-8 max-w-xl mx-auto">
            Ingest high-resolution drone imagery (ORI), Digital Surface
            Models (DSM), and GNSS field survey data to generate validated
            preliminary GIS parcel layers.
          </p>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="h-13 px-8 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white font-bold text-base flex items-center gap-2.5 mx-auto shadow-md transition-all cursor-pointer"
          >
            <span>Launch Cadastral Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="py-10 w-full bg-white text-xs text-[#64748B]">
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">GEO-DRAFT</span>
            <span>| AI-Enabled Urban Cadastral Mapping Platform | Aligned with NAKSHA (DoLR) & TNGIS (TNeGA/COSS)</span>
          </div>
          <div className="flex items-center gap-6">
            <span>DILRMP Compliant</span>
            <span>EPSG:32644 (UTM 44N)</span>
            <span>Land Stack Interoperable</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
