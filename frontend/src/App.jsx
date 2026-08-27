import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Grid,
  X,
} from 'lucide-react';
import L from 'leaflet';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import ReviewPage from './pages/ReviewPage';
import ApprovalPage from './pages/ApprovalPage';

// Fix Leaflet Default Marker Icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [toastMessage, setToastMessage] = useState(null);
  const [activeWorkflowModal, setActiveWorkflowModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Layer state shared between Workspace and Review pages
  const [showParcelsLayer, setShowParcelsLayer] = useState(true);
  const [showBuildingsLayer, setShowBuildingsLayer] = useState(true);
  const [showRoadsLayer, setShowRoadsLayer] = useState(true);
  const [showLabelsLayer, setShowLabelsLayer] = useState(true);
  const [mapBaseLayer, setMapBaseLayer] = useState('satellite');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3500);
  };


  const layerProps = {
    showParcelsLayer, setShowParcelsLayer,
    showBuildingsLayer, setShowBuildingsLayer,
    showRoadsLayer, setShowRoadsLayer,
    showLabelsLayer, setShowLabelsLayer,
    mapBaseLayer, setMapBaseLayer,
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-black selection:text-white flex flex-col">

      {/* Global Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs transition-all">
        <div className="max-w-[1520px] w-[94vw] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/GEODRAFT.svg"
              alt="GeoDraft logo"
              className="h-10 w-auto group-hover:scale-105 transition-transform"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold tracking-tight text-[#0F172A] font-sans">
                GEO-DRAFT
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] ml-1">
                NAKSHA · TNGIS
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-[#475569]">
            <a
              href="#features"
              onClick={() => setCurrentView('landing')}
              className="hover:text-[#0F172A] transition-colors"
            >
              System Requirements
            </a>
            <a
              href="#workflow"
              onClick={() => setCurrentView('landing')}
              className="hover:text-[#0F172A] transition-colors"
            >
              NAKSHA SOP
            </a>
            <a
              href="#extraction-preview"
              onClick={() => setCurrentView('landing')}
              className="hover:text-[#0F172A] transition-colors"
            >
              GeoAI Pipeline
            </a>
            <a
              href="#benefits"
              onClick={() => setCurrentView('landing')}
              className="hover:text-[#0F172A] transition-colors"
            >
              Stakeholder Value
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setCurrentView(currentView === 'landing' ? 'dashboard' : 'landing')
              }
              className={`h-9 px-3.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-sm'
                  : 'bg-white border-[#CBD5E1] text-[#334155] hover:text-[#0F172A] hover:border-[#94A3B8] shadow-xs'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-current" />
              <span>
                {currentView === 'landing' ? 'Dashboard' : '← Project Overview'}
              </span>
              {currentView !== 'dashboard' && (
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse ml-0.5"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="h-9 px-4 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Start Cadastral Survey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Page Views */}
      {currentView === 'landing' ? (
        <LandingPage setCurrentView={setCurrentView} showToast={showToast} />
      ) : currentView === 'dashboard' ? (
        <DashboardPage setCurrentView={setCurrentView} showToast={showToast} />
      ) : currentView === 'workspace' ? (
        <WorkspacePage setCurrentView={setCurrentView} showToast={showToast} {...layerProps} />
      ) : currentView === 'review' ? (
        <ReviewPage setCurrentView={setCurrentView} showToast={showToast} {...layerProps} />
      ) : (
        <ApprovalPage setCurrentView={setCurrentView} showToast={showToast} />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#0F172A] text-white shadow-xl flex items-center gap-3 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Workflow Modal */}
      {activeWorkflowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 bg-white text-[#0F172A] shadow-2xl relative">
            <button
              onClick={() => setActiveWorkflowModal(null)}
              className="absolute top-5 right-5 p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  NAKSHA MAP-1 Feature Extraction Pipeline
                </h3>
                <p className="text-xs text-[#64748B]">
                  Automated Urban Parcel & Building Vectorizer
                </p>
              </div>
            </div>

            <p className="text-sm text-[#475569] leading-relaxed mb-6">
              Execute full 4-stage pipeline: Drone ORI/DSM ingestion → GNSS/CORS ground
              control fitting → AI parcel & building extraction (U-Net/Mask R-CNN) →
              Automated topology validation.
            </p>

            <div className="rounded-xl p-4 mb-6 border border-[#E2E8F0] bg-[#F8FAFC] text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Target Datum</span>
                <span className="text-[#0F172A] font-semibold">EPSG:32644 (UTM 44N) / TNGIS PostGIS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Extraction Models</span>
                <span className="text-[#0F172A] font-semibold">U-Net, Mask R-CNN, DSM-Height Disambiguator</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">GIS Deliverables</span>
                <span className="text-[#0F172A] font-semibold">
                  PostGIS Tables, Shapefile (.shp), GeoJSON, GeoPackage
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    setActiveWorkflowModal(null);
                    setCurrentView('workspace');
                    showToast('Opening Urban Cadastral Processing Workspace');
                  }, 1000);
                }}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing NAKSHA Pipeline...</span>
                  </>
                ) : (
                  <>
                    <span>Open in Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveWorkflowModal(null)}
                className="px-4 py-2.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
