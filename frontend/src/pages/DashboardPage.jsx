import { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  Sparkles,
  MapPin,
  ChevronRight,
  Sliders,
  FileUp,
  Check,
  Loader2,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const FILE_TYPE_OPTIONS = [
  { value: 'drone_imagery', label: 'Drone Imagery' },
  { value: 'dsm', label: 'DSM (Digital Surface Model)' },
  { value: 'dtm', label: 'DTM (Digital Terrain Model)' },
  { value: 'cadastral_scan', label: 'Cadastral Scan' },
  { value: 'gnss_csv', label: 'GNSS CSV' },
  { value: 'vector', label: 'Vector (SHP/GeoJSON/KML/DXF)' },
  { value: 'unspecified', label: 'Other / Unspecified' },
];

function guessFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'drone_imagery';
  if (['tif', 'tiff'].includes(ext)) return 'drone_imagery';
  if (['pdf'].includes(ext)) return 'cadastral_scan';
  if (['csv'].includes(ext)) return 'gnss_csv';
  if (['shp', 'geojson', 'kml', 'dxf', 'gpkg'].includes(ext)) return 'vector';
  return 'unspecified';
}

export default function DashboardPage({ setCurrentView, showToast }) {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dragOver, setDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [fileType, setFileType] = useState('unspecified');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/health`)
      .then(res => {
        if (!cancelled) setBackendStatus(res.ok ? 'connected' : 'error');
      })
      .catch(() => {
        if (!cancelled) setBackendStatus('error');
      });
    return () => { cancelled = true; };
  }, []);

  const handleFiles = (files) => {
    if (files.length === 0) return;
    const file = files[0];
    setPendingFile(file);
    setFileType(guessFileType(file.name));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleBrowseClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', pendingFile);
    formData.append('file_type', fileType);

    try {
      const res = await fetch(`${API_URL}/datasets/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      showToast(`Uploaded: ${data.original_filename} (${(data.file_size_bytes / 1024).toFixed(0)} KB)`);
      setPendingFile(null);
      setCurrentView('workspace');
    } catch (err) {
      showToast(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelFile = () => {
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <main className="flex-1 flex flex-col justify-between bg-[#F8FAFC] text-[#0F172A] transition-colors duration-200">
      <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-16 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Header */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-7">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setCurrentView('landing')}
                  className="px-2.5 py-1 rounded-md bg-[#0F172A] hover:bg-[#1E293B] text-xs font-semibold text-white flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  ← Project Overview
                </button>
                <p className="text-[11px] tracking-[0.2em] font-semibold uppercase text-[#64748B]">
                  SURVEY OF INDIA / COSS CADASTRE WORKSPACE
                </p>
              </div>
              <h1 className="text-3xl sm:text-[36px] font-bold tracking-tight text-[#0F172A] mb-3">
                Urban Cadastral Mapping Workspace
              </h1>
              <div className="flex items-center gap-2">
                {backendStatus === 'checking' ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
                  </span>
                ) : backendStatus === 'connected' ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                  </span>
                ) : (
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
                  </span>
                )}
                <span className="text-[13.5px] font-medium text-[#64748B]">
                  {backendStatus === 'checking'
                    ? 'Checking backend connection…'
                    : backendStatus === 'connected'
                      ? 'NAKSHA Pilot Pipeline Active · PostGIS Connected'
                      : 'Backend unreachable — start the API server'}
                </span>
              </div>
            </div>

            {/* Header CTA Button */}
            <div className="flex items-center gap-3 self-start sm:self-auto pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-10 px-4.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white font-bold text-[13px] tracking-[0.08em] flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <FileUp className="w-4 h-4" strokeWidth={2.2} />
                <span>UPLOAD DATASET</span>
              </button>
            </div>
          </header>

          {/* Divider */}
          <div className="w-full h-px mb-8 bg-[#E2E8F0]" />

          {/* Hero Label */}
          <div className="mb-7">
            <p className="text-[11px] tracking-[0.2em] font-bold uppercase mb-2 text-[#64748B]">
              MAP-1 SURVEY STAGE
            </p>
            <h2 className="text-xl sm:text-[24px] font-bold tracking-tight text-[#0F172A] mb-2">
              Generate preliminary urban parcel maps from drone imagery & elevation data
            </h2>
            <p className="text-[14px] leading-relaxed max-w-4xl text-[#64748B]">
              Ingest Orthorectified Imagery (ORI), Digital Surface Models (DSM),
              Digital Terrain Models (DTM), and GNSS control points to
              automatically extract boundaries, building footprints, and road
              corridors.
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            accept=".tif,.tiff,.jpg,.jpeg,.png,.shp,.dxf,.geojson,.kml,.gpkg,.csv,.pdf,.asc,.img"
            className="hidden"
          />

          {/* Main Grid: Upload Card & Georeference Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Drag and Drop Upload Card */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative rounded-2xl border-2 border-dashed ${
                dragOver
                  ? 'border-[#0F172A] bg-[#F1F5F9] scale-[1.01]'
                  : pendingFile
                    ? 'border-[#22C55E] bg-white'
                    : 'border-[#E2E8F0] hover:border-[#94A3B8] bg-white'
              } shadow-xs transition-all duration-200 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[310px]`}
            >
              {!pendingFile ? (
                <>
                  <div className="w-13 h-13 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center mb-4">
                    <UploadCloud className="w-6 h-6 text-[#0F172A]" strokeWidth={1.75} />
                  </div>

                  <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#0F172A] mb-1.5">
                    {dragOver ? 'Drop file here' : 'Drop Drone Imagery, DSM/DTM, or Cadastral Scans'}
                  </h3>
                  <p className="text-[13.5px] text-[#64748B] max-w-md mb-6">
                    Supported: GeoTIFF (.tif), Photos (.jpg/.png), Shapefile (.shp), DXF, GeoJSON, CSV, PDF
                  </p>

                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="px-6 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white font-medium text-[14px] flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Browse Survey Datasets</span>
                  </button>
                </>
              ) : (
                <div className="w-full max-w-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#0F172A] truncate">{pendingFile.name}</p>
                      <p className="text-[12px] text-[#64748B]">{(pendingFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>

                  <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                    Dataset Type
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#0F172A] font-medium mb-5 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  >
                    {FILE_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading…</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload & Continue</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelFile}
                      disabled={uploading}
                      className="px-4 py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] text-[14px] font-medium cursor-pointer disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Georeference and Extract Card */}
            <div className="rounded-2xl border border-[#E2E8F0] hover:border-black bg-white shadow-xs hover:shadow-md transition-all duration-200 p-8 sm:p-10 flex flex-col justify-between min-h-[310px]">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#0F172A]" />
                  </div>

                  <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
                    NAKSHA Standard SOP
                  </span>
                </div>

                <h3 className="text-[18px] font-semibold text-[#0F172A] mb-1.5">
                  MAP-1 Automated Feature Extraction
                </h3>
                <p className="text-[14px] leading-relaxed text-[#64748B] mb-7">
                  Run the complete pipeline from raw drone photos & DSM/DTM
                  to preliminary GIS parcel layers for field ground truthing.
                </p>

                {/* Stepper Bar */}
                <div className="w-full rounded-xl py-3.5 px-6 flex items-center justify-between text-[13.5px] font-medium border border-[#E2E8F0] bg-[#F8FAFC] mb-7">
                  <button
                    onClick={() => setCurrentView('workspace')}
                    className="text-[#0F172A] font-bold hover:underline cursor-pointer"
                  >
                    Scan
                  </button>
                  <span className="text-[#CBD5E1]">&gt;</span>
                  <span className="text-[#334155]">GCP Fix</span>
                  <span className="text-[#CBD5E1]">&gt;</span>
                  <span className="text-[#F59E0B] font-semibold">AI Extract</span>
                  <span className="text-[#CBD5E1]">&gt;</span>
                  <span className="text-[#22C55E] font-semibold">Topology QA</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setCurrentView('workspace')}
                  className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0F172A] hover:underline transition-colors cursor-pointer"
                >
                  <span>Start extraction pipeline</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    &gt;
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* AI Georeference */}
            <div
              onClick={() => setCurrentView('workspace')}
              className="group rounded-2xl border border-[#E2E8F0] hover:border-black bg-white shadow-xs hover:shadow-md transition-all duration-200 p-7 sm:p-8 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3.5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                      <MapPin className="w-4.5 h-4.5 text-[#0F172A]" />
                    </div>
                    <h3 className="text-[17px] font-semibold text-[#0F172A]">
                      GNSS/CORS Control Point Fitting
                    </h3>
                  </div>
                  <ChevronRight className="w-4.5 h-4.5 text-[#94A3B8]" />
                </div>
                <p className="text-[14px] text-[#64748B] pl-[53px] mb-6">
                  Align Area of Interest (AOI) with Survey of India ground
                  control points (GCPs) and RTK Rover survey coordinates.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase">
                <span>OUTPUT</span>
                <span className="text-[#0F172A] font-semibold">
                  TRUE ORTHO-RECTIFIED IMAGE (ORI)
                </span>
              </div>
            </div>

            {/* AI Extraction */}
            <div
              onClick={() => setCurrentView('workspace')}
              className="group rounded-2xl border border-[#E2E8F0] hover:border-black bg-white shadow-xs hover:shadow-md transition-all duration-200 p-7 sm:p-8 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3.5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                      <Sliders className="w-4.5 h-4.5 text-[#0F172A]" />
                    </div>
                    <h3 className="text-[17px] font-semibold text-[#0F172A]">
                      AI Parcel & Building Segmentation
                    </h3>
                  </div>
                  <ChevronRight className="w-4.5 h-4.5 text-[#94A3B8]" />
                </div>
                <p className="text-[14px] text-[#64748B] pl-[53px] mb-6">
                  Extract parcel polygons, building footprints, and road
                  corridors with automated topology validation.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase">
                <span>OUTPUT</span>
                <span className="text-[#0F172A] font-semibold">
                  POSTGIS · SHAPEFILE · GEOJSON
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-[14px]">
          <span className="text-[#94A3B8]">
            Integration Ready:
          </span>
          <span className="font-medium text-[#94A3B8] cursor-not-allowed">
            TNGIS Digital Maps Repository
          </span>
          <span className="font-medium text-[#94A3B8] cursor-not-allowed">
            National Land Stack / DILRMP
          </span>
        </footer>
      </div>
    </main>
  );
}
