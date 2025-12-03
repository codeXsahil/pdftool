
import { useState } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { FileUpload } from './components/FileUpload';
import { MetadataViewer } from './components/MetadataViewer';
import { MetadataEditor } from './components/MetadataEditor';
import { BatchAnalysis } from './components/BatchAnalysis';
import { PDFPreview } from './components/PDFPreview';
import { SecurityTools } from './components/SecurityTools';
import { AnalysisTools } from './components/AnalysisTools';
import { QualityTools } from './components/QualityTools';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import {
  extractMetadata, analyzeRisk, modifyMetadata, sanitizeMetadata, extractText, analyzeATS,
  watermarkPDF, compressPDF, analyzeFontsAndColors, extractLinks,
  analyzeHistory, analyzeGeoTags, convertToPDFA, analyzeQuality,
  type PDFMetadata, type RiskAnalysis, type ATSAnalysis, type FontColorAnalysis, type LinkAnalysis, type HistoryAnalysis, type QualityAnalysis
} from './utils/pdfUtils';
import { FileText, Edit, RefreshCw, ArrowLeft, Layout, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BatchItem {
  file: File;
  metadata: PDFMetadata;
  risk: RiskAnalysis;
  id: string;
  atsAnalysis?: ATSAnalysis;
  fontAnalysis?: FontColorAnalysis;
  linkAnalysis?: LinkAnalysis;
  historyAnalysis?: HistoryAnalysis;
  geoAnalysis?: string[];
  qualityAnalysis?: QualityAnalysis;
}

function App() {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const getActiveTab = () => {
    const path = location.pathname.substring(1); // remove leading slash
    if (path === '' || path === 'upload') return 'metadata';
    return path as 'metadata' | 'security' | 'analysis' | 'quality';
  };

  const activeTab = getActiveTab();


  const activeItem = batchItems.find(item => item.id === activeItemId);

  const handleFileSelect = async (files: File[]) => {
    setIsProcessing(true);
    try {
      const newItems: BatchItem[] = [];

      for (const file of files) {
        const extracted = await extractMetadata(file);
        const risk = await analyzeRisk(file, extracted);
        newItems.push({
          file,
          metadata: extracted,
          risk,
          id: Math.random().toString(36).substr(2, 9)
        });
      }

      setBatchItems(prev => [...prev, ...newItems]);

      if (newItems.length === 1 && batchItems.length === 0) {
        setActiveItemId(newItems[0].id);
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Failed to process one or more PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveMetadata = async (newMetadata: PDFMetadata) => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const modifiedPdfBytes = await modifyMetadata(activeItem.file, newMetadata);
      downloadFile(modifiedPdfBytes, `modified_${activeItem.file.name}`);

      const updatedItem = {
        ...activeItem,
        metadata: newMetadata,
        risk: await analyzeRisk(activeItem.file, newMetadata)
      };

      setBatchItems(prev => prev.map(item => item.id === activeItem.id ? updatedItem : item));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving metadata:', error);
      alert('Failed to save metadata.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSanitizeAll = async () => {
    if (!confirm('This will remove ALL metadata from all files and download them. Continue?')) return;
    setIsProcessing(true);
    try {
      for (const item of batchItems) {
        const sanitizedBytes = await sanitizeMetadata(item.file);
        downloadFile(sanitizedBytes, `sanitized_${item.file.name}`);
      }
      alert('All files sanitized and downloaded.');
    } catch (error) {
      console.error('Error sanitizing files:', error);
      alert('Failed to sanitize some files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanATS = async (jobDescription: string) => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const text = await extractText(activeItem.file);
      const analysis = analyzeATS(text, jobDescription);

      const updatedItem = { ...activeItem, atsAnalysis: analysis };
      setBatchItems(prev => prev.map(item => item.id === activeItem.id ? updatedItem : item));
    } catch (error) {
      console.error('ATS Scan failed:', error);
      alert('Failed to extract text for ATS scanning.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Phase 2 Handlers ---

  const handleWatermark = async (text: string) => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const watermarkedBytes = await watermarkPDF(activeItem.file, text);
      downloadFile(watermarkedBytes, `watermarked_${activeItem.file.name}`);
    } catch (error) {
      console.error('Watermarking failed:', error);
      alert('Failed to watermark PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompress = async () => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const compressedBytes = await compressPDF(activeItem.file);
      downloadFile(compressedBytes, `compressed_${activeItem.file.name}`);
    } catch (error) {
      console.error('Compression failed:', error);
      alert('Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePdfA = async () => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const pdfABytes = await convertToPDFA(activeItem.file);
      downloadFile(pdfABytes, `pdfa_${activeItem.file.name}`);
    } catch (error) {
      console.error('PDF/A conversion failed:', error);
      alert('Failed to convert to PDF/A.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeFonts = async () => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const analysis = await analyzeFontsAndColors(activeItem.file);
      const updatedItem = { ...activeItem, fontAnalysis: analysis };
      setBatchItems(prev => prev.map(item => item.id === activeItem.id ? updatedItem : item));
    } catch (error) {
      console.error('Font analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeLinks = async () => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const analysis = await extractLinks(activeItem.file);
      const updatedItem = { ...activeItem, linkAnalysis: analysis };
      setBatchItems(prev => prev.map(item => item.id === activeItem.id ? updatedItem : item));
    } catch (error) {
      console.error('Link analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeHistory = async () => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const analysis = await analyzeHistory(activeItem.file);
      const updatedItem = { ...activeItem, historyAnalysis: analysis };
      setBatchItems(prev => prev.map(item => item.id === activeItem.id ? updatedItem : item));
    } catch (error) {
      console.error('History analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeGeo = async () => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const analysis = await analyzeGeoTags(activeItem.file);
      const updatedItem = { ...activeItem, geoAnalysis: analysis };
      setBatchItems(prev => prev.map(item => item.id === activeItem.id ? updatedItem : item));
    } catch (error) {
      console.error('Geo analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Phase 3 Handlers ---

  const handleAnalyzeQuality = async () => {
    if (!activeItem) return;
    setIsProcessing(true);
    try {
      const analysis = await analyzeQuality(activeItem.file);
      const updatedItem = { ...activeItem, qualityAnalysis: analysis };
      setBatchItems(prev => prev.map(item => item.id === activeItem.id ? updatedItem : item));
    } catch (error) {
      console.error('Quality analysis failed:', error);
      alert('Failed to run quality analysis.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveItem = (id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
    if (activeItemId === id) {
      setActiveItemId(null);
      setIsEditing(false);
      navigate('/'); // Reset to home
    }
  };

  const handleReset = () => {
    setBatchItems([]);
    setActiveItemId(null);
    setIsEditing(false);
    navigate('/'); // Reset to home
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {batchItems.length === 0 ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <FileUpload onFileSelect={handleFileSelect} />
              </motion.div>
            ) : activeItem ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setActiveItemId(null); setIsEditing(false); }}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white truncate max-w-[200px] md:max-w-sm">
                        {activeItem.file.name}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {(activeItem.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={activeItem ? "p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" : "hidden"}
                      title="Toggle Preview"
                    >
                      <Layout size={20} className={showPreview ? "text-blue-400" : ""} />
                    </button>
                  </div>
                </div>

                {/* Split Screen Layout */}
                <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-300px)] min-h-[600px]">
                  {/* Left: Preview */}
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      className="lg:w-1/2 h-full flex flex-col"
                    >
                      <PDFPreview file={activeItem.file} />
                    </motion.div>
                  )}

                  {/* Right: Tools */}
                  <div className={showPreview ? "lg:w-1/2 overflow-y-auto pr-2" : "w-full overflow-y-auto"}>
                    {/* Tabs */}
                    <div className="flex mb-6 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                      <button
                        onClick={() => { navigate('/metadata'); setIsEditing(false); }}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'metadata' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                      >
                        Metadata & Risk
                      </button>
                      <button
                        onClick={() => navigate('/security')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                      >
                        Security & Tools
                      </button>
                      <button
                        onClick={() => navigate('/analysis')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                      >
                        Deep Analysis
                      </button>
                      <button
                        onClick={() => navigate('/quality')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'quality' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                      >
                        <CheckSquare size={16} className="inline mr-2" />
                        Quality
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                      <Routes>
                        <Route path="/" element={<Navigate to="/metadata" replace />} />
                        <Route path="/metadata" element={
                          <>
                            {!isEditing ? (
                              <>
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                                  >
                                    <Edit size={16} />
                                    <span>Edit Metadata</span>
                                  </button>
                                </div>
                                <MetadataViewer
                                  metadata={activeItem.metadata}
                                  riskAnalysis={activeItem.risk}
                                  onScanATS={handleScanATS}
                                  atsAnalysis={activeItem.atsAnalysis}
                                />
                              </>
                            ) : (
                              <MetadataEditor
                                initialMetadata={activeItem.metadata}
                                onSave={handleSaveMetadata}
                                onCancel={() => setIsEditing(false)}
                              />
                            )}
                          </>
                        } />

                        <Route path="/security" element={
                          <SecurityTools
                            onWatermark={handleWatermark}
                            onCompress={handleCompress}
                            onPdfA={handlePdfA}
                          />
                        } />

                        <Route path="/analysis" element={
                          <AnalysisTools
                            fontAnalysis={activeItem.fontAnalysis}
                            linkAnalysis={activeItem.linkAnalysis}
                            historyAnalysis={activeItem.historyAnalysis}
                            geoAnalysis={activeItem.geoAnalysis}
                            onAnalyzeFonts={handleAnalyzeFonts}
                            onAnalyzeLinks={handleAnalyzeLinks}
                            onAnalyzeHistory={handleAnalyzeHistory}
                            onAnalyzeGeo={handleAnalyzeGeo}
                          />
                        } />

                        <Route path="/quality" element={
                          <QualityTools
                            analysis={activeItem.qualityAnalysis}
                            onAnalyze={handleAnalyzeQuality}
                            isAnalyzing={isProcessing}
                          />
                        } />
                      </Routes>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="batch"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                  >
                    <RefreshCw size={18} />
                    <span>Start Over</span>
                  </button>
                </div>
                <BatchAnalysis
                  items={batchItems}
                  onRemove={handleRemoveItem}
                  onEdit={(id) => setActiveItemId(id)}
                  onSanitizeAll={handleSanitizeAll}
                />

                <div className="mt-8 border-t border-slate-800 pt-8">
                  <h3 className="text-lg font-medium text-slate-400 mb-4 text-center">Add more files?</h3>
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-blue-400 font-medium">Processing...</p>
              </div>
            </div>
          )}
        </div>
        <Footer
          onNavigate={(tab) => navigate(`/${tab}`)}
          onOpenLegal={(type) => setLegalModalType(type)}
        />
      </div>

      <LegalModal
        isOpen={!!legalModalType}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}

export default App;
