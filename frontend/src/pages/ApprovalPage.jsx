import React, { useState } from 'react';
import {
  MapContainer,
  Polygon,
  Polyline,
  CircleMarker,
  Popup,
} from 'react-leaflet';
import BaseTileLayer from '../components/BaseTileLayer';
import {
  Check,
  CheckCircle2,
  Layers,
  Ruler,
  ShieldCheck,
  X,
} from 'lucide-react';
import { APPROVAL_PARCELS, APPROVAL_GCP_POINTS, WORKSPACE_ROADS, WORKSPACE_BUILDINGS } from '../data/mockData';

export default function ApprovalPage({ setCurrentView, showToast }) {
  const [approvalParcelsList, setApprovalParcelsList] = useState(APPROVAL_PARCELS);
  const [selectedApprovalParcel, setSelectedApprovalParcel] = useState(APPROVAL_PARCELS[3]);
  const [showApprovalParcels, setShowApprovalParcels] = useState(true);
  const [showApprovalBuildings, setShowApprovalBuildings] = useState(true);
  const [showApprovalRoads, setShowApprovalRoads] = useState(true);
  const [showApprovalValidation, setShowApprovalValidation] = useState(true);
  const [approvalMapBaseLayer, setApprovalMapBaseLayer] = useState('satellite');
  const [isSubmittedVerification, setIsSubmittedVerification] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  const handleApproveParcel = () => {
    if (!selectedApprovalParcel) return;
    const updatedParcel = { ...selectedApprovalParcel, status: 'Approved', color: '#047857' };
    setSelectedApprovalParcel(updatedParcel);
    setApprovalParcelsList((prev) => prev.map((p) => (p.id === selectedApprovalParcel.id ? updatedParcel : p)));
    showToast(`✓ Parcel ${selectedApprovalParcel.id} marked as Approved`);
  };

  const handleFlagParcel = () => {
    if (!selectedApprovalParcel) return;
    const updatedParcel = { ...selectedApprovalParcel, status: 'Flagged', color: '#B91C1C' };
    setSelectedApprovalParcel(updatedParcel);
    setApprovalParcelsList((prev) => prev.map((p) => (p.id === selectedApprovalParcel.id ? updatedParcel : p)));
    showToast(`⚑ Parcel ${selectedApprovalParcel.id} flagged for ground re-survey`);
  };

  return (
    <>
      <main className="flex-1 flex flex-col justify-between bg-[#F8FAFC] text-[#0F172A]">
        <div className="w-full max-w-[1580px] w-[96vw] mx-auto px-3 sm:px-6 lg:px-8 pt-5 pb-8 flex-1 flex flex-col justify-between">
          <div>
            {/* Top Page Header (Enterprise Gov GIS Portal Style) */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-[#CBD5E1]">
              <div>
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] mb-1.5">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="hover:text-[#0F172A] hover:underline cursor-pointer"
                  >
                    Project Overview
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => setCurrentView('workspace')}
                    className="hover:text-[#0F172A] hover:underline cursor-pointer"
                  >
                    Workspace
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => setCurrentView('review')}
                    className="hover:text-[#0F172A] hover:underline cursor-pointer"
                  >
                    Review
                  </button>
                  <span>/</span>
                  <span className="text-[#0F172A] font-semibold">Approval & Export</span>
                </div>

                {/* Title & Official Status Label */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                    Cadastral Approval & Export
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#475569]">Project Status:</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#047857] text-white text-xs font-bold font-mono">
                      <Check className="w-3.5 h-3.5" />
                      Ready for Verification
                    </span>
                  </div>
                </div>

                {/* High-density Enterprise Metadata Strip */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#475569] font-mono">
                  <div>
                    <span className="text-[#64748B]">Project: </span>
                    <span className="font-semibold text-[#0F172A]">
                      Urban Parcel Survey (Ramnagar Sector 104)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Survey Area: </span>
                    <span className="font-semibold text-[#0F172A]">12.4 sq km</span>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Total Parcels: </span>
                    <span className="font-semibold text-[#047857]">184 Validated</span>
                  </div>
                  <div>
                    <span className="text-[#64748B]">CRS: </span>
                    <span className="font-semibold text-[#0F172A]">EPSG:32644 (UTM 44N) · WGS 84</span>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Standard: </span>
                    <span className="font-semibold text-[#0F172A]">MAP-3 / DILRMP Final Delivery</span>
                  </div>
                </div>
              </div>

              {/* Right Action Header Buttons */}
              <div className="flex items-center gap-2.5 self-start lg:self-auto">
                <button
                  onClick={() => setCurrentView('review')}
                  className="h-8 px-3 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-xs font-semibold text-[#334155] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>← Back to Review</span>
                </button>
                <button
                  onClick={() => setVerificationModalOpen(true)}
                  className="h-8 px-3.5 rounded-md bg-[#0F172A] hover:bg-[#1E293B] active:scale-98 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Submit for Verification</span>
                </button>
              </div>
            </div>

            {/* Stepper (Compact Enterprise Bar) */}
            <div className="my-3.5 w-full rounded-md border border-[#CBD5E1] bg-white px-4 py-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-[#475569]">
                  <Check className="w-3.5 h-3.5 text-[#047857]" />
                  <span>1. Upload</span>
                </div>
                <span className="text-[#CBD5E1]">/</span>
                <div className="flex items-center gap-1.5 text-[#475569]">
                  <Check className="w-3.5 h-3.5 text-[#047857]" />
                  <span>2. Georeference</span>
                </div>
                <span className="text-[#CBD5E1]">/</span>
                <div className="flex items-center gap-1.5 text-[#475569]">
                  <Check className="w-3.5 h-3.5 text-[#047857]" />
                  <span>3. Extract</span>
                </div>
                <span className="text-[#CBD5E1]">/</span>
                <div className="flex items-center gap-1.5 text-[#475569]">
                  <Check className="w-3.5 h-3.5 text-[#047857]" />
                  <span>4. Review</span>
                </div>
                <span className="text-[#CBD5E1]">/</span>
                <div className="flex items-center gap-1.5 text-[#0F172A] bg-[#F1F5F9] px-2.5 py-0.5 rounded-md border border-[#CBD5E1]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span className="font-bold">5. Approval & Export (Active)</span>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT: CLEAN 2-COLUMN GIS WORKSPACE (MAP VIEWER ~68% / ADMINISTRATIVE PANEL ~32%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 items-start">

              {/* ================================================================= */}
              {/* LEFT/CENTER: DOMINANT GIS MAP VIEWER (8 OF 12 COLS ≈ 67%) */}
              {/* ================================================================= */}
              <div className="lg:col-span-8 rounded-md border border-[#CBD5E1] bg-white overflow-hidden flex flex-col h-[600px] shadow-2xs">
                {/* Restrained ArcGIS-Style Header Toolbar */}
                <div className="px-4 py-2.5 border-b border-[#CBD5E1] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0F172A]" />
                    <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                      GIS Map Viewer
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white border border-[#CBD5E1] text-[#475569]">
                      EPSG:32644 (UTM 44N) · WGS 84
                    </span>
                  </div>

                  {/* ArcGIS-Style Checkbox Layer Controls */}
                  <div className="flex items-center gap-3.5 text-xs font-medium">
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#0F172A] select-none">
                      <input
                        type="checkbox"
                        checked={showApprovalParcels}
                        onChange={(e) => setShowApprovalParcels(e.target.checked)}
                        className="rounded text-[#0F172A] accent-[#0F172A] cursor-pointer"
                      />
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#047857]" />
                      <span>Parcels</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#0F172A] select-none">
                      <input
                        type="checkbox"
                        checked={showApprovalBuildings}
                        onChange={(e) => setShowApprovalBuildings(e.target.checked)}
                        className="rounded text-[#0F172A] accent-[#0F172A] cursor-pointer"
                      />
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#B91C1C]" />
                      <span>Buildings</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#0F172A] select-none">
                      <input
                        type="checkbox"
                        checked={showApprovalRoads}
                        onChange={(e) => setShowApprovalRoads(e.target.checked)}
                        className="rounded text-[#0F172A] accent-[#0F172A] cursor-pointer"
                      />
                      <span className="w-2.5 h-1 bg-[#D97706]" />
                      <span>Roads</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#0F172A] select-none">
                      <input
                        type="checkbox"
                        checked={showApprovalValidation}
                        onChange={(e) => setShowApprovalValidation(e.target.checked)}
                        className="rounded text-[#0F172A] accent-[#0F172A] cursor-pointer"
                      />
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                      <span>Validation</span>
                    </label>
                  </div>
                </div>

                {/* Map Viewport */}
                <div className="relative flex-1 bg-[#0F172A] h-[550px]">
                  <MapContainer
                    center={[12.9721, 77.5961]}
                    zoom={17}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    className="z-0"
                  >
                    <BaseTileLayer layer={approvalMapBaseLayer} />

                    {/* Render Cadastral Parcels */}
                    {showApprovalParcels &&
                      approvalParcelsList.map((p) => {
                        const isSelected = selectedApprovalParcel.id === p.id;
                        const fillColor = p.status === 'Approved' ? '#047857' : p.status === 'Flagged' ? '#B91C1C' : '#D97706';
                        return (
                          <Polygon
                            key={p.id}
                            positions={p.coords}
                            pathOptions={{
                              color: isSelected ? '#38BDF8' : fillColor,
                              fillColor: fillColor,
                              fillOpacity: isSelected ? 0.6 : 0.35,
                              weight: isSelected ? 3 : 1.5,
                            }}
                            eventHandlers={{
                              click: () => {
                                setSelectedApprovalParcel(p);
                                showToast(`Selected ${p.id} (${p.area}) · Status: ${p.status}`);
                              },
                            }}
                          >
                            <Popup>
                              <div className="text-xs p-1">
                                <p className="font-bold text-[#0F172A] text-sm">{p.id} - {p.name}</p>
                                <p className="text-[#64748B]">{p.khasraNo}</p>
                                <div className="mt-2 space-y-1 font-mono text-[11px]">
                                  <p>Area: <span className="font-bold">{p.area}</span></p>
                                  <p>Perimeter: <span className="font-bold">{p.perimeter}</span></p>
                                  <p>Land Use: <span className="font-bold">{p.landUse}</span></p>
                                  <p>Status: <span className="font-bold text-[#047857]">{p.status}</span></p>
                                </div>
                              </div>
                            </Popup>
                          </Polygon>
                        );
                      })}

                    {/* Render Buildings */}
                    {showApprovalBuildings &&
                      WORKSPACE_BUILDINGS.map((b) => (
                        <Polygon
                          key={b.id}
                          positions={b.coords}
                          pathOptions={{
                            color: '#B91C1C',
                            fillColor: '#B91C1C',
                            fillOpacity: 0.65,
                            weight: 1.5,
                          }}
                        >
                          <Popup>
                            <div className="text-xs p-1">
                              <p className="font-bold text-[#0F172A]">{b.name}</p>
                              <p className="text-[#64748B]">Type: Building Footprint</p>
                            </div>
                          </Popup>
                        </Polygon>
                      ))}

                    {/* Render Roads */}
                    {showApprovalRoads &&
                      WORKSPACE_ROADS.map((r) => (
                        <Polyline
                          key={r.id}
                          positions={r.coords}
                          pathOptions={{
                            color: '#D97706',
                            weight: 3.5,
                            opacity: 0.9,
                          }}
                        >
                          <Popup>
                            <div className="text-xs p-1">
                              <p className="font-bold text-[#0F172A]">{r.name}</p>
                              <p className="text-[#64748B]">Width: 4.5m Village Corridor</p>
                            </div>
                          </Popup>
                        </Polyline>
                      ))}

                    {/* Render Validation Layer (CORS GCPs / Monuments) */}
                    {showApprovalValidation &&
                      APPROVAL_GCP_POINTS.map((gcp) => (
                        <CircleMarker
                          key={gcp.id}
                          center={gcp.coords}
                          radius={5}
                          pathOptions={{
                            color: '#1D4ED8',
                            fillColor: '#3B82F6',
                            fillOpacity: 0.9,
                            weight: 2,
                          }}
                        >
                          <Popup>
                            <div className="text-xs p-1">
                              <p className="font-bold text-[#0F172A]">{gcp.id} - {gcp.name}</p>
                              <p className="text-[#64748B]">Classification: {gcp.type}</p>
                              <p className="text-emerald-600 font-mono text-[10px] font-bold mt-1">✓ RTK Fixed / CORS Locked</p>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                  </MapContainer>

                  {/* Floating Controls Toolbar */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-md border border-[#CBD5E1] shadow-xs">
                    <button
                      onClick={() =>
                        setApprovalMapBaseLayer((prev) => (prev === 'satellite' ? 'osm' : 'satellite'))
                      }
                      className="p-1.5 rounded-sm hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Toggle Basemap"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="text-[10px]">
                        {approvalMapBaseLayer === 'satellite' ? 'Satellite' : 'Vector'}
                      </span>
                    </button>
                    <button
                      disabled
                      className="p-1.5 rounded-sm text-[#94A3B8] text-xs font-bold flex items-center gap-1 opacity-50 cursor-not-allowed"
                      title="Measure Distance (coming soon)"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Measure</span>
                    </button>
                  </div>

                  {/* Selected Active Parcel Readout on Map */}
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-md border border-[#CBD5E1] shadow-xs text-xs font-mono">
                    <span className="text-[#64748B] block text-[9px] font-bold uppercase tracking-wider font-sans">
                      Active Selection
                    </span>
                    <span className="font-bold text-[#0F172A] text-xs">
                      {selectedApprovalParcel.id} · {selectedApprovalParcel.area}
                    </span>
                    <span
                      className={`block text-[10px] font-bold ${
                        selectedApprovalParcel.status === 'Approved'
                          ? 'text-[#047857]'
                          : selectedApprovalParcel.status === 'Flagged'
                          ? 'text-[#B91C1C]'
                          : 'text-[#D97706]'
                      }`}
                    >
                      ● {selectedApprovalParcel.status}
                    </span>
                  </div>

                  {/* Clean Status & Legend Bar at Bottom */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 flex flex-wrap items-center justify-between gap-2 bg-[#0F172A]/90 backdrop-blur-xs px-3 py-1.5 rounded-md border border-white/10 text-[10px] text-white font-mono">
                    <div className="flex items-center gap-3">
                      <span>12.9721°N, 77.5961°E</span>
                      <span className="text-white/40">|</span>
                      <span>Scale 1:1,500</span>
                      <span className="text-white/40">|</span>
                      <span>GSD: 5.0 cm/px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[#34D399]">
                        <span className="w-2 h-2 rounded-full bg-[#047857]" /> Approved
                      </span>
                      <span className="flex items-center gap-1 text-[#FBBF24]">
                        <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Pending
                      </span>
                      <span className="flex items-center gap-1 text-[#F87171]">
                        <span className="w-2 h-2 rounded-full bg-[#B91C1C]" /> Flagged
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* RIGHT SIDEBAR: CLEAN ADMINISTRATIVE PANEL (4 OF 12 COLS ≈ 33%) */}
              {/* ================================================================= */}
              <div className="lg:col-span-4 space-y-3.5">

                {/* SECTION 1: PARCEL INFORMATION */}
                <div className="rounded-md border border-[#CBD5E1] bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                        CADASTRAL RECORD
                      </p>
                      <h3 className="text-xs font-bold text-[#0F172A]">
                        Parcel Information ({selectedApprovalParcel.id})
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#0F172A] px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1]">
                      {selectedApprovalParcel.khasraNo}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono mb-3">
                    <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B] font-sans">Parcel ID</span>
                      <span className="font-bold text-[#0F172A]">{selectedApprovalParcel.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B] font-sans">Area</span>
                      <span className="font-bold text-[#0F172A]">{selectedApprovalParcel.area}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B] font-sans">Perimeter</span>
                      <span className="font-bold text-[#0F172A]">{selectedApprovalParcel.perimeter}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B] font-sans">Buildings</span>
                      <span className="font-bold text-[#0F172A]">{selectedApprovalParcel.buildings} Structures</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B] font-sans">Coordinates</span>
                      <span className="font-bold text-[#0F172A] text-[11px]">{selectedApprovalParcel.coordinates}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B] font-sans">Land Use</span>
                      <span className="font-bold text-[#0F172A] font-sans">{selectedApprovalParcel.landUse}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B] font-sans">Validation Status</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                          selectedApprovalParcel.status === 'Approved'
                            ? 'bg-[#047857] text-white'
                            : selectedApprovalParcel.status === 'Flagged'
                            ? 'bg-[#B91C1C] text-white'
                            : 'bg-[#D97706] text-white'
                        }`}
                      >
                        {selectedApprovalParcel.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: APPROVAL ACTIONS */}
                <div className="rounded-md border border-[#CBD5E1] bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                        CADASTRAL QA
                      </p>
                      <h3 className="text-xs font-bold text-[#0F172A]">
                        Approval Actions
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Officer Review
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] mb-3 leading-relaxed">
                    Review the active parcel geometry against drone orthomosaics and approve or flag for field ground-truthing.
                  </p>

                  {/* Interactive Parcel Action Buttons */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={handleApproveParcel}
                      className="flex-1 py-2 px-3 rounded-md bg-[#047857] hover:bg-[#065F46] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Parcel</span>
                    </button>
                    <button
                      onClick={handleFlagParcel}
                      className="flex-1 py-2 px-3 rounded-md border border-[#B91C1C] text-[#B91C1C] hover:bg-[#FEF2F2] active:scale-98 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Flag for Review</span>
                    </button>
                  </div>

                  {/* Final Submission Button */}
                  <div className="pt-2.5 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => setVerificationModalOpen(true)}
                      className="w-full py-2.5 px-3.5 rounded-md bg-[#0F172A] hover:bg-[#1E293B] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Submit for Verification</span>
                    </button>
                  </div>
                </div>

                {/* SECTION 3: EXPORT OPTIONS (ENTERPRISE GIS TOOLS MATRIX) */}
                <div className="rounded-md border border-[#CBD5E1] bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                        GIS DELIVERABLES
                      </p>
                      <h3 className="text-xs font-bold text-[#0F172A]">
                        Export Options
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      OGC Standard
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* GeoJSON */}
                    <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0F172A] block">GeoJSON</span>
                        <span className="text-[11px] text-[#64748B] font-mono">RFC 7946 / EPSG:32644</span>
                      </div>
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
                        className="px-2.5 py-1 rounded bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Export
                      </button>
                    </div>

                    {/* Shapefile */}
                    <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0F172A] block">Shapefile (.shp)</span>
                        <span className="text-[11px] text-[#64748B] font-mono">ArcGIS / PostGIS Bundle</span>
                      </div>
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
                        className="px-2.5 py-1 rounded bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Export
                      </button>
                    </div>

                    {/* GeoPackage */}
                    <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0F172A] block">GeoPackage (.gpkg)</span>
                        <span className="text-[11px] text-[#64748B] font-mono">SQLite / OGC Container</span>
                      </div>
                      <button
                        disabled
                        className="px-2.5 py-1 rounded bg-[#0F172A] text-white text-[11px] font-bold opacity-50 cursor-not-allowed"
                      >
                        Export
                      </button>
                    </div>

                    {/* CSV Report */}
                    <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0F172A] block">CSV Report</span>
                        <span className="text-[11px] text-[#64748B] font-mono">Cadastral Attribute Table</span>
                      </div>
                      <button
                        disabled
                        className="px-2.5 py-1 rounded bg-[#0F172A] text-white text-[11px] font-bold opacity-50 cursor-not-allowed"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Simple Government Footer */}
          <footer className="pt-3 mt-4 border-t border-[#CBD5E1] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
            <p className="font-medium text-[#475569]">
              Survey of India • NAKSHA Urban Cadastral Mapping Platform
            </p>
            <p className="font-mono text-[10px] text-[#64748B]">
              DoLR / DILRMP Cadastral Delivery Gateway · Version 2.4.0
            </p>
          </footer>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* OFFICIAL VERIFICATION SUBMISSION MODAL */}
      {/* ========================================================================= */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-lg border border-[#CBD5E1] p-6 bg-white text-[#0F172A] shadow-xl relative">
            <button
              onClick={() => setVerificationModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-[#F1F5F9] text-[#64748B] hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-md bg-[#0F172A] text-white flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Submit Cadastre for Official Verification
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Government of Tamil Nadu · Survey of India (NAKSHA Portal)
                </p>
              </div>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed mb-3.5">
              You are submitting the verified cadastral dataset for <strong>Urban Parcel Survey (Ramnagar Sector 104)</strong> to the State Land Records and Settlement Authority.
            </p>

            <div className="rounded-md p-3 mb-4 border border-[#CBD5E1] bg-[#F8FAFC] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Approved Parcels</span>
                <span className="text-[#047857] font-bold">184 Closed Polygons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Buildings Extracted</span>
                <span className="text-[#0F172A] font-bold">267 Footprints</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Road Networks</span>
                <span className="text-[#0F172A] font-bold">4.2 km Centerlines</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Positional Accuracy</span>
                <span className="text-[#0F172A] font-bold">±0.02m (RTK Fixed / CORS Locked)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Target Node</span>
                <span className="text-[#0F172A] font-bold">DoLR / DILRMP Master Registry</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setIsSubmittedVerification(true);
                  setVerificationModalOpen(false);
                  showToast('✓ Successfully submitted dataset for Official Government Verification!');
                }}
                className="flex-1 py-2.5 px-3.5 rounded-md bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-98"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirm & Submit to Authority</span>
              </button>
              <button
                onClick={() => setVerificationModalOpen(false)}
                className="px-3.5 py-2.5 rounded-md border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
