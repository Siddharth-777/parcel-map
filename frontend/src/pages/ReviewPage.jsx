import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapContainer,
  Polygon,
  Polyline,
  Popup,
} from 'react-leaflet';
import BaseTileLayer from '../components/BaseTileLayer';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  Ruler,
  Building,
  Navigation,
  AlertTriangle,
  ArrowUpDown,
  Database,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { WORKSPACE_PARCELS, WORKSPACE_BUILDINGS, WORKSPACE_ROADS, INITIAL_REVIEW_QUEUE } from '../data/mockData';

export default function ReviewPage({ setCurrentView, showToast, showParcelsLayer, setShowParcelsLayer, showBuildingsLayer, setShowBuildingsLayer, showRoadsLayer, setShowRoadsLayer, showLabelsLayer, setShowLabelsLayer, mapBaseLayer, setMapBaseLayer }) {
  const [reviewZoom, setReviewZoom] = useState(75);
  const [reviewPan, setReviewPan] = useState({ x: 0, y: 0 });
  const [isPanningReview, setIsPanningReview] = useState(false);
  const [startPanReview, setStartPanReview] = useState({ x: 0, y: 0 });
  const [reviewFilter, setReviewFilter] = useState('ALL');
  const [reviewQueueData, setReviewQueueData] = useState(INITIAL_REVIEW_QUEUE);
  const [sortAscending, setSortAscending] = useState(true);

  const handleMouseDownReviewImage = (e) => {
    if (e.button !== 0) return;
    setIsPanningReview(true);
    setStartPanReview({ x: e.clientX - reviewPan.x, y: e.clientY - reviewPan.y });
  };

  const handleMouseMoveReviewImage = (e) => {
    if (!isPanningReview) return;
    setReviewPan({
      x: e.clientX - startPanReview.x,
      y: e.clientY - startPanReview.y,
    });
  };

  const handleMouseUpReviewImage = () => setIsPanningReview(false);

  const toggleApproveQueueItem = (id) => {
    setReviewQueueData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Approved' ? 'Needs Review' : 'Approved',
              severity: item.status === 'Approved' ? 'warning' : 'success',
            }
          : item
      )
    );
    showToast(`Updated status for object ${id}`);
  };

  const filteredReviewItems = reviewQueueData
    .filter((item) => {
      if (reviewFilter === 'PARCELS') return item.type.includes('Parcel');
      if (reviewFilter === 'BUILDINGS') return item.type.includes('Building');
      if (reviewFilter === 'ROADS') return item.type.includes('Road');
      if (reviewFilter === 'FLAGGED') return item.status === 'Needs Review';
      return true;
    })
    .sort((a, b) => {
      if (sortAscending) return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id);
    });

  return (
        <main className="flex-1 flex flex-col justify-between bg-[#F8FAFC] text-[#0F172A]">
          <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-16 flex-1 flex flex-col justify-between">
            <div>
              {/* Top Page Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
                <div>
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-2">
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="hover:text-[#0F172A] hover:underline cursor-pointer"
                    >
                      Project Overview
                    </button>
                    <span>&gt;</span>
                    <button
                      onClick={() => setCurrentView('workspace')}
                      className="hover:text-[#0F172A] hover:underline cursor-pointer"
                    >
                      Workspace
                    </button>
                    <span>&gt;</span>
                    <span className="text-[#0F172A] font-semibold">Review & Export</span>
                  </div>

                  {/* Title & Status Badge */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                      Urban Cadastral Mapping Review
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#065F46] shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      Extraction Complete ✅
                    </span>
                  </div>

                  {/* Metadata Bar */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-[#64748B] font-mono">
                    <div>
                      <span className="text-[#94A3B8]">Project: </span>
                      <span className="font-semibold text-[#0F172A]">
                        NAKSHA-TN-ULB-104 (Ramnagar Sector)
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Processing Time: </span>
                      <span className="font-semibold text-[#0F172A]">2m 48s</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Dataset: </span>
                      <span className="font-semibold text-[#0F172A]">
                        drone_ortho_ramnagar_05m.tif (ORI + DSM)
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Extraction Date: </span>
                      <span className="font-semibold text-[#0F172A]">25 Aug 2026</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Header Buttons */}
                <div className="flex items-center gap-3 self-start lg:self-auto">
                  <button
                    onClick={() => setCurrentView('workspace')}
                    className="h-9 px-3.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-xs font-semibold text-[#334155] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>← Back to Workspace</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('approval');
                      showToast('Navigating to Approval & Export Center');
                    }}
                    className="h-9 px-4 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Approve Results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Workflow Stepper: Active Step 4 (Review) */}
              <div className="my-6 w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:px-8 shadow-xs">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>Upload</span>
                  </div>
                  <span className="text-[#CBD5E1]">&gt;</span>
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>Georeference</span>
                  </div>
                  <span className="text-[#CBD5E1]">&gt;</span>
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>Extract</span>
                  </div>
                  <span className="text-[#CBD5E1]">&gt;</span>
                  <div className="flex items-center gap-2 text-[#0F172A] bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
                    <Clock className="w-4 h-4 text-[#0F172A]" />
                    <span className="font-bold">Review (Active)</span>
                  </div>
                  <span className="text-[#CBD5E1]">&gt;</span>
                  <button
                    onClick={() => {
                      setCurrentView('approval');
                      showToast('Navigating to Approval & Export Center');
                    }}
                    className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Approval & Export</span>
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT: TWO-PANEL GIS COMPARISON AREA */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* LEFT PANEL: SOURCE IMAGERY */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden flex flex-col min-h-[500px]">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0F172A]" />
                      <h3 className="text-sm font-bold text-[#0F172A]">Source Imagery</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-[#CBD5E1] text-[#475569]">
                        True Orthorectified Image (ORI)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <button
                        onClick={() => {
                          setReviewZoom(75);
                          setReviewPan({ x: 0, y: 0 });
                          showToast('Reset source image zoom & pan');
                        }}
                        title="Reset View"
                        className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#CBD5E1] text-[#475569] transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none min-h-[440px]"
                    onMouseDown={handleMouseDownReviewImage}
                    onMouseMove={handleMouseMoveReviewImage}
                    onMouseUp={handleMouseUpReviewImage}
                    onMouseLeave={handleMouseUpReviewImage}
                  >
                    <div
                      className="relative transition-transform duration-75"
                      style={{
                        transform: `translate(${reviewPan.x}px, ${reviewPan.y}px) scale(${reviewZoom / 100})`,
                        transformOrigin: 'center center',
                      }}
                    >
                      <img
                        src="/indian_satellite_aerial.jpg"
                        alt="Source Drone Imagery"
                        className="max-w-[650px] w-auto h-auto rounded shadow-2xl block pointer-events-none"
                      />
                    </div>

                    {/* Left Panel Floating Controls */}
                    <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-xl border border-[#CBD5E1] p-1 shadow-lg text-[#0F172A]">
                      <button
                        onClick={() => setReviewZoom((z) => Math.min(z + 15, 250))}
                        className="p-1.5 hover:bg-[#F1F5F9] rounded cursor-pointer"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setReviewZoom((z) => Math.max(z - 15, 25))}
                        className="p-1.5 hover:bg-[#F1F5F9] rounded cursor-pointer"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setReviewZoom(75);
                          setReviewPan({ x: 0, y: 0 });
                        }}
                        className="p-1 text-[10px] font-mono font-bold hover:bg-[#F1F5F9] rounded cursor-pointer"
                        title="1:1 Native Resolution"
                      >
                        1:1
                      </button>
                      <span className="text-[10px] font-mono font-semibold px-1 text-[#64748B]">
                        {reviewZoom}%
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[11px] font-mono font-bold text-[#0F172A] shadow-md">
                      2D Nadir & 5-Camera Oblique Match
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL: AI EXTRACTION RESULTS */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden flex flex-col min-h-[500px]">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0F172A]" />
                      <h3 className="text-sm font-bold text-[#0F172A]">AI Extraction Results</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-[#CBD5E1] text-[#475569]">
                        Vector Cadastre (GeoJSON / PostGIS)
                      </span>
                    </div>

                    {/* Layer Controls Checkboxes */}
                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#475569]">
                        <input
                          type="checkbox"
                          checked={showParcelsLayer}
                          onChange={(e) => setShowParcelsLayer(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#0F172A] rounded"
                        />
                        <span>Parcels</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#475569]">
                        <input
                          type="checkbox"
                          checked={showBuildingsLayer}
                          onChange={(e) => setShowBuildingsLayer(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#0F172A] rounded"
                        />
                        <span>Buildings</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#475569]">
                        <input
                          type="checkbox"
                          checked={showRoadsLayer}
                          onChange={(e) => setShowRoadsLayer(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#0F172A] rounded"
                        />
                        <span>Roads</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#475569]">
                        <input
                          type="checkbox"
                          checked={showLabelsLayer}
                          onChange={(e) => setShowLabelsLayer(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#0F172A] rounded"
                        />
                        <span>Labels</span>
                      </label>
                    </div>
                  </div>

                  <div className="relative flex-1 w-full h-full min-h-[440px] bg-[#E2E8F0]">
                    <MapContainer
                      center={[12.9721, 77.5961]}
                      zoom={16}
                      scrollWheelZoom={true}
                      className="w-full h-full min-h-[440px]"
                      attributionControl={false}
                    >
                      <BaseTileLayer layer={mapBaseLayer} />

                      {showParcelsLayer &&
                        WORKSPACE_PARCELS.map((p) => (
                          <Polygon
                            key={p.id}
                            positions={p.coords}
                            pathOptions={{
                              color: p.color,
                              fillColor: p.color,
                              fillOpacity: 0.38,
                              weight: 2.5,
                            }}
                          >
                            <Popup>
                              <div className="p-1.5 text-xs">
                                <p className="font-bold text-[#0F172A] text-sm">{p.name}</p>
                                <p className="text-gray-500 font-mono">ID: {p.id}</p>
                                <p className="text-gray-500">Classification: {p.type}</p>
                                <p className="text-emerald-600 font-bold mt-1">Area: {p.area}</p>
                              </div>
                            </Popup>
                          </Polygon>
                        ))}

                      {showBuildingsLayer &&
                        WORKSPACE_BUILDINGS.map((b) => (
                          <Polygon
                            key={b.id}
                            positions={b.coords}
                            pathOptions={{
                              color: b.color,
                              fillColor: b.color,
                              fillOpacity: 0.55,
                              weight: 2,
                            }}
                          >
                            <Popup>
                              <div className="p-1.5 text-xs font-bold text-[#0F172A]">
                                {b.name} ({b.id})
                              </div>
                            </Popup>
                          </Polygon>
                        ))}

                      {showRoadsLayer &&
                        WORKSPACE_ROADS.map((r) => (
                          <Polyline
                            key={r.id}
                            positions={r.coords}
                            pathOptions={{
                              color: r.color,
                              weight: 4,
                              dashArray: '6, 6',
                            }}
                          >
                            <Popup>
                              <div className="p-1.5 text-xs font-bold text-[#0F172A]">
                                {r.name}
                              </div>
                            </Popup>
                          </Polyline>
                        ))}
                    </MapContainer>

                    {/* Floating Map Controls */}
                    <div className="absolute top-4 left-4 z-400 flex flex-col bg-white/95 backdrop-blur-md rounded-xl border border-[#CBD5E1] p-1 text-[#0F172A] shadow-lg">
                      <button
                        onClick={() =>
                          setMapBaseLayer(mapBaseLayer === 'osm' ? 'satellite' : 'osm')
                        }
                        title="Switch Basemap"
                        className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                      <button
                        disabled
                        title="Measure Tool (coming soon)"
                        className="p-2 rounded-lg text-[#94A3B8] opacity-50 cursor-not-allowed"
                      >
                        <Ruler className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setShowParcelsLayer(true);
                          setShowBuildingsLayer(true);
                          setShowRoadsLayer(true);
                          setShowLabelsLayer(true);
                          showToast('Reset all GIS overlays');
                        }}
                        title="Reset Layers"
                        className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-4 right-4 z-400 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CBD5E1] font-mono text-[11px] text-[#0F172A] shadow-md flex items-center gap-3">
                      <span>12.9721°N, 77.5961°E</span>
                      <span className="text-[#CBD5E1]">|</span>
                      <span>Scale 1:1,500</span>
                      <span className="text-[#CBD5E1]">|</span>
                      <span className="font-bold">EPSG:32644</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI STATISTICS SECTION (4 KPI CARDS) */}
              <div className="mb-8">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  AI EXTRACTION KEY PERFORMANCE INDICATORS
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#64748B] uppercase">
                          Detected Buildings
                        </span>
                        <Building className="w-4 h-4 text-[#0F172A]" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-[#0F172A] font-mono block">
                        38
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] mt-3">
                      DSM-rectified footprints & rooflines
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#64748B] uppercase">
                          Detected Parcels
                        </span>
                        <Layers className="w-4 h-4 text-[#10B981]" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-[#10B981] font-mono block">
                        16
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] mt-3">
                      Closed cadastral boundary plots
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#64748B] uppercase">
                          Detected Roads
                        </span>
                        <Navigation className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-[#F59E0B] font-mono block">
                        4.2 km
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] mt-3">
                      Topological road & lane centerlines
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#64748B] uppercase">
                          Confidence Score
                        </span>
                        <Sparkles className="w-4 h-4 text-[#4338CA]" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-[#4338CA] font-mono block">
                        98.6%
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] mt-3">
                      Ready for MAP-2 Ground Truthing
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* QUALITY VALIDATION SECTION */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      Topology & Quality Validation
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Automated topological integrity verification ensuring legal cadastral compliance.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#065F46]">
                    Quality Index: 99.1%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A] mb-0.5">
                        Parcel Topology Passed
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        0 gaps, 0 sliver polygons, properly shared nodes
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A] mb-0.5">
                        Building Overlap Passed
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        DSM elevation roofline overhangs rectified
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A] mb-0.5">
                        Road Continuity Passed
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        Topological connectivity and endpoint snapping verified
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#92400E] mb-0.5">
                        Manual Review Flagged
                      </p>
                      <p className="text-[11px] text-[#B45309]">
                        3 boundary segments recommended for GT inspection
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MANUAL REVIEW QUEUE SECTION */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-xs mb-8 overflow-hidden">
                <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      Manual Review Queue
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Inspect flagged spatial geometries before final cadastral sign-off.
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
                    {['ALL', 'FLAGGED', 'PARCELS', 'BUILDINGS', 'ROADS'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setReviewFilter(tab)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          reviewFilter === tab
                            ? 'bg-[#0F172A] text-white shadow-xs'
                            : 'text-[#475569] hover:text-[#0F172A]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th
                          className="py-3 px-6 cursor-pointer hover:text-[#0F172A]"
                          onClick={() => setSortAscending(!sortAscending)}
                        >
                          <div className="flex items-center gap-1">
                            <span>Object ID</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="py-3 px-6">Type</th>
                        <th className="py-3 px-6">Confidence</th>
                        <th className="py-3 px-6">Issue / Details</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredReviewItems.map((row) => (
                        <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3.5 px-6 font-mono font-bold text-[#0F172A]">
                            {row.id}
                          </td>
                          <td className="py-3.5 px-6 font-medium text-[#475569]">
                            {row.type}
                          </td>
                          <td className="py-3.5 px-6 font-mono font-semibold">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                parseFloat(row.confidence) > 95
                                  ? 'bg-[#ECFDF5] text-[#065F46]'
                                  : 'bg-[#FFFBEB] text-[#92400E]'
                              }`}
                            >
                              {row.confidence}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-[#475569] max-w-xs">
                            {row.issue}
                          </td>
                          <td className="py-3.5 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                row.status === 'Approved'
                                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                                  : row.status === 'Reviewed'
                                  ? 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]'
                                  : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                              }`}
                            >
                              {row.status === 'Approved' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              )}
                              {row.status === 'Reviewed' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                              )}
                              {row.status === 'Needs Review' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                              )}
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              onClick={() => toggleApproveQueueItem(row.id)}
                              className="px-3 py-1 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-[11px] font-bold transition-all cursor-pointer"
                            >
                              {row.status === 'Approved' ? 'Re-open' : 'Approve'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GIS DELIVERABLES & SURVEY REPORT PREVIEW (TWO COLUMNS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* GIS DELIVERABLES EXPORT CARD (7 COLS) */}
                <div className="lg:col-span-7 rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center">
                          <Download className="w-4.5 h-4.5" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A]">
                          Export Deliverables
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
                        OGC & PostGIS Ready
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                      Download verified vector spatial layers formatted for TNGIS,
                      State Land Stack, GeoServer, QGIS, and municipal land records
                      databases.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/export?format=geojson`);
                          if (!res.ok) throw new Error('Export failed');
                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'cadastral_export.geojson';
                          a.click();
                          URL.revokeObjectURL(url);
                          showToast('GeoJSON downloaded successfully');
                        } catch {
                          showToast('Export failed. Is the backend running?');
                        }
                      }}
                      className="py-3 px-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export GeoJSON</span>
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/export?format=shapefile`);
                          if (!res.ok) throw new Error('Export failed');
                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'cadastral_export.shp.zip';
                          a.click();
                          URL.revokeObjectURL(url);
                          showToast('Shapefile downloaded successfully');
                        } catch {
                          showToast('Export failed. Is the backend running?');
                        }
                      }}
                      className="py-3 px-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Shapefile</span>
                    </button>

                    <button
                      disabled
                      className="py-3 px-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Export GeoPackage</span>
                    </button>

                    <button
                      disabled
                      className="py-3 px-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>

                    <button
                      disabled
                      className="py-3 px-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Survey Report</span>
                    </button>

                    <button
                      disabled
                      className="py-3 px-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF Summary</span>
                    </button>
                  </div>
                </div>

                {/* SURVEY REPORT PREVIEW CARD (5 COLS) */}
                <div className="lg:col-span-5 rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F172A]/5 rounded-bl-full pointer-events-none" />

                  <div>
                    {/* Header Emblem */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-[#64748B]">
                          GOVERNMENT OF TAMIL NADU / SURVEY OF INDIA
                        </p>
                        <h4 className="text-sm font-black text-[#0F172A]">
                          Cadastral Extraction Report
                        </h4>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-[#0F172A]" />
                    </div>

                    {/* Summary Data */}
                    <div className="space-y-2 text-xs font-mono mb-4">
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Project Scheme</span>
                        <span className="font-bold text-[#0F172A]">NAKSHA DILRMP Sector 104</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Buildings Extracted</span>
                        <span className="font-bold text-[#0F172A]">38 Structures</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Parcels Extracted</span>
                        <span className="font-bold text-[#10B981]">16 Closed Plots</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Road Network</span>
                        <span className="font-bold text-[#F59E0B]">4.2 km Total</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Positional Accuracy</span>
                        <span className="font-bold text-[#0F172A]">±0.02m (RTK Fixed)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Overall Confidence</span>
                        <span className="font-bold text-[#4338CA]">98.6% Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready for Ground Truthing Submission
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Print Report
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('approval');
                          showToast('Navigating to Approval & Export Center');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <span>Approve & Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Page Footer */}
            <footer className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F172A]">NAKSHA Review & Quality Engine</span>
                <span>| Automated Cadastral Vector Verification</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('workspace')}
                  className="font-medium text-[#0F172A] hover:underline cursor-pointer"
                >
                  Return to Workspace
                </button>
                <span>·</span>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="font-medium text-[#0F172A] hover:underline cursor-pointer"
                >
                  Project Dashboard
                </button>
              </div>
            </footer>
          </div>
        </main>
  );
}
