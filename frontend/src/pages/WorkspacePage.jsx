import React, { useState } from 'react';
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
  Database,
  Download,
  FileText,
  Layers,
  Map as MapIcon,
  RotateCcw,
  Ruler,
  Sparkles,
  Table,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { WORKSPACE_PARCELS, WORKSPACE_BUILDINGS, WORKSPACE_ROADS } from '../data/mockData';

export default function WorkspacePage({ setCurrentView, showToast, showParcelsLayer, setShowParcelsLayer, showBuildingsLayer, setShowBuildingsLayer, showRoadsLayer, setShowRoadsLayer, showLabelsLayer, setShowLabelsLayer, mapBaseLayer, setMapBaseLayer }) {
  const [workspaceZoom, setWorkspaceZoom] = useState(70);
  const [workspacePan, setWorkspacePan] = useState({ x: 0, y: 0 });
  const [isPanningSource, setIsPanningSource] = useState(false);
  const [startPanSource, setStartPanSource] = useState({ x: 0, y: 0 });

  const handleMouseDownImage = (e) => {
    if (e.button !== 0) return;
    setIsPanningSource(true);
    setStartPanSource({ x: e.clientX - workspacePan.x, y: e.clientY - workspacePan.y });
  };

  const handleMouseMoveImage = (e) => {
    if (!isPanningSource) return;
    setWorkspacePan({
      x: e.clientX - startPanSource.x,
      y: e.clientY - startPanSource.y,
    });
  };

  const handleMouseUpImage = () => setIsPanningSource(false);

  return (
    <main className="flex-1 flex flex-col justify-between bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-16 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Section / Breadcrumbs / Title & Professional Metadata */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-[#0F172A] hover:underline cursor-pointer flex items-center gap-1"
                >
                  Project Overview
                </button>
                <span>&gt;</span>
                <span className="text-[#0F172A] font-semibold">Workspace</span>
              </div>

              {/* Label & Title */}
              <p className="text-[11px] tracking-[0.2em] font-bold uppercase text-[#64748B] mb-1">
                SURVEY OF INDIA / CADASTRAL PROCESSING
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-3">
                Urban Cadastral Processing Workspace
              </h1>

              {/* Professional GIS Metadata Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#64748B] font-mono">
                <div>
                  <span className="text-[#94A3B8]">EPSG: </span>
                  <span className="font-semibold text-[#0F172A]">32644 (UTM 44N)</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">CRS: </span>
                  <span className="font-semibold text-[#0F172A]">WGS 84</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">GSD: </span>
                  <span className="font-semibold text-[#0F172A]">5.0 cm/px</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Capture: </span>
                  <span className="font-semibold text-[#0F172A]">24 Aug 2026</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Dataset ID: </span>
                  <span className="font-semibold text-[#0F172A]">TN-ULB-104-RAMNAGAR</span>
                </div>
              </div>
            </div>

            {/* Status Indicator Badges & Review Results Button */}
            <div className="flex items-center gap-3 self-start lg:self-auto pt-1 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-xs text-xs font-semibold text-[#0F172A]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                <span>Dataset Uploaded</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-xs text-xs font-semibold text-[#0F172A]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                <span>Processing Ready</span>
              </div>
              {/* Review Results Navigation Button */}
              <button
                onClick={() => {
                  setCurrentView('review');
                  showToast('Opening Urban Cadastral Mapping Review');
                }}
                className="h-9 px-4 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Review Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Workflow Stepper: Active Step (Extract) */}
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
              <div className="flex items-center gap-2 text-[#0F172A] bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
                <Sparkles className="w-4 h-4 text-[#0F172A]" />
                <span className="font-bold">Extract (Active)</span>
              </div>
              <span className="text-[#CBD5E1]">&gt;</span>
              <button
                onClick={() => setCurrentView('review')}
                className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Review</span>
              </button>
              <span className="text-[#CBD5E1]">&gt;</span>
              <button
                onClick={() => setCurrentView('review')}
                className="flex items-center gap-2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* MAIN AREA: TWO EQUAL PANELS (50% LEFT / 50% RIGHT) - EXPANDED VIEWPORT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* LEFT PANEL: SOURCE DATASET VIEWER */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden flex flex-col min-h-[520px]">
              <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0F172A]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Source Dataset</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-[#CBD5E1] text-[#475569]">
                    Drone Orthophoto · GeoTIFF · 0.05m GSD
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => {
                      setWorkspaceZoom(70);
                      setWorkspacePan({ x: 0, y: 0 });
                      showToast('Reset source image view');
                    }}
                    title="Reset View"
                    className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#CBD5E1] text-[#475569] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none min-h-[460px]"
                onMouseDown={handleMouseDownImage}
                onMouseMove={handleMouseMoveImage}
                onMouseUp={handleMouseUpImage}
                onMouseLeave={handleMouseUpImage}
              >
                <div
                  className="relative transition-transform duration-75"
                  style={{
                    transform: `translate(${workspacePan.x}px, ${workspacePan.y}px) scale(${workspaceZoom / 100})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <img
                    src="/indian_satellite_aerial.jpg"
                    alt="Source Dataset"
                    className="max-w-[650px] w-auto h-auto rounded shadow-2xl block pointer-events-none"
                  />

                  {showParcelsLayer && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
                      <polygon
                        points="40,160 260,110 330,310 90,360"
                        fill="#10B981"
                        fillOpacity="0.25"
                        stroke="#10B981"
                        strokeWidth="3"
                      />
                      <polygon
                        points="265,108 520,60 560,260 335,308"
                        fill="#3B82F6"
                        fillOpacity="0.25"
                        stroke="#3B82F6"
                        strokeWidth="3"
                      />
                      <polygon
                        points="525,58 760,100 780,310 565,258"
                        fill="#8B5CF6"
                        fillOpacity="0.25"
                        stroke="#8B5CF6"
                        strokeWidth="3"
                      />
                      {showRoadsLayer && (
                        <polyline
                          points="0,320 330,305 565,255 800,285"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="4"
                          strokeDasharray="6 4"
                        />
                      )}
                    </svg>
                  )}
                </div>

                {/* Left Panel Floating Controls */}
                <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-xl border border-[#CBD5E1] p-1 shadow-lg text-[#0F172A]">
                  <button
                    onClick={() => setWorkspaceZoom((z) => Math.min(z + 15, 250))}
                    className="p-1.5 hover:bg-[#F1F5F9] rounded cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setWorkspaceZoom((z) => Math.max(z - 15, 25))}
                    className="p-1.5 hover:bg-[#F1F5F9] rounded cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setWorkspaceZoom(70);
                      setWorkspacePan({ x: 0, y: 0 });
                    }}
                    className="p-1 text-[10px] font-mono font-bold hover:bg-[#F1F5F9] rounded cursor-pointer"
                    title="1:1 Native Resolution"
                  >
                    1:1
                  </button>
                  <span className="text-[10px] font-mono font-semibold px-1 text-[#64748B]">
                    {workspaceZoom}%
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[11px] font-mono font-bold text-[#0F172A] shadow-md">
                  Survey Sheet #101-106 · Ramnagar
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: GIS MAP VIEWER (ArcGIS Layer Controls) */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden flex flex-col min-h-[520px]">
              <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-[#0F172A]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">GIS Map Viewer</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-[#CBD5E1] text-[#475569]">
                    EPSG:32644 (UTM 44N) · WGS 84
                  </span>
                </div>

                {/* ArcGIS-Style Clean Layer Controls */}
                <div className="flex items-center gap-3.5 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#334155] hover:text-[#0F172A]">
                    <input
                      type="checkbox"
                      checked={showParcelsLayer}
                      onChange={(e) => setShowParcelsLayer(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#0F172A] rounded cursor-pointer"
                    />
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981] inline-block"></span>
                    <span>Parcels</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#334155] hover:text-[#0F172A]">
                    <input
                      type="checkbox"
                      checked={showBuildingsLayer}
                      onChange={(e) => setShowBuildingsLayer(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#0F172A] rounded cursor-pointer"
                    />
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444] inline-block"></span>
                    <span>Buildings</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#334155] hover:text-[#0F172A]">
                    <input
                      type="checkbox"
                      checked={showRoadsLayer}
                      onChange={(e) => setShowRoadsLayer(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#0F172A] rounded cursor-pointer"
                    />
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B] inline-block"></span>
                    <span>Roads</span>
                  </label>
                </div>
              </div>

              <div className="relative flex-1 w-full h-full min-h-[460px] bg-[#E2E8F0]">
                <MapContainer
                  center={[12.9721, 77.5961]}
                  zoom={16}
                  scrollWheelZoom={true}
                  className="w-full h-full min-h-[460px]"
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
                          fillOpacity: 0.35,
                          weight: 2.5,
                        }}
                      >
                        <Popup>
                          <div className="p-1 text-xs">
                            <p className="font-bold text-[#0F172A]">{p.name}</p>
                            <p className="text-gray-500 font-mono">ID: {p.id}</p>
                            <p className="text-gray-500">Type: {p.type}</p>
                            <p className="text-emerald-600 font-semibold">Area: {p.area}</p>
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
                          fillOpacity: 0.5,
                          weight: 2,
                        }}
                      >
                        <Popup>
                          <div className="p-1 text-xs font-bold text-[#0F172A]">
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
                          <div className="p-1 text-xs font-bold text-[#0F172A]">
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
                    title="Switch Basemap (Street / Satellite)"
                    className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  <button
                    disabled
                    title="Measure Distance & Area (coming soon)"
                    className="p-2 rounded-lg text-[#94A3B8] opacity-50 cursor-not-allowed"
                  >
                    <Ruler className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowParcelsLayer(true);
                      setShowBuildingsLayer(true);
                      setShowRoadsLayer(true);
                      showToast('Reset all GIS layers');
                    }}
                    title="Reset View"
                    className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-4 right-4 z-400 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CBD5E1] font-mono text-[11px] text-[#0F172A] shadow-md flex items-center gap-3">
                  <span>12.9721°N, 77.5961°E</span>
                  <span className="text-[#CBD5E1]">|</span>
                  <span>1:2,000</span>
                  <span className="text-[#CBD5E1]">|</span>
                  <span className="font-bold">EPSG:32644</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROCESSING STATUS PANEL */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
              PIPELINE PROCESSING STATUS
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Dataset Loaded</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Georeferenced</span>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center gap-2.5 text-xs font-bold text-[#4338CA]">
                <Sparkles className="w-4 h-4 text-[#4338CA]" />
                <span>AI Extraction Running</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-2.5 text-xs font-semibold text-[#B45309]">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
                <span>Topology Validation</span>
              </div>

              <div
                onClick={() => setCurrentView('review')}
                className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center gap-2.5 text-xs font-bold text-[#0F172A] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Review Ready →</span>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL & EXPORT PANEL (CLEAN METRICS + MINIMAL PROGRESS BAR) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-7 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  PRELIMINARY EXTRACTION RESULTS
                </p>
                <button
                  onClick={() => setCurrentView('review')}
                  className="text-xs font-bold text-[#0F172A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Details in Review</span>
                  <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-2xl sm:text-3xl font-black text-[#0F172A] font-mono block mb-1">
                    38
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    Buildings Detected
                  </span>
                  <span className="text-[10px] text-[#64748B]">DSM-rectified footprints</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-2xl sm:text-3xl font-black text-[#10B981] font-mono block mb-1">
                    16
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    Parcel Boundaries
                  </span>
                  <span className="text-[10px] text-[#64748B]">Closed cadastral plots</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-2xl sm:text-3xl font-black text-[#F59E0B] font-mono block mb-1">
                    4.2 km
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    Road Segments
                  </span>
                  <span className="text-[10px] text-[#64748B]">Topological centerlines</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-2xl sm:text-3xl font-black text-[#0F172A] font-mono">
                        98.6%
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] block">
                      Confidence Score
                    </span>
                  </div>
                  {/* Minimal Thin Progress Bar */}
                  <div className="w-full mt-2">
                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0F172A] rounded-full" style={{ width: '98.6%' }}></div>
                    </div>
                    <span className="text-[10px] text-[#64748B] mt-1 block">Ground truthing ready</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  GIS-READY EXPORT
                </p>
                <p className="text-xs text-[#64748B] mb-4">
                  Export structured spatial layers formatted for TNGIS, QGIS, and Municipal GIS databases.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
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
                  className="py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
                  className="py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Shapefile</span>
                </button>

                <button
                  disabled
                  className="py-2.5 px-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-1.5 opacity-50 cursor-not-allowed"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Export GeoPackage</span>
                </button>

                <button
                  disabled
                  className="py-2.5 px-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-1.5 opacity-50 cursor-not-allowed"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Footer */}
        <footer className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">NAKSHA MAP-1 Pipeline</span>
            <span>| Automated Urban Cadastral Preparation Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="font-medium text-[#0F172A] hover:underline cursor-pointer"
            >
              Return to Dashboard
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentView('landing')}
              className="font-medium text-[#0F172A] hover:underline cursor-pointer"
            >
              Project Documentation
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
