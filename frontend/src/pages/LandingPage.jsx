import React, { useState } from 'react';
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
  Check,
} from 'lucide-react';

export default function LandingPage({ setCurrentView, showToast }) {
  const [heroSheetOpacity, setHeroSheetOpacity] = useState(80);
  const [heroActiveSheet, setHeroActiveSheet] = useState('ORI-01');
  const [perspectiveStep, setPerspectiveStep] = useState(2);
  const [vectorElevation, setVectorElevation] = useState(45);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(2);

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
            <div className="relative w-full max-w-[620px] aspect-[4/3] rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-xl bg-slate-950 select-none">
              {/* BASE LAYER: Original Drone Survey Photo (Full Size) */}
              <img
                src="/indian_satellite_aerial.jpg"
                alt="Original Drone Survey Imagery"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* LEFT LABEL: Original Drone Image */}
              <div className="absolute top-4 left-4 z-10 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[11px] font-mono font-bold text-white shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>ORIGINAL DRONE IMAGERY (0.05m GSD)</span>
              </div>

              {/* RIGHT LAYER: EXACT SAME Drone Photo with OVERLAID CADASTRAL VECTOR EXTRACTION */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${heroSheetOpacity}%)` }}
              >
                {/* Identical background image */}
                <img
                  src="/indian_satellite_aerial.jpg"
                  alt="AI Cadastral Output on Same Drone Image"
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.92]"
                />

                {/* Vector Cadastral Geometry Overlays aligned precisely with the drone features */}
                <div className="absolute inset-0 w-full h-full">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 800 600"
                    preserveAspectRatio="none"
                  >
                    {/* Sy No. 101 - Agricultural Survey Parcel */}
                    <polygon
                      points="40,160 260,110 330,310 90,360"
                      fill="#10B981"
                      fillOpacity="0.28"
                      stroke="#10B981"
                      strokeWidth="3.5"
                    />
                    {/* Sy No. 102 - Settlement Parcel */}
                    <polygon
                      points="265,108 520,60 560,260 335,308"
                      fill="#3B82F6"
                      fillOpacity="0.28"
                      stroke="#3B82F6"
                      strokeWidth="3.5"
                    />
                    {/* Sy No. 103 - Commercial / Roadside Plot */}
                    <polygon
                      points="525,58 760,100 780,310 565,258"
                      fill="#8B5CF6"
                      fillOpacity="0.28"
                      stroke="#8B5CF6"
                      strokeWidth="3.5"
                    />
                    {/* Sy No. 104 - Southern Agricultural Plot */}
                    <polygon
                      points="95,365 340,315 375,540 130,570"
                      fill="#EC4899"
                      fillOpacity="0.28"
                      stroke="#EC4899"
                      strokeWidth="3.5"
                    />
                    {/* Sy No. 105 - Abadi Parcel */}
                    <polygon
                      points="345,313 570,263 605,510 380,538"
                      fill="#14B8A6"
                      fillOpacity="0.28"
                      stroke="#14B8A6"
                      strokeWidth="3.5"
                    />
                    {/* Sy No. 106 - Canal / Public Boundary */}
                    <polygon
                      points="575,261 775,312 790,520 610,508"
                      fill="#6366F1"
                      fillOpacity="0.28"
                      stroke="#6366F1"
                      strokeWidth="3.5"
                    />

                    {/* Extracted Building Footprints (Conforming to Rooflines) */}
                    <polygon
                      points="380,140 440,125 455,190 395,205"
                      fill="#EF4444"
                      fillOpacity="0.6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <polygon
                      points="460,135 500,125 510,175 470,185"
                      fill="#EF4444"
                      fillOpacity="0.6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <polygon
                      points="410,340 470,325 485,395 425,410"
                      fill="#F97316"
                      fillOpacity="0.6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <polygon
                      points="495,340 545,330 555,385 505,395"
                      fill="#F97316"
                      fillOpacity="0.6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* Extracted Village Road Centerline Corridor */}
                    <polyline
                      points="0,320 330,305 565,255 800,285"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="6"
                      strokeDasharray="10 6"
                    />
                  </svg>

                  {/* Parcel ID Annotation Badges */}
                  <div className="absolute top-[28%] left-[20%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-0.5 rounded shadow-md border border-emerald-500 text-[10px] font-mono font-bold text-emerald-800">
                    Sy No. 101 (2,450 m²)
                  </div>
                  <div className="absolute top-[22%] left-[54%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-0.5 rounded shadow-md border border-blue-500 text-[10px] font-mono font-bold text-blue-800">
                    Sy No. 102 (1,890 m²)
                  </div>
                  <div className="absolute top-[24%] left-[82%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-0.5 rounded shadow-md border border-purple-500 text-[10px] font-mono font-bold text-purple-800">
                    Sy No. 103 (3,120 m²)
                  </div>
                  <div className="absolute top-[68%] left-[28%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-0.5 rounded shadow-md border border-pink-500 text-[10px] font-mono font-bold text-pink-800">
                    Sy No. 104 (1,740 m²)
                  </div>
                  <div className="absolute top-[65%] left-[62%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-0.5 rounded shadow-md border border-teal-500 text-[10px] font-mono font-bold text-teal-800">
                    Sy No. 105 (Abadi)
                  </div>

                  {/* Boundary Stone GCP Marker */}
                  <div className="absolute top-[51%] left-[42%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#0F172A] text-white px-2 py-0.5 rounded-full shadow-lg border border-white/40 text-[9px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>सी.मा. / BS-04 (GCP Lock)</span>
                  </div>
                </div>

                {/* RIGHT LABEL: AI Digital Cadastral Map */}
                <div className="absolute top-4 right-4 z-10 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-400 text-[11px] font-mono font-bold text-emerald-400 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AI DIGITAL CADASTRAL MAP (DERIVED)</span>
                </div>
              </div>

              {/* Scrub Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-20 pointer-events-none"
                style={{ left: `${heroSheetOpacity}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0F172A] text-white border-2 border-white shadow-xl flex items-center justify-center text-xs font-bold">
                  ⇄
                </div>
              </div>

              {/* Preset Comparison Buttons in Top Right Overlay */}
              <div className="absolute bottom-16 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#CBD5E1] shadow-lg">
                <button
                  onClick={() => setHeroSheetOpacity(100)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    heroSheetOpacity === 100
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-[#475569] hover:bg-[#F1F5F9]'
                  }`}
                >
                  Raw Drone
                </button>
                <button
                  onClick={() => setHeroSheetOpacity(50)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    heroSheetOpacity === 50
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-[#475569] hover:bg-[#F1F5F9]'
                  }`}
                >
                  50/50 Split
                </button>
                <button
                  onClick={() => setHeroSheetOpacity(0)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    heroSheetOpacity === 0
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-[#475569] hover:bg-[#F1F5F9]'
                  }`}
                >
                  Cadastre Map
                </button>
              </div>

              {/* Bottom Control Bar with Split Slider */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#CBD5E1] shadow-lg flex items-center justify-between gap-4">
                <span className="text-[11px] font-mono font-bold text-[#475569] uppercase tracking-wider shrink-0">
                  RAW DRONE
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heroSheetOpacity}
                  onChange={(e) => setHeroSheetOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0F172A]"
                />
                <div className="flex items-center gap-2 min-w-[130px] justify-end shrink-0">
                  <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                    AI CADASTRAL MAP
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* SECTION 2: 4-STEP PROCESS FLOW & MULTI-SOURCE EXTRACTION */}
      {/* ======================================================================= */}
      <section
        id="extraction-preview"
        className="py-24 w-full bg-white border-b border-[#E2E8F0] overflow-hidden"
      >
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
              Platform Technical Components
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-4 mb-4 tracking-tight">
              Multi-Source AI Engine: Pixels to Validated GIS Parcels
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Integrating 2D Nadir & 5-camera Oblique imagery with Digital
              Surface Models (DSM) and Digital Terrain Models (DTM) to solve
              dense urban settlements, overlapping rooflines, and irregular
              geometries.
            </p>
          </div>

          {/* 3D Perspective Interactive Stage Container */}
          <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-10 shadow-lg overflow-hidden">
            {/* 4 Pipeline Tabs (Replaced per CHANGE 1) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
                {[
                  {
                    id: 0,
                    label: '01 Upload Survey Data',
                    sub: 'Drone imagery, orthophotos, DSM/DTM, cadastral scans.',
                  },
                  {
                    id: 1,
                    label: '02 AI Parcel Extraction',
                    sub: 'Detect parcel boundaries, buildings, roads, and land features.',
                  },
                  {
                    id: 2,
                    label: '03 Cadastral Generation',
                    sub: 'Convert AI detections into GIS-ready parcel layers and cadastral records.',
                  },
                  {
                    id: 3,
                    label: '04 Verification & QA',
                    sub: 'Validate topology, compare with legacy records, and prepare final outputs.',
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setPerspectiveStep(st.id);
                      showToast(`Process Stage: ${st.label}`);
                    }}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                      perspectiveStep === st.id
                        ? 'bg-[#0F172A] text-white shadow-md'
                        : 'bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] border border-[#CBD5E1]'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold mb-1">{st.label}</div>
                    <div className="text-[11px] leading-tight opacity-80">{st.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Perspective Stage on Identical Survey Image */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-md bg-slate-900 flex items-center justify-center [perspective:1000px]">
              {/* Ground Base: Orthorectified Imagery */}
              <div
                className="absolute inset-4 rounded-xl overflow-hidden transition-all duration-500"
                style={{
                  transform: `rotateX(24deg) rotateZ(-12deg) scale(0.95)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src="/indian_satellite_aerial.jpg"
                  alt="True Orthorectified Imagery"
                  className="w-full h-full object-cover brightness-[0.85]"
                />

                {/* Cadastral Layer on Top */}
                {(perspectiveStep >= 1) && (
                  <div
                    className="absolute inset-8 pointer-events-none transition-all duration-500"
                    style={{
                      transform: `translateZ(${vectorElevation}px)`,
                    }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 800 600">
                      {/* Sy No. 101 Parcel Polygon */}
                      <polygon
                        points="40,160 260,110 330,310 90,360"
                        fill="#10B981"
                        fillOpacity="0.32"
                        stroke="#10B981"
                        strokeWidth="3.5"
                      />
                      {/* Sy No. 102 Building Footprint */}
                      <polygon
                        points="265,108 520,60 560,260 335,308"
                        fill="#3B82F6"
                        fillOpacity="0.32"
                        stroke="#3B82F6"
                        strokeWidth="3.5"
                      />
                      {/* Sy No. 103 Parcel Polygon */}
                      <polygon
                        points="525,58 760,100 780,310 565,258"
                        fill="#8B5CF6"
                        fillOpacity="0.32"
                        stroke="#8B5CF6"
                        strokeWidth="3.5"
                      />
                      {/* Road Corridor Polyline */}
                      <polyline
                        points="0,320 330,305 565,255 800,285"
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="5"
                        strokeDasharray="8 6"
                      />
                    </svg>

                    {/* GNSS / CORS Ground Truthing Control Points */}
                    <div className="absolute top-[28%] left-[32%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-[#0F172A] shadow-lg flex items-center justify-center text-[9px] font-bold text-white">
                        GCP
                      </div>
                      <span className="ml-2 bg-white/95 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold text-[#0F172A] shadow-md border border-[#CBD5E1]">
                        RTK Fixed (±0.02m)
                      </span>
                    </div>

                    <div className="absolute top-[65%] right-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-[#0F172A] shadow-lg flex items-center justify-center text-[9px] font-bold text-white">
                        CORS
                      </div>
                      <span className="ml-2 bg-white/95 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold text-[#0F172A] shadow-md border border-[#CBD5E1]">
                        SOI CORS Network
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Status Pill */}
              <div className="absolute bottom-4 left-4 z-30 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] flex items-center gap-3 shadow-md">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Automated Topology Validation Passed
                </span>
                <span className="text-[#CBD5E1]">|</span>
                <span className="font-semibold">0 Gaps · 0 Overlaps Flagged</span>
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

          {/* 5 Connected Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border border-[#E2E8F0] rounded-2xl bg-white shadow-sm overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
            {[
              {
                id: 1,
                time: 'MAP-1.1',
                icon: UploadCloud,
                title: 'Drone & Elevation Ingestion',
                desc: 'Ingest raw drone photos (2D Nadir & 5-camera Oblique), True Ortho-Rectified Imagery (ORI), and DSM/DTM elevation models.',
              },
              {
                id: 2,
                time: 'MAP-1.2',
                icon: Crosshair,
                title: 'GNSS/CORS Coordinate Fix',
                desc: 'Survey of India Area of Interest (AOI) boundary lock using Ground Control Points (GCPs) and RTK Rover survey data.',
              },
              {
                id: 3,
                time: 'MAP-1.3',
                icon: Sparkles,
                title: 'AI Parcel & Building Extraction',
                desc: 'Deep learning models (U-Net/Mask R-CNN) delineate parcel boundaries, building footprints, road corridors, and land-use classes.',
              },
              {
                id: 4,
                time: 'MAP-2.0',
                icon: CheckCircle2,
                title: 'Ground Truthing (GT) Verification',
                desc: 'Web-GIS dashboard for field surveyors to cross-check AI preliminary drafts against RTK coordinates and resolve discrepancies.',
              },
              {
                id: 5,
                time: 'MAP-3.0',
                icon: Download,
                title: 'Land Stack & PostGIS Export',
                desc: 'Export GIS-ready layers (Shapefile, GeoJSON, PostGIS) directly to TNGIS, ULB tax systems, and National Land Stack.',
              },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeWorkflowStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveWorkflowStep(step.id);
                    showToast(`NAKSHA Stage: ${step.title}`);
                  }}
                  className={`p-7 flex flex-col justify-between cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#F8FAFC] border-t-2 border-t-[#0F172A]'
                      : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-[#0F172A] text-white shadow-md'
                            : 'bg-[#F1F5F9] text-[#475569]'
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#94A3B8]">
                        {step.time}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] mb-3 leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
      <section id="benefits" className="py-24 w-full bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
                Stakeholders & Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-4 mb-6 tracking-tight">
                Accelerating Urban Land Governance & Municipal Operations
              </h2>
              <p className="text-base text-[#64748B] leading-relaxed mb-8">
                Bridging the national gap where only 21 of 72 ULBs completed
                ground truthing due to manual digitization bottlenecks.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Land Revenue & Survey Departments (COSS / DoLR)',
                    desc: 'Review and approve AI-generated draft maps, dramatically reducing turnaround time on official cadastral surveys.',
                  },
                  {
                    title: 'Urban Local Bodies (ULBs) & Municipalities',
                    desc: 'Accurate property tax demand generation, building permit verification, and detection of illegal encroachments.',
                  },
                  {
                    title: 'Urban Planners & Development Authorities (CMDA)',
                    desc: 'Infrastructure master planning, zoning, transit-oriented development, and transport corridor modeling.',
                  },
                  {
                    title: 'Ground Truthing Teams & Field Surveyors',
                    desc: 'Cross-check AI preliminary vectors against GNSS/CORS coordinates on RTK Rovers to quickly resolve boundary errors.',
                  },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="p-4.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                        {b.title}
                      </h4>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Metrics Stat Box (From NAKSHA Document) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-black text-[#0F172A] font-mono mb-2">
                  152
                </span>
                <span className="text-sm font-bold text-[#0F172A] mb-1">
                  Pilot ULBs
                </span>
                <span className="text-xs text-[#64748B]">
                  Across 26 States & 3 UTs (4,142 sq. km)
                </span>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-black text-emerald-600 font-mono mb-2">
                  4,912
                </span>
                <span className="text-sm font-bold text-[#0F172A] mb-1">
                  Target Scale-Up ULBs
                </span>
                <span className="text-xs text-[#64748B]">
                  National coverage under DILRMP
                </span>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-black text-amber-600 font-mono mb-2">
                  ₹194 Cr
                </span>
                <span className="text-sm font-bold text-[#0F172A] mb-1">
                  Central Scheme Funding
                </span>
                <span className="text-xs text-[#64748B]">
                  100% funded by Govt of India
                </span>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-black text-[#0F172A] font-mono mb-2">
                  100%
                </span>
                <span className="text-sm font-bold text-[#0F172A] mb-1">
                  TNGIS & PostGIS Ready
                </span>
                <span className="text-xs text-[#64748B]">
                  GeoServer, QGIS & PostGIS compatible
                </span>
              </div>
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
